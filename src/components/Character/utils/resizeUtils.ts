import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;
  let canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  
  // Calculate responsive zoom based on screen aspect ratio on resize
  const aspect = width / height;
  const baseZoom = 1.1;
  if (aspect < 1) {
    camera.zoom = Math.max(0.5, baseZoom * aspect * 1.45);
  } else if (aspect < 1.4) {
    camera.zoom = Math.max(0.8, baseZoom * aspect * 0.8);
  } else {
    camera.zoom = baseZoom;
  }
  
  camera.updateProjectionMatrix();
  const workTrigger = ScrollTrigger.getById("work");
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger != workTrigger) {
      trigger.kill();
    }
  });
  setCharTimeline(character, camera);
  setAllTimeline();
}
