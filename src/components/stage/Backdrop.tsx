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
        <span className="bd-photo" />
      </div>
      <div data-on={active === "projets"} className="bd bd-projets">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
        <span className="blob blob-d" />
        <span className="plus-grid" />
      </div>
      <div data-on={active === "contact"} className="bd bd-contact">
        <span className="bd-photo" />
      </div>
      <div className="grain" />
    </div>
  );
}
