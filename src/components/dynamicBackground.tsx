"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";
import { useTheme } from "next-themes";

type MousePosition = { x: number; y: number };

function AnimatedWaves({ mousePosition }: { mousePosition: MousePosition }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);

  // Convert mouse position to normalized device coordinates (-1 to 1)
  const mouseNormalized = useMemo(() => ({
    x: (mousePosition.x / window.innerWidth) * 2 - 1,
    y: -(mousePosition.y / window.innerHeight) * 2 + 1,
  }), [mousePosition]);

  const waveShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#1e40af") },
      uColorB: { value: new THREE.Color("#3b82f6") },
      uMouse: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uMouse;

      void main() {
        vUv = uv;
        vec3 pos = position;
        float distX = pos.x - uMouse.x * 5.0;
        float distY = pos.y - uMouse.y * 5.0;
        float dist = sqrt(distX * distX + distY * distY);
        float wave = sin(dist - uTime * 2.0) * 0.2;
        wave *= smoothstep(2.0, 0.0, dist);
        pos.z += sin(pos.x * 2.0 + uTime) * 0.1;
        pos.z += sin(pos.y * 2.0 + uTime) * 0.1;
        pos.z += wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec2 uMouse;

      void main() {
        float distToMouse = distance(vUv, vec2((uMouse.x + 1.0) * 0.5, (uMouse.y + 1.0) * 0.5));
        float noise = sin(vUv.x * 5.0 + uTime) * sin(vUv.y * 5.0 + uTime * 0.8);
        noise = (noise + 1.0) / 2.0;
        float mouseInfluence = smoothstep(0.5, 0.0, distToMouse) * 0.3;
        vec3 color = mix(uColorA, uColorB, noise * vUv.y + sin(uTime * 0.2) * 0.2 + mouseInfluence);
        color += sin(uTime * 0.5) * 0.05;
        color += vec3(0.0, 0.1, 0.2) * (1.0 - smoothstep(0.0, 0.5, distToMouse));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  }), []);

  useFrame((state) => {
    if (!meshRef.current || !meshRef2.current) return;

    const time = state.clock.getElapsedTime();
    try {
      const mat1 = meshRef.current.material as THREE.ShaderMaterial;
      const mat2 = meshRef2.current.material as THREE.ShaderMaterial;

      mat1.uniforms.uTime.value = time;
      mat2.uniforms.uTime.value = time * 0.8;
      mat1.uniforms.uMouse.value.set(mouseNormalized.x, mouseNormalized.y);
      mat2.uniforms.uMouse.value.set(mouseNormalized.x, mouseNormalized.y);

      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouseNormalized.x * 0.5, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouseNormalized.y * 0.5, 0.05);
      meshRef2.current.position.x = THREE.MathUtils.lerp(meshRef2.current.position.x, mouseNormalized.x * 0.3, 0.03);
      meshRef2.current.position.y = THREE.MathUtils.lerp(meshRef2.current.position.y, mouseNormalized.y * 0.3, 0.03);
      meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.1;
      meshRef2.current.rotation.z = Math.sin(time * 0.08) * -0.1;
    } catch (error) {
      console.error("Error updating shader:", error);
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <planeGeometry args={[10, 10, 64, 64]} />
        <shaderMaterial attach="material" args={[waveShader]} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={meshRef2} position={[0, 0, -1]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[15, 15, 48, 48]} />
        <shaderMaterial attach="material" args={[waveShader]} side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>
    </>
  );
}

function FallbackBackground() {
  const { theme } = useTheme();

  return (
    <div className={`absolute inset-0 ${theme === "dark" ? "bg-gray-900" : "bg-blue-800"}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-blue-700/30 to-blue-400/30"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function DynamicBackground() {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [hasError, setHasError] = useState(false);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  if (hasError) return <FallbackBackground />;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <FallbackBackground />
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 75 }}>
        <AnimatedWaves mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}
