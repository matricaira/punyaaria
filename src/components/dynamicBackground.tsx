"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// Fix the ErrorBoundary import
import React from "react"

// Mouse position context to share between components
type MousePosition = {
  x: number
  y: number
}

// Animated wave mesh that follows cursor movement
function AnimatedWaves({ mousePosition }: { mousePosition: MousePosition }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const meshRef2 = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  // Convert screen mouse position to normalized device coordinates (-1 to 1)
  const mouseNormalized = useMemo(() => {
    return {
      x: (mousePosition.x / window.innerWidth) * 2 - 1,
      y: -(mousePosition.y / window.innerHeight) * 2 + 1,
    }
  }, [mousePosition])

  // Create a custom shader material for the waves that reacts to mouse
  const waveShader = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#1e40af") }, // blue-800
        uColorB: { value: new THREE.Color("#3b82f6") }, // blue-500
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;
        
        void main() {
          vUv = uv;
          
          // Create wave effect that follows mouse
          vec3 pos = position;
          
          // Distance from vertex to mouse position
          float distX = pos.x - uMouse.x * 5.0;
          float distY = pos.y - uMouse.y * 5.0;
          float dist = sqrt(distX * distX + distY * distY);
          
          // Create waves that emanate from mouse position
          float wave = sin(dist * 1.0 - uTime * 2.0) * 0.2;
          wave *= smoothstep(2.0, 0.0, dist); // Fade out with distance
          
          // Add base waves
          pos.z += sin(pos.x * 2.0 + uTime) * 0.1;
          pos.z += sin(pos.y * 2.0 + uTime) * 0.1;
          
          // Add mouse-influenced wave
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
          // Calculate distance from current fragment to mouse position
          float distToMouse = distance(vUv, vec2(
            (uMouse.x + 1.0) * 0.5, 
            (uMouse.y + 1.0) * 0.5
          ));
          
          // Animated gradient
          float noise = sin(vUv.x * 5.0 + uTime) * sin(vUv.y * 5.0 + uTime * 0.8);
          noise = (noise + 1.0) / 2.0; // Normalize to 0-1
          
          // Mix colors based on noise, position, and mouse influence
          float mouseInfluence = smoothstep(0.5, 0.0, distToMouse) * 0.3;
          vec3 color = mix(uColorA, uColorB, noise * vUv.y + sin(uTime * 0.2) * 0.2 + mouseInfluence);
          
          // Add some variation
          color += sin(uTime * 0.5) * 0.05;
          
          // Brighten color near mouse
          color += vec3(0.0, 0.1, 0.2) * (1.0 - smoothstep(0.0, 0.5, distToMouse));
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    }
  }, [])

  // Update shader time uniform and mouse position for animation
  useFrame((state) => {
    if (!meshRef.current || !meshRef2.current) return

    const time = state.clock.getElapsedTime()

    try {
      // Update shader time
      ;(meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = time
      ;(meshRef2.current.material as THREE.ShaderMaterial).uniforms.uTime.value = time * 0.8

      // Update mouse position in shader
      ;(meshRef.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.x = mouseNormalized.x
      ;(meshRef.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.y = mouseNormalized.y
      ;(meshRef2.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.x = mouseNormalized.x
      ;(meshRef2.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.y = mouseNormalized.y

      // Move meshes slightly toward mouse position
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouseNormalized.x * 0.5, 0.05)
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouseNormalized.y * 0.5, 0.05)

      meshRef2.current.position.x = THREE.MathUtils.lerp(meshRef2.current.position.x, mouseNormalized.x * 0.3, 0.03)
      meshRef2.current.position.y = THREE.MathUtils.lerp(meshRef2.current.position.y, mouseNormalized.y * 0.3, 0.03)

      // Rotate meshes slowly
      meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.1
      meshRef2.current.rotation.z = Math.sin(time * 0.08) * -0.1
    } catch (error) {
      console.error("Error updating shader:", error)
    }
  })

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[10, 10, 64, 64]} />
        <shaderMaterial attach="material" args={[waveShader]} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={meshRef2} position={[0, 0, -1]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[15, 15, 48, 48]} />
        <shaderMaterial
          attach="material"
          args={[waveShader]}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.7}
        />
      </mesh>
    </>
  )
}

// Add the import at the top
import { useTheme } from "next-themes"

// Fallback component in case Three.js fails to load
function FallbackBackground() {
  const { theme } = useTheme()

  return (
    <div
      className={`absolute inset-0 ${
        theme === "dark" ? "bg-gradient-to-br from-gray-900 to-blue-900" : "bg-gradient-to-br from-blue-800 to-blue-500"
      }`}
    >
      <motion.div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-gradient-to-tr from-blue-900/30 to-indigo-900/30"
            : "bg-gradient-to-tr from-blue-700/30 to-blue-400/30"
        }`}
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export default function DynamicBackground() {
  const { theme } = useTheme()
  // Track mouse position
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [hasError, setHasError] = useState(false)

  // Set up mouse move event listener
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      })
    }

    // Add event listener
    window.addEventListener("mousemove", handleMouseMove)

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // If there's an error, show the fallback background
  if (hasError) {
    return <FallbackBackground />
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Base gradient background */}
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 to-blue-900"
            : "bg-gradient-to-br from-blue-800 to-blue-500"
        }`}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className={`absolute inset-0 ${
            theme === "dark"
              ? "bg-gradient-to-tr from-blue-900/30 to-indigo-900/30"
              : "bg-gradient-to-tr from-blue-700/30 to-blue-400/30"
          }`}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Three.js canvas with error handling */}
      <ErrorBoundary fallback={<FallbackBackground />} onError={() => setHasError(true)}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 75 }}>
          <AnimatedWaves mousePosition={mousePosition} />
        </Canvas>
      </ErrorBoundary>

      {/* Animated gradient lines that follow mouse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => {
          const linePosition = 20 + i * 15 + (mousePosition.y / window.innerHeight) * 10

          return (
            <motion.div
              key={`line-${i}`}
              className="absolute h-px w-full opacity-30"
              style={{
                background: `linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%)`,
                top: `${linePosition}%`,
              }}
              animate={{
                x: ["-100%", "100%"],
                scaleY: [1, 1 + (mousePosition.x / window.innerWidth) * 3],
              }}
              transition={{
                duration: 15 + i * 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

// Simple error boundary component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode
  fallback: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in component:", error, errorInfo)
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

