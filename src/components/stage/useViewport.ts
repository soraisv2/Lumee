import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

// A string snapshot keeps the value stable between renders for useSyncExternalStore.
const getSnapshot = () => `${window.innerWidth}x${window.innerHeight}`;
const getServerSnapshot = () => "1440x900";

export function useViewport() {
  const [width, height] = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot).split("x").map(Number);
  return { width, height };
}
