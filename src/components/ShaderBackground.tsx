import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ShaderBackgroundProps {
  tint?: [number, number, number] | null;
  speed?: number;
  brightness?: number;
  className?: string;
}

export function ShaderBackground({
  tint = [0.86, 0.64, 1.0], // Fairy Violet/Lilac
  speed = 0.6,
  brightness = 1.15,
  className = 'fixed inset-0 pointer-events-none -z-10 overflow-hidden',
}: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const effSpeed = prefersReducedMotion ? 0 : speed;

    const vertexShader = `
      void main() { gl_Position = vec4(position, 1.0); }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float uLineWidth;
      uniform float uDispersion;
      uniform vec3 uTint;
      uniform float uUseTint;
      uniform float uBrightness;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        vec3 color = vec3(0.0);
        for (int j = 0; j < 3; j++) {
          for (int i = 0; i < 5; i++) {
            color[j] += uLineWidth * float(i * i) /
              abs(fract(t - uDispersion * float(j) + float(i) * 0.01) * 5.0
                  - length(uv) + mod(uv.x + uv.y, 0.2));
          }
        }
        float mono = (color.r + color.g + color.b) / 3.0;
        vec3 finalColor = mix(color, mono * uTint, uUseTint);
        gl_FragColor = vec4(finalColor * uBrightness, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
      uLineWidth: { value: 0.0022 },
      uDispersion: { value: 0.01 },
      uTint: { value: new THREE.Vector3(...(tint ?? [1, 1, 1])) },
      uUseTint: { value: tint ? 1.0 : 0.0 },
      uBrightness: { value: brightness },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: 'high-performance',
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      container.appendChild(renderer.domElement);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.inset = '0';
      renderer.domElement.style.opacity = '0.75';
    } catch (e) {
      console.warn('WebGL not supported for ShaderBackground:', e);
      return;
    }

    const onResize = () => {
      if (!renderer || !container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    onResize();
    window.addEventListener('resize', onResize);

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (effSpeed > 0) {
        uniforms.time.value += 0.05 * effSpeed;
      }
      if (renderer) {
        renderer.render(scene, camera);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationId);
      if (renderer && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [speed, tint, brightness]);

  return (
    <div className={className} aria-hidden="true">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-0 bg-[#150f24]" />

      {/* Radiant Floating Blurred Color Blobs from mockups */}
      <div
        className="absolute -top-36 -left-36 w-[550px] h-[550px] rounded-full bg-[#d9a6ff] blur-[110px] opacity-35 animate-blob-1 pointer-events-none"
      />
      <div
        className="absolute top-1/3 -right-28 w-[450px] h-[450px] rounded-full bg-[#ff8fd8] blur-[110px] opacity-30 animate-blob-2 pointer-events-none"
      />
      <div
        className="absolute -bottom-36 left-1/4 w-[480px] h-[480px] rounded-full bg-[#6ee7c8] blur-[120px] opacity-25 animate-blob-3 pointer-events-none"
      />

      {/* Ambient Dark Gradient Scrim to ensure crisp typography readability */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-[#150f24]/30 via-[#150f24]/60 to-[#150f24]/90 pointer-events-none"
      />

      {/* Floating Sparkles from mockup */}
      <div className="absolute top-[16%] left-[14%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.9)] animate-twinkle pointer-events-none" />
      <div className="absolute top-[28%] left-[82%] w-2 h-2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(230,190,255,0.9)] animate-twinkle [animation-delay:0.6s] pointer-events-none" />
      <div className="absolute top-[62%] left-[8%] w-1 h-1 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.85)] animate-twinkle [animation-delay:1.2s] pointer-events-none" />
      <div className="absolute top-[70%] left-[88%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_9px_2px_rgba(230,190,255,0.9)] animate-twinkle [animation-delay:0.3s] pointer-events-none" />
      <div className="absolute top-[12%] left-[55%] w-1 h-1 rounded-full bg-white shadow-[0_0_7px_2px_rgba(255,255,255,0.8)] animate-twinkle [animation-delay:1.8s] pointer-events-none" />
      <div className="absolute top-[85%] left-[35%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_2px_rgba(230,190,255,0.85)] animate-twinkle [animation-delay:1.5s] pointer-events-none" />
    </div>
  );
}
