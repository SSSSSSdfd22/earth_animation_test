import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CameraRig() {
  const { camera } = useThree();

  useLayoutEffect(() => {
    // Initial camera position
    camera.position.z = 10;
    camera.position.y = 0;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    tl.to(camera.position, {
      z: 3.5,
      y: 0.5,
      ease: "none",
    });

    // Also target the UI elements for fading
    tl.to(".hero-content", {
      opacity: 0,
      y: -100,
      ease: "power2.inOut",
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [camera]);

  return null;
}
