"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shaders";

export interface DepthImageProps {
  /** Photo to relight. */
  image: string;
  /** Real depth map, white near and black far. Estimated from the photo when omitted. */
  depthMap?: string;
  /** Baked tangent-space normal map. Derived from the depth when omitted. */
  normalMap?: string;
  /** How the photo fills the container. */
  fit?: "cover" | "contain";
  /** Blur applied to the photo before estimating depth, in steps of five texels of a 512 wide map. */
  depthSmoothing?: number;
  /** Height of the relief in scene units; the plane is 2 tall. */
  displacement?: number;
  /** Penumbra width of the shadows. */
  shadowSoftness?: number;
  /** Estimated depth: 0 reads depth from vertical position only, 1 from brightness only. */
  depthFromLight?: number;
  /** Contrast applied to the estimated depth. */
  depthContrast?: number;
  /** Flip near and far. */
  invertDepth?: boolean;
  /** Strength of the surface tilt from depth. */
  normalStrength?: number;
  /** Strength of fine surface detail read from the photo. */
  detail?: number;
  /** Darkness of self-cast shadows, 0 disables them. */
  shadowIntensity?: number;
  /** Light colour. */
  lightColor?: string;
  /** Light brightness. */
  lightIntensity?: number;
  /** How quickly the light fades with distance, 0 is even, 4 is a tight pool. */
  falloff?: number;
  /** Height of the light above the surface. */
  elevation?: number;
  /** Strength of the glossy highlight that slides over curved surfaces. */
  specular?: number;
  /** Tightness of the glossy highlight; higher is a smaller, sharper sheen. */
  shininess?: number;
  /** How much of the photo's original lighting is removed before relighting, 0 to 1. */
  flatten?: number;
  /** Flat fill light applied everywhere. */
  ambient?: number;
  /** Colour of the fill light. */
  ambientColor?: string;
  /** How much of the photo's own tone survives in unlit areas, 0 to 1. */
  colorPreserve?: number;
  /** How quickly the light follows the pointer, 0 to 1. */
  follow?: number;
  /** Move the light on a slow circle when the pointer is away. */
  autoOrbit?: boolean;
  /** Radius of the idle orbit, 0 to 1. */
  orbitRadius?: number;
  /** Seconds per idle orbit. */
  orbitDuration?: number;
  /** Floor colour behind the relief. */
  backgroundColor?: string;
  /** Freeze the light. */
  paused?: boolean;
  /** Render scale cap. */
  dpr?: number;
  className?: string;
  children?: React.ReactNode;
}

export function DepthImage({
  image,
  depthMap,
  normalMap,
  fit = "cover",
  depthSmoothing = 7,
  displacement = 1.5,
  shadowSoftness = 0.1,
  depthFromLight = 0.5,
  depthContrast = 1.2,
  invertDepth = false,
  normalStrength = 1.5,
  detail = 0.8,
  shadowIntensity = 0.7,
  lightColor = "#ffffff",
  lightIntensity = 6,
  falloff = 2.5,
  elevation = 1.2,
  specular = 0.35,
  shininess = 24,
  flatten = 0,
  ambient = 0.02,
  ambientColor = "#ffffff",
  colorPreserve = 0,
  follow = 0.12,
  autoOrbit = true,
  orbitRadius = 0.6,
  orbitDuration = 10,
  backgroundColor = "#0a0a0a",
  paused = false,
  dpr = 1.5,
  className,
  children,
}: DepthImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Props read every frame live in a ref so the render loop never restarts for them.
  const settings = {
    depthFromLight,
    depthContrast,
    invertDepth,
    normalStrength,
    detail,
    shadowIntensity,
    lightColor,
    lightIntensity,
    falloff,
    elevation,
    specular,
    shininess,
    flatten,
    ambient,
    ambientColor,
    colorPreserve,
    follow,
    autoOrbit,
    orbitRadius,
    orbitDuration,
    paused,
  };
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    } catch {
      return; // The CSS photo remains visible when WebGL is unavailable.
    }
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dpr));
    container.appendChild(renderer.domElement);

    let disposed = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const loader = new THREE.TextureLoader();

    const blurCanvas = document.createElement("canvas");
    const blurTexture = new THREE.CanvasTexture(blurCanvas);
    blurTexture.minFilter = THREE.LinearFilter;
    blurTexture.magFilter = THREE.LinearFilter;

    const texture = loader.load(image, (tex) => {
      if (disposed) return;
      const source = tex.image;
      blurCanvas.width = 512;
      blurCanvas.height = Math.max(1, Math.round((512 * source.height) / source.width));
      const ctx = blurCanvas.getContext("2d")!;
      ctx.filter = `blur(${Math.max(0, depthSmoothing) * 5}px)`;
      ctx.drawImage(source, 0, 0, blurCanvas.width, blurCanvas.height);
      blurTexture.needsUpdate = true;
      updateUvTransform();
    });
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Map data is geometry, not colour: no colour-space conversion, no mipmaps.
    function loadMap(url: string | undefined, flag: { value: number }) {
      if (!url) return null;
      const map = loader.load(url, () => {
        if (!disposed) flag.value = 1;
      });
      map.colorSpace = THREE.NoColorSpace;
      map.generateMipmaps = false;
      map.minFilter = THREE.LinearFilter;
      map.magFilter = THREE.LinearFilter;
      return map;
    }

    const uniforms = {
      uTexture: { value: texture },
      uBlurTexture: { value: blurTexture },
      uDepthMap: { value: null as THREE.Texture | null },
      uNormalMap: { value: null as THREE.Texture | null },
      uHasDepthMap: { value: 0 },
      uHasNormalMap: { value: 0 },
      uAspect: { value: 1 },
      uDisplacement: { value: displacement },
      uShadowSoftness: { value: shadowSoftness },
      uUvScale: { value: new THREE.Vector2(1, 1) },
      uUvOffset: { value: new THREE.Vector2(0, 0) },
      uLightPos: { value: new THREE.Vector3(0, 0, elevation) },
      uLightColor: { value: new THREE.Color(lightColor) },
      uLightIntensity: { value: lightIntensity },
      uFalloff: { value: falloff },
      uAmbient: { value: ambient },
      uAmbientColor: { value: new THREE.Color(ambientColor) },
      uDepthFromLight: { value: depthFromLight },
      uDepthContrast: { value: depthContrast },
      uInvertDepth: { value: invertDepth ? 1 : 0 },
      uNormalStrength: { value: normalStrength },
      uDetail: { value: detail },
      uShadowIntensity: { value: shadowIntensity },
      uColorPreserve: { value: colorPreserve },
      uSpecular: { value: specular },
      uShininess: { value: shininess },
      uFlatten: { value: flatten },
      uBackgroundColor: { value: new THREE.Color(backgroundColor).convertLinearToSRGB() },
    };
    uniforms.uDepthMap.value = loadMap(depthMap, uniforms.uHasDepthMap);
    uniforms.uNormalMap.value = loadMap(normalMap, uniforms.uHasNormalMap);

    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    function updateUvTransform() {
      if (!texture.image) return;
      const containerAspect = container!.clientWidth / Math.max(1, container!.clientHeight);
      const ratio = texture.image.width / texture.image.height / containerAspect;
      let scaleX = 1;
      let scaleY = 1;
      if (fit === "cover") {
        if (ratio > 1) scaleX = 1 / ratio;
        else scaleY = ratio;
      } else if (ratio > 1) {
        scaleY = ratio;
      } else {
        scaleX = 1 / ratio;
      }
      uniforms.uUvScale.value.set(scaleX, scaleY);
      uniforms.uUvOffset.value.set((1 - scaleX) / 2, (1 - scaleY) / 2);
    }

    function resize() {
      const width = container!.clientWidth;
      const height = container!.clientHeight;
      renderer.setSize(Math.max(1, width), Math.max(1, height));
      uniforms.uAspect.value = width / Math.max(1, height);
      updateUvTransform();
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Pointer position in [-1, 1] plane space, smoothed toward the target.
    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerCurrent = new THREE.Vector2(0, 0);
    let pointerActive = false;
    let idleTime = 0;

    function onPointerMove(event: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      pointerTarget.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -(((event.clientY - rect.top) / rect.height) * 2 - 1),
      );
      pointerActive = true;
    }
    function onPointerLeave() {
      pointerActive = false;
    }
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    let frameId = 0;
    let previousTime = performance.now();

    function animate() {
      frameId = requestAnimationFrame(animate);
      const s = settingsRef.current;
      const now = performance.now();
      const dt = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;
      const smoothing = 1 - Math.pow(1 - s.follow, dt * 60);

      if (!s.paused) {
        if (pointerActive) {
          idleTime = 0;
          pointerCurrent.lerp(pointerTarget, smoothing);
        } else if (s.autoOrbit && !reducedMotion.matches) {
          idleTime += dt;
          const angle = (idleTime / s.orbitDuration) * Math.PI * 2;
          pointerTarget.set(Math.cos(angle) * s.orbitRadius, Math.sin(angle) * s.orbitRadius);
          pointerCurrent.lerp(pointerTarget, smoothing);
        }

        uniforms.uLightPos.value.set(pointerCurrent.x * uniforms.uAspect.value, pointerCurrent.y, s.elevation);
        uniforms.uLightColor.value.set(s.lightColor);
        uniforms.uLightIntensity.value = s.lightIntensity;
        uniforms.uFalloff.value = s.falloff;
        uniforms.uAmbient.value = s.ambient;
        uniforms.uAmbientColor.value.set(s.ambientColor);
        uniforms.uDepthFromLight.value = s.depthFromLight;
        uniforms.uDepthContrast.value = s.depthContrast;
        uniforms.uInvertDepth.value = s.invertDepth ? 1 : 0;
        uniforms.uNormalStrength.value = s.normalStrength;
        uniforms.uDetail.value = s.detail;
        uniforms.uShadowIntensity.value = s.shadowIntensity;
        uniforms.uColorPreserve.value = s.colorPreserve;
        uniforms.uSpecular.value = s.specular;
        uniforms.uShininess.value = s.shininess;
        uniforms.uFlatten.value = s.flatten;
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      blurTexture.dispose();
      uniforms.uDepthMap.value?.dispose();
      uniforms.uNormalMap.value?.dispose();
      renderer.dispose();
    };
    // Only props that require rebuilding the scene go here; the rest flow through settingsRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, depthMap, normalMap, fit, dpr, backgroundColor, depthSmoothing, displacement, shadowSoftness]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor,
        backgroundImage: `url(${JSON.stringify(image)})`,
        backgroundSize: fit,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
}
