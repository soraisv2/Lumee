import { DepthImage } from "@/components/depth-image";
import type { SceneId } from "./scenes";

// One layer per scene; the active one comes into focus while the others blur away.
export function Backdrop({ active }: { active: SceneId }) {
  return (
    <div aria-hidden className="absolute inset-0 z-0">
      <div data-on={active === "index"} className="bd bd-index">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
      </div>
      <div data-on={active === "studio"} className="bd bd-studio">
        {/* The statue is relit under the pointer, then shown in negative: the lit
            areas become the dark ones, so the shadows follow the mouse. */}
        <div className="bd-depth">
          <DepthImage
            image="/depth-statue.jpg"
            depthMap="/depth-statue-depth.png"
            normalMap="/depth-statue-normal.png"
            backgroundColor="#000000"
            trackWindow
            paused={active !== "studio"}
            dpr={0.6}
            depthSmoothing={3}
            displacement={0.6}
            elevation={0.5}
            lightIntensity={3.2}
            falloff={0.9}
            normalStrength={1}
            detail={0.05}
            specular={0.15}
            shininess={16}
            flatten={0.45}
            ambient={0.05}
            colorPreserve={0.25}
            shadowIntensity={0.6}
            shadowSoftness={0.15}
            follow={0.08}
            orbitRadius={0.5}
            orbitDuration={14}
          />
        </div>
      </div>
      <div data-on={active === "projets"} className="bd bd-projets">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
        <span className="blob blob-d" />
      </div>
      <div data-on={active === "contact"} className="bd bd-contact">
        <span className="bd-photo" />
      </div>
      <div className="grain" />
    </div>
  );
}
