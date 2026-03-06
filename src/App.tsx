import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { SceneContent } from "./components/Scene";
import { CameraRig } from "./components/CameraRig";
import { Overlay } from "./components/Overlay";

export default function App() {
  return (
    <div className="relative w-full">
      {/* Massive scrollable container for GSAP ScrollTrigger */}
      <div className="h-[300vh] w-full pointer-events-none" />

      {/* Fixed 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas shadows gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <SceneContent />
            <CameraRig />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <Overlay />
    </div>
  );
}

