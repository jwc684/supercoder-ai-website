"use client";

import { Suspense, useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";

type GenerativeArtSceneProps = {
  /** CSS color string accepted by THREE.Color (e.g. "hsl(221, 83%, 53%)" or "#2563eb"). */
  color?: string;
};

export function GenerativeArtScene({
  color = "hsl(203, 92%, 75%)",
}: GenerativeArtSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.2, 64);

    const vertexShader = /* glsl */ `
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vPosition;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g  = step(x0.yzx, x0.xyz);
        vec3 l  = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vNormal = normal;
        vPosition = position;
        float displacement = snoise(position * 2.0 + time * 0.5) * 0.2;
        vec3 newPosition = position + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

    const fragmentShader = /* glsl */ `
      uniform vec3 color;
      uniform vec3 pointLightPosition;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(pointLightPosition - vPosition);
        float diffuse = max(dot(normal, lightDir), 0.0);

        // Fresnel rim glow
        float fresnel = 1.0 - dot(normal, vec3(0.0, 0.0, 1.0));
        fresnel = pow(fresnel, 2.0);

        vec3 finalColor = color * diffuse + color * fresnel * 0.5;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointLightPosition: { value: new THREE.Vector3(0, 0, 5) },
        color: { value: new THREE.Color(color) },
      },
      vertexShader,
      fragmentShader,
      wireframe: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    let frameId = 0;
    const animate = (t: number) => {
      material.uniforms.time.value = t * 0.0003;
      mesh.rotation.y += 0.0005;
      mesh.rotation.x += 0.0002;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      const vec = new THREE.Vector3(x, y, 0.5).unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(dist));
      pointLight.position.copy(pos);
      material.uniforms.pointLightPosition.value = pos;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [color]);

  return <div ref={mountRef} className="absolute inset-0 z-0 h-full w-full" />;
}

type AnomalousMatterHeroProps = {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Shader color — defaults to brand blue. */
  color?: string;
};

export function AnomalousMatterHero({
  eyebrow = "Observation Log: Anomaly 7",
  title = "Matter in a state of constant, beautiful flux.",
  description = "A new form of digital existence has been observed. It responds to stimuli, changes form, and exudes an unknown energy.",
  children,
  color,
}: AnomalousMatterHeroProps) {
  return (
    <section
      role="banner"
      className="relative h-screen w-full overflow-hidden bg-[#070d24] text-white"
    >
      <Suspense fallback={<div className="h-full w-full bg-[#070d24]" />}>
        <GenerativeArtScene color={color} />
      </Suspense>

      {/* Bottom-up brand glow — primary gradient accent (logo-blue halo rising from bottom) */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_85%_55%_at_50%_95%,_rgba(58,111,255,0.55)_0%,_rgba(33,68,165,0.25)_35%,_transparent_70%)]" />
      {/* Top fade — deepens upper edge for vignette/contrast */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#070d24] via-transparent to-transparent" />
      {/* Center readability wash — subtle dark behind copy without killing the brand glow */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_55%_40%_at_center,_rgba(7,13,36,0.55)_0%,_transparent_70%)]" />

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="wp-container max-w-3xl [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-white/85 md:text-base lg:text-lg">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:mt-6 md:text-6xl lg:text-7xl xl:text-[5.5rem]">
            {title}
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white md:mt-8 md:text-xl lg:text-2xl">
            {description}
          </p>
          {children ? <div className="mt-10 md:mt-12">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
