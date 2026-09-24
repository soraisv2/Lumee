export const vertexShader = /* glsl */ `
varying vec2 vUv;
varying vec2 vPos;
uniform vec2 uUvScale;
uniform vec2 uUvOffset;
void main() {
  vUv = uv * uUvScale + uUvOffset;
  vPos = position.xy;
  gl_Position = vec4(position, 1.0);
}
`;

// Relights a photo from a height field: surface normals (baked or derived),
// a pointer-driven point light with diffuse + specular response, soft
// ray-marched self-shadows, and optional removal of the photo's own lighting.
export const fragmentShader = /* glsl */ `
varying vec2 vUv;
varying vec2 vPos;
uniform sampler2D uTexture;
uniform sampler2D uBlurTexture;
uniform sampler2D uDepthMap;
uniform sampler2D uNormalMap;
uniform int uHasDepthMap;
uniform int uHasNormalMap;
uniform vec2 uUvScale;
uniform vec2 uUvOffset;
uniform float uAspect;
uniform float uDisplacement;
uniform float uShadowSoftness;
uniform vec3 uLightPos;
uniform vec3 uLightColor;
uniform float uLightIntensity;
uniform float uFalloff;
uniform float uAmbient;
uniform vec3 uAmbientColor;
uniform float uDepthFromLight;
uniform float uDepthContrast;
uniform int uInvertDepth;
uniform float uNormalStrength;
uniform float uDetail;
uniform float uShadowIntensity;
uniform float uColorPreserve;
uniform float uSpecular;
uniform float uShininess;
uniform float uFlatten;
uniform vec3 uBackgroundColor;

float photoLuma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

float depthAt(vec2 uv) {
  uv = clamp(uv, 0.0, 1.0);
  float d;
  if (uHasDepthMap == 1) {
    d = texture2D(uDepthMap, uv).r;
  } else {
    d = mix(1.0 - uv.y, photoLuma(texture2D(uBlurTexture, uv).rgb), uDepthFromLight);
    d = clamp((d - 0.5) * uDepthContrast + 0.5, 0.0, 1.0);
  }
  return uInvertDepth == 1 ? 1.0 - d : d;
}

float heightAt(vec2 uv) { return depthAt(uv) * uDisplacement; }

vec2 sceneToUv(vec2 p) {
  return (p / vec2(uAspect, 1.0) * 0.5 + 0.5) * uUvScale + uUvOffset;
}

void main() {
  if (vUv.x < 0.0 || vUv.x > 1.0 || vUv.y < 0.0 || vUv.y > 1.0) {
    gl_FragColor = vec4(uBackgroundColor, 1.0);
    return;
  }

  vec3 photo = texture2D(uTexture, vUv).rgb;
  float h = heightAt(vUv);

  // A fixed scene-space step keeps normal strength stable across crops.
  float e = 2.0 / 512.0;
  vec2 du = vec2(e / (2.0 * uAspect) * uUvScale.x, 0.0);
  vec2 dv = vec2(0.0, e * 0.5 * uUvScale.y);

  vec3 n;
  if (uHasNormalMap == 1) {
    vec3 baked = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
    n = vec3(baked.xy * uNormalStrength, max(baked.z, 0.05));
  } else {
    vec2 slope = vec2(heightAt(vUv + du) - heightAt(vUv - du),
                      heightAt(vUv + dv) - heightAt(vUv - dv)) / (2.0 * e);
    n = vec3(-slope * uNormalStrength, 1.0);
  }
  vec2 fine = vec2(
    photoLuma(texture2D(uTexture, vUv + du).rgb) - photoLuma(texture2D(uTexture, vUv - du).rgb),
    photoLuma(texture2D(uTexture, vUv + dv).rgb) - photoLuma(texture2D(uTexture, vUv - dv).rgb)
  );
  n = normalize(vec3(n.xy - fine * uDetail * 2.0, n.z));

  // Separates the subject from the backdrop so light never lands on the void.
  float localMean = photoLuma(texture2D(uBlurTexture, vUv).rgb);
  float subject = uHasDepthMap == 1
    ? smoothstep(0.2, 0.32, texture2D(uDepthMap, vUv).r)
    : smoothstep(0.02, 0.1, localMean);

  vec3 p = vec3(vPos * vec2(uAspect, 1.0), h);
  // Elevation measures clearance above the highest possible relief.
  vec3 light = vec3(uLightPos.xy, uLightPos.z + uDisplacement);
  vec3 delta = light - p;
  float distanceToLight = length(delta);
  vec3 direction = delta / max(distanceToLight, 0.001);

  float visibility = 1.0;
  if (uShadowIntensity > 0.0) {
    for (int i = 1; i <= 32; i++) {
      float t = float(i) / 32.0;
      t *= t;
      vec3 ray = p + delta * t;
      vec2 uv = sceneToUv(ray.xy);
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) break;
      float clearance = ray.z - heightAt(uv) + 0.008;
      visibility = min(visibility, clamp(clearance / max(uShadowSoftness * distanceToLight * t, 0.001), 0.0, 1.0));
    }
  }

  float facing = dot(n, direction);
  float diffuse = max(facing, 0.0);
  vec3 halfway = normalize(direction + vec3(0.0, 0.0, 1.0));
  float specular = pow(max(dot(n, halfway), 0.0), uShininess) * uSpecular * smoothstep(0.0, 0.15, facing);
  float attenuation = 1.0 / (1.0 + uFalloff * distanceToLight * distanceToLight);
  vec3 direct = uLightColor * uLightIntensity * attenuation * mix(1.0, visibility, uShadowIntensity);

  // Dividing by the local mean strips the photo's baked shading but keeps its texture.
  // The floor caps the gain so dark, noisy areas are not amplified into grain.
  vec3 albedo = min(photo * (0.5 / max(localMean, 0.18)), vec3(1.0)) * subject;
  albedo = mix(photo, albedo, uFlatten);

  vec3 color = albedo * (uAmbientColor * uAmbient + direct * diffuse + uColorPreserve)
             + direct * specular * subject;
  // Soft shoulder: bright marble keeps its modelling instead of clipping to flat white.
  color = 1.0 - exp(-color * 1.4);
  gl_FragColor = vec4(max(color, uBackgroundColor), 1.0);
}
`;
