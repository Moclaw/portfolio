import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Decal, Float, OrbitControls, Preload, useTexture } from "@react-three/drei";
import { Loader } from "../../../../shared/components/UI";
import { getFullImageUrl } from "../../../../shared/utils/urlHelper";

// Ball with texture
const TexturedBall = ({ imgUrl }) => {
  const [decal] = useTexture([imgUrl]);
  
  return (
    <Float speed={10.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#fff8eb" polygonOffset polygonOffsetFactor={-5} flatShading />
        <Decal position={[0, 0, 1]} rotation={[2 * Math.PI, 0, 6.25]} scale={1} map={decal} flatShading />
      </mesh>
    </Float>
  );
};

// Ball without texture (fallback)
const PlainBall = () => {
  return (
    <Float speed={10.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#8B5CF6" polygonOffset polygonOffsetFactor={-5} flatShading />
      </mesh>
    </Float>
  );
};

const Ball = ({ imgUrl }) => {
  const fullUrl = getFullImageUrl(imgUrl);
  const [imageExists, setImageExists] = useState(null); // null = loading, true = exists, false = not exists
  
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImageExists(true);
    img.onerror = () => {
      // Image not accessible, using fallback
      setImageExists(false);
    };
    img.src = fullUrl;
  }, [fullUrl]);

  // Still loading
  if (imageExists === null) {
    return <PlainBall />;
  }
  
  // Image exists, use textured ball
  if (imageExists) {
    return <TexturedBall imgUrl={fullUrl} />;
  }
  
  // Image doesn't exist, use plain ball
  return <PlainBall />;
};

const BallCanvas = ({ icon }) => (
  <Canvas frameloop="always" dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
            <Suspense fallback={<Loader />}>
      <OrbitControls enableZoom={false} />
      <Ball imgUrl={icon} />
    </Suspense>
    <Preload all />
  </Canvas>
);

export default BallCanvas;