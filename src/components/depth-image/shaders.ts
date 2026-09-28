export const vertexShader = /* glsl */ `
varying vec2 vUv;
uniform vec2 uUvScale;
uniform vec2 uUvOffset;
void main() {
  vUv = uv * uUvScale + uUvOffset;
  gl_Position = vec4(position, 1.0);
}
`;

// Relights a photo from a height field: surface normals (baked or derived), a
// pointer-driven point light and soft ray-marched self-shadows. Lighting is
// computed in image space (x in ±aspect, y in ±1, over the whole photo), so light
// positions do not depend on how the photo is cropped on screen.
//
// Two modes:
// - albedo (default): strips part of the photo's own lighting, then relights it.
// - rest (uHasRest = 1): keeps the photo exactly as toned when the light sits at
//   its rest position, and only applies the change in shading as the light moves.
export const fragmentShader = /* glsl */ `
varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uBlurTexture;
uniform sampler2D uDepthMap;
uniform sampler2D uNormalMap;
uniform int uHasDepthMap;
uniform int uHasNormalMap;
uniform float uImageAspect;
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
uniform int uHasRest;
uniform vec3 uRestLight;
uniform vec3 uTone;

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

vec2 imageToUv(vec2 p) { return p / vec2(uImageAspect, 1.0) * 0.5 + 0.5; }

// Soft shadow: marches from the surface towards the light over the height field.
float visibilityTo(vec3 p, vec3 light) {
  if (uShadowIntensity <= 0.0) return 1.0;
  vec3 delta = light - p;
  float dist = length(delta);
  float visibility = 1.0;
  for (int i = 1; i <= 24; i++) {
    float t = float(i) / 24.0;
    t *= t;
    vec3 ray = p + delta * t;
    vec2 uv = imageToUv(ray.xy);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) break;
    float clearance = ray.z - heightAt(uv) + 0.008;
    visibility = min(visibility, clamp(clearance / max(uShadowSoftness * dist * t, 0.001), 0.0, 1.0));
  }
  return mix(1.0, visibility, uShadowIntensity);
}

void main() {
  if (vUv.x < 0.0 || vUv.x > 1.0 || vUv.y < 0.0 || vUv.y > 1.0) {
    gl_FragColor = vec4(uBackgroundColor, 1.0);
    return;
  }

  vec3 photo = texture2D(uTexture, vUv).rgb;
  float h = heightAt(vUv);

  float e = 2.0 / 512.0;
  vec2 du = vec2(e / (2.0 * uImageAspect), 0.0);
  vec2 dv = vec2(0.0, e * 0.5);

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

  vec3 p = vec3((vUv * 2.0 - 1.0) * vec2(uImageAspect, 1.0), h);
  // Elevation measures clearance above the highest possible relief.
  vec3 light = vec3(uLightPos.xy, uLightPos.z + uDisplacement);

  if (uHasRest == 1) {
    vec3 rest = vec3(uRestLight.xy, uRestLight.z + uDisplacement);
    float shadingNow = uAmbient + max(dot(n, normalize(light - p)), 0.0) * visibilityTo(p, light);
    float shadingRest = uAmbient + max(dot(n, normalize(rest - p)), 0.0) * visibilityTo(p, rest);
    // A pool of light around the pointer, measured against the rest position so it vanishes there.
    vec2 toNow = light.xy - p.xy;
    vec2 toRest = rest.xy - p.xy;
    float pool = 1.0 / (1.0 + uFalloff * dot(toNow, toNow)) - 1.0 / (1.0 + uFalloff * dot(toRest, toRest));
    float ratio = clamp(shadingNow / shadingRest * (1.0 + uLightIntensity * pool), 0.15, 3.0);
    vec3 toned = uTone.z + uTone.x * pow(photo, vec3(uTone.y));
    vec3 color = uTone.z + (toned - uTone.z) * mix(1.0, ratio, subject);
    gl_FragColor = vec4(color, 1.0);
    return;
  }

  vec3 delta = light - p;
  float distanceToLight = length(delta);
  vec3 direction = delta / max(distanceToLight, 0.001);
  float facing = dot(n, direction);
  float diffuse = max(facing, 0.0);
  vec3 halfway = normalize(direction + vec3(0.0, 0.0, 1.0));
  float specular = pow(max(dot(n, halfway), 0.0), uShininess) * uSpecular * smoothstep(0.0, 0.15, facing);
  float attenuation = 1.0 / (1.0 + uFalloff * distanceToLight * distanceToLight);
  vec3 direct = uLightColor * uLightIntensity * attenuation * visibilityTo(p, light);

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
