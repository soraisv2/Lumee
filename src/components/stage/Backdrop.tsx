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
        {/* At rest the statue matches the reference grade exactly (tone curve and light
            direction were measured from it); the pointer then moves the light. */}
        <div className="bd-depth">
          <DepthImage
            image="/depth-statue.jpg"
            depthMap="/depth-statue-depth.png"
            normalMap="/depth-statue-normal.png"
            backgroundColor="#0f0f0f"
            trackWindow
            paused={active !== "studio"}
            bakedLight={{ u: -0.217, v: 2.125, elevation: 0.1 }}
            restLight={{ u: 0.583, v: 0.5, elevation: 0.05 }}
            tone={{ gain: 0.232, gamma: 1.5, lift: 0.057 }}
            dpr={1.5}
            depthSmoothing={3}
            displacement={0.6}
            elevation={0.05}
            lightIntensity={1.2}
            falloff={1.6}
            ambient={0.35}
            normalStrength={1}
            detail={0.06}
            shadowIntensity={0}
            follow={0.08}
          />
        </div>
      </div>
      <div data-on={active === "expertises"} className="bd bd-expertises">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
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
