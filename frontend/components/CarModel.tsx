"use client";

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Mesh, MeshStandardMaterial, Vector3 } from "three";

// Map VIN `bodyClass` → 3D model file
const bodyClassToModel: Record<string, string> = {
    Sedan: "/models/sedan.glb",
    Coupe: "/models/coupe.glb",
    Hatchback: "/models/hatchback.glb",
    SUV: "/models/suv.glb",
    "Sport Utility Vehicle": "/models/suv.glb",
    Truck: "/models/truck.glb",
    Van: "/models/van.glb",
    "Multi-Purpose Vehicle": "/models/van.glb",
    "Sport Utility Vehicle (SUV)/Multi-Purpose Vehicle (MPV)": "/models/suv.glb",
    "Crossover Utility Vehicle (CUV)": "/models/suv.glb",
    "Truck-Tractor": "/models/truck.glb",
    "Hatchback/Liftback/Notchback": "/models/hatchback.glb",
    "Sport Utility Truck (SUT)": "/models/sut.glb",
    "Pickup Truck": "/models/truck.glb",
    "Pickup": "/models/truck.glb",
    "Minivan": "/models/van.glb",
};

interface CarModelProps {
    bodyClass: string;
    color?: string;
}

const Car: React.FC<{ glbPath: string; color: string }> = ({ glbPath, color }) => {
    const { scene } = useGLTF(glbPath);
    const [bodyMesh, setBodyMesh] = useState<Mesh | null>(null);

    // Detect the largest mesh (assume car body)
    useEffect(() => {
        let largestMesh: Mesh | null = null;
        let largestVolume = 0;

        scene.traverse((child) => {
            if (child instanceof Mesh) {
                child.geometry.computeBoundingBox();
                const bbox = child.geometry.boundingBox;
                if (bbox) {
                    const size = new Vector3();
                    bbox.getSize(size);
                    const volume = size.x * size.y * size.z;
                    if (volume > largestVolume) {
                        largestVolume = volume;
                        largestMesh = child;
                    }
                }
            }
        });

        if (largestMesh) {
            setBodyMesh(largestMesh);
        }
    }, [scene]);

    // Replace material entirely with the selected color
    useEffect(() => {
        if (!bodyMesh) return;

        const newMaterial = new MeshStandardMaterial({ color });
        bodyMesh.material = newMaterial;
    }, [bodyMesh, color]);

    return <primitive object={scene} dispose={null} />;
};

export const CarModel: React.FC<CarModelProps> = ({ bodyClass, color = "red" }) => {
    const glbPath = bodyClassToModel[bodyClass] || "/models/sedan.glb";

    return (
        <Canvas camera={{ position: [5, 2, 5], fov: 50 }} className="bg-accent-50">
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={0.2} />
            <OrbitControls enablePan enableZoom enableRotate />
            <Car glbPath={glbPath} color={color} />
        </Canvas>
    );
};

export default CarModel;

// Preload common models for performance
useGLTF.preload("/models/suv.glb");
useGLTF.preload("/models/sedan.glb");
useGLTF.preload("/models/truck.glb");
useGLTF.preload("/models/coupe.glb");
useGLTF.preload("/models/hatchback.glb");
useGLTF.preload("/models/van.glb");
