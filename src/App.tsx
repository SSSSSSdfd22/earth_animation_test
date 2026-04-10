import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, AnimatePresence } from 'motion/react';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Film, Layers, MonitorPlay } from 'lucide-react';

function CustomBall() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate a custom color map using a canvas
  const colorMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    if (context) {
      // Draw a gradient background
      const gradient = context.createLinearGradient(0, 0, 1024, 1024);
      gradient.addColorStop(0, '#1a2a6c');
      gradient.addColorStop(0.5, '#b21f1f');
      gradient.addColorStop(1, '#fdbb2d');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 1024, 1024);

      // Draw some patterns
      for (let i = 0; i < 500; i++) {
        context.beginPath();
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const r = Math.random() * 30 + 5;
        context.arc(x, y, r, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
        context.fill();
        
        // Add some glowing centers
        context.beginPath();
        context.arc(x, y, r * 0.3, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8})`;
        context.fill();
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Create custom geometry by modifying a sphere
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(2, 128, 128);
    // Store original positions for animation
    geo.setAttribute('basePosition', geo.attributes.position.clone());
    return geo;
  }, []);

  const targetScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Intro zoom out animation
      meshRef.current.scale.lerp(targetScale, delta * 2.5);

      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.1;

      const time = state.clock.getElapsedTime();
      const positionAttribute = geometry.getAttribute('position');
      const basePositionAttribute = geometry.getAttribute('basePosition');
      const vertex = new THREE.Vector3();

      for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(basePositionAttribute, i);
        
        // Animate noise based on position and time
        const noise = 
          Math.sin(vertex.x * 2 + time * 1.5) * 
          Math.cos(vertex.y * 2 + time * 1.2) * 
          Math.sin(vertex.z * 2 + time * 1.8);
        
        const displacement = 1 + noise * 0.15;
        
        vertex.multiplyScalar(displacement);
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} scale={[5, 5, 5]}>
      <meshStandardMaterial 
        map={colorMap} 
        roughness={0.2} 
        metalness={0.3} 
      />
    </mesh>
  );
}

function ObjectRotator({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();

  useEffect(() => {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging && groupRef.current) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(deltaY * 0.005, deltaX * 0.005, 0, 'XYZ')
        );
        
        groupRef.current.quaternion.premultiply(deltaRotationQuaternion);

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [gl]);

  return <group ref={groupRef}>{children}</group>;
}

function FluidGlassBox({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      className={`relative overflow-hidden bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/30 border-b-white/10 border-r-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

function HeaderSection({ currentPage, setCurrentPage }: { currentPage: string, setCurrentPage: (page: string) => void }) {
  const navItems = ["Home", "Services", "Reviews", "About US", "Contact US"];
  
  return (
    <div className="absolute top-8 left-0 w-full flex flex-col items-center gap-6 z-20 pointer-events-none">
      <FluidGlassBox className="rounded-full px-12 py-6 pointer-events-auto cursor-crosshair">
        <h1 className="text-white font-bold text-2xl md:text-4xl tracking-[0.4em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] pointer-events-none select-none">
          Nexus Sphere
        </h1>
      </FluidGlassBox>
      
      <nav className="flex flex-wrap justify-center gap-4 px-4 pointer-events-auto">
        {navItems.map(item => (
          <FluidGlassBox 
            key={item} 
            onClick={() => setCurrentPage(item)}
            className={`rounded-full px-8 py-4 cursor-pointer transition-colors ${currentPage === item ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <span className="text-white font-medium tracking-wider text-sm pointer-events-none select-none">
              {item}
            </span>
          </FluidGlassBox>
        ))}
      </nav>
    </div>
  );
}

function ServicesSection() {
  const services = [
    { title: '3D Modeling', description: 'High-quality polygonal and NURBS modeling for games, film, and product visualization.', icon: <Box className="w-8 h-8 mb-4 text-white" /> },
    { title: '3D Animation', description: 'Character rigging, keyframe animation, and motion capture cleanup for lifelike movement.', icon: <Film className="w-8 h-8 mb-4 text-white" /> },
    { title: 'VFX & Compositing', description: 'Seamless integration of 3D elements into live-action footage with advanced particle systems.', icon: <Layers className="w-8 h-8 mb-4 text-white" /> },
    { title: 'Real-time Rendering', description: 'Optimized assets and environments for Unreal Engine, Unity, and WebGL applications.', icon: <MonitorPlay className="w-8 h-8 mb-4 text-white" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute inset-0 top-48 flex items-center justify-center z-10 pointer-events-none px-4 pb-12 overflow-y-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full pointer-events-auto mt-auto mb-auto">
        {services.map(s => (
          <FluidGlassBox key={s.title} className="rounded-3xl p-8 flex flex-col items-start text-left">
            {s.icon}
            <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{s.title}</h3>
            <p className="text-white/70 leading-relaxed">{s.description}</p>
          </FluidGlassBox>
        ))}
      </div>
    </motion.div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("Home");

  return (
    <div className="w-full h-screen bg-neutral-950 overflow-hidden relative">
      <HeaderSection currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <AnimatePresence mode="wait">
        {currentPage === "Services" && <ServicesSection key="services" />}
      </AnimatePresence>

      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#4f46e5" />
        <pointLight position={[10, -10, 5]} intensity={2} color="#e11d48" />
        
        <ObjectRotator>
          <CustomBall />
        </ObjectRotator>
        
        <ContactShadows 
          position={[0, -3, 0]} 
          opacity={0.5} 
          scale={10} 
          blur={2} 
          far={4} 
          color="#000000"
        />
        
        <OrbitControls 
          enableRotate={false}
          enablePan={false} 
          enableZoom={true} 
          minDistance={3}
          maxDistance={15}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
