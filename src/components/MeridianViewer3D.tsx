import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Meridian, Acupoint } from '../types/meridian';
import { MERIDIANS_DATA } from '../data/meridiansData';
import { AcupointDetailCard } from './AcupointDetailCard';
import { TCMNode, TCMRelation } from '../types/tcm';
import {
  Play,
  Pause,
  RotateCcw,
  Layers,
  ChevronRight,
  ChevronLeft,
  Compass,
  Sparkles,
  Info,
  Maximize2,
  Eye,
  CheckCircle2,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface MeridianViewer3DProps {
  onImportToGraph?: (node: TCMNode, relation?: TCMRelation) => void;
  onSelectNodeInGraph?: (node: TCMNode) => void;
}

export const MeridianViewer3D: React.FC<MeridianViewer3DProps> = ({
  onImportToGraph,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Active Selected Meridian (defaults to #1 手太阴肺经)
  const [activeMeridianIndex, setActiveMeridianIndex] = useState<number>(0);
  const activeMeridian = MERIDIANS_DATA[activeMeridianIndex];

  // View Mode: 'single' (focused on active meridian) | 'all' (all 12 meridians shown) | 'cycle' (auto-flowing Ziwu Liuzhu)
  const [circulationMode, setCirculationMode] = useState<'single' | 'all' | 'cycle'>('single');

  // Animation playing state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [circulationSpeed, setCirculationSpeed] = useState<number>(1); // 1x, 2x, 3x

  // Selected Acupoint for detail card
  const [selectedAcupoint, setSelectedAcupoint] = useState<Acupoint | null>(null);

  // Hovered Acupoint for tooltip
  const [hoveredAcupoint, setHoveredAcupoint] = useState<Acupoint | null>(null);

  // Show detailed classical pathway text box
  const [showPathwayCard, setShowPathwayCard] = useState<boolean>(true);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    spherical: new THREE.Spherical(48, Math.PI / 2.2, 0),
    target: new THREE.Vector3(0, 0, 0),
  });

  // Animated pulse progress
  const flowProgressRef = useRef<{ [meridianId: string]: number }>({});
  const cycleTimerRef = useRef<number>(0);

  // Raycaster & interactive objects
  const interactivePointMeshes = useRef<Map<THREE.Mesh, { point: Acupoint; meridian: Meridian }>>(new Map());

  // Function to create text billboard sprite
  const createAcupointLabel = (text: string, color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Sprite();

    ctx.clearRect(0, 0, 256, 64);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.roundRect ? ctx.roundRect(8, 8, 240, 48, 12) : ctx.rect(8, 8, 240, 48);
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Noto Serif SC", serif, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(3.2, 0.8, 1);
    return sprite;
  };

  // Build Stylized 3D Human Anatomy Avatar
  const createHumanoidModel = () => {
    const humanGroup = new THREE.Group();

    // Cyber-jade translucent glass skin material
    const skinMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f2d42,
      emissive: 0x051824,
      roughness: 0.35,
      metalness: 0.15,
      transmission: 0.7,
      thickness: 2.0,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    });

    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });

    // 1. Head
    const headGeo = new THREE.SphereGeometry(2.3, 24, 24);
    headGeo.scale(0.85, 1.15, 0.95);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.set(0, 20.5, 0.2);
    humanGroup.add(headMesh);

    // Inner cranial core
    const innerHead = new THREE.Mesh(headGeo, innerCoreMat);
    innerHead.position.copy(headMesh.position);
    innerHead.scale.set(0.9, 0.9, 0.9);
    humanGroup.add(innerHead);

    // 2. Neck
    const neckGeo = new THREE.CylinderGeometry(1.1, 1.35, 2.4, 16);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.set(0, 17.5, 0);
    humanGroup.add(neckMesh);

    // 3. Torso / Ribcage (Chest)
    const chestGeo = new THREE.CylinderGeometry(4.2, 3.4, 8.5, 24);
    chestGeo.scale(1.0, 1.0, 0.75);
    const chestMesh = new THREE.Mesh(chestGeo, skinMat);
    chestMesh.position.set(0, 12.2, 0);
    humanGroup.add(chestMesh);

    // 4. Abdomen & Pelvis
    const pelvisGeo = new THREE.CylinderGeometry(3.4, 3.8, 7.5, 24);
    pelvisGeo.scale(1.0, 1.0, 0.8);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, skinMat);
    pelvisMesh.position.set(0, 4.8, 0);
    humanGroup.add(pelvisMesh);

    // Spine Central Light Channel (Du-Ren meridian axis)
    const spineCurve = new THREE.LineCurve3(
      new THREE.Vector3(0, 1.5, 0),
      new THREE.Vector3(0, 23.0, 0)
    );
    const spineGeo = new THREE.TubeGeometry(spineCurve, 20, 0.12, 8, false);
    const spineMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    humanGroup.add(spineMesh);

    // Helper for limbs
    const buildLimb = (
      start: THREE.Vector3,
      end: THREE.Vector3,
      r1: number,
      r2: number
    ) => {
      const dir = new THREE.Vector3().subVectors(end, start);
      const length = dir.length();
      const geom = new THREE.CylinderGeometry(r2, r1, length, 16);
      const mesh = new THREE.Mesh(geom, skinMat);

      mesh.position.copy(start).addScaledVector(dir, 0.5);
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      );
      return mesh;
    };

    // 5. Left & Right Shoulders
    [-1, 1].forEach(side => {
      const shoulderGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const shoulder = new THREE.Mesh(shoulderGeo, skinMat);
      shoulder.position.set(side * 5.6, 15.0, 0.2);
      humanGroup.add(shoulder);

      // Upper Arm
      const elbowPos = new THREE.Vector3(side * 8.2, 6.2, 0.2);
      const upperArm = buildLimb(shoulder.position, elbowPos, 1.35, 1.05);
      humanGroup.add(upperArm);

      // Elbow joint
      const elbow = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), skinMat);
      elbow.position.copy(elbowPos);
      humanGroup.add(elbow);

      // Forearm
      const wristPos = new THREE.Vector3(side * 10.8, -1.5, 0.1);
      const forearm = buildLimb(elbowPos, wristPos, 1.05, 0.85);
      humanGroup.add(forearm);

      // Hand
      const handGeo = new THREE.SphereGeometry(1.2, 16, 16);
      handGeo.scale(0.65, 1.3, 0.35);
      const hand = new THREE.Mesh(handGeo, skinMat);
      hand.position.set(side * 11.6, -3.8, 0.1);
      humanGroup.add(hand);
    });

    // 6. Left & Right Legs
    [-1, 1].forEach(side => {
      const hipPos = new THREE.Vector3(side * 2.6, 1.8, 0);
      const kneePos = new THREE.Vector3(side * 2.8, -8.6, 0.3);

      // Thigh
      const thigh = buildLimb(hipPos, kneePos, 2.0, 1.5);
      humanGroup.add(thigh);

      // Knee Joint
      const knee = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), skinMat);
      knee.position.copy(kneePos);
      humanGroup.add(knee);

      // Calf / Lower Leg
      const anklePos = new THREE.Vector3(side * 2.6, -19.5, 0.1);
      const calf = buildLimb(kneePos, anklePos, 1.45, 1.05);
      humanGroup.add(calf);

      // Ankle joint
      const ankle = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 16), skinMat);
      ankle.position.copy(anklePos);
      humanGroup.add(ankle);

      // Foot
      const footGeo = new THREE.BoxGeometry(1.8, 1.1, 4.2);
      const foot = new THREE.Mesh(footGeo, skinMat);
      foot.position.set(side * 2.6, -21.8, 1.3);
      humanGroup.add(foot);
    });

    // 7. Ground Hologram Pedestal / Bagua Ring
    const ringGeo = new THREE.RingGeometry(8.5, 9.2, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -22.5;
    humanGroup.add(ringMesh);

    // Inner Taiji disc
    const innerDiscGeo = new THREE.CircleGeometry(6.5, 32);
    const innerDiscMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1,
    });
    const innerDisc = new THREE.Mesh(innerDiscGeo, innerDiscMat);
    innerDisc.rotation.x = Math.PI / 2;
    innerDisc.position.y = -22.55;
    humanGroup.add(innerDisc);

    return humanGroup;
  };

  // Main Scene Setup & Render Loop
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.012);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    cameraRef.current = camera;
    const sph = controlsState.current.spherical;
    camera.position.setFromSpherical(sph);
    camera.lookAt(controlsState.current.target);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xbae6fd, 1.4);
    dirLight1.position.set(10, 30, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284c7, 0.9);
    dirLight2.position.set(-15, -10, -20);
    scene.add(dirLight2);

    const chestGlow = new THREE.PointLight(0x38bdf8, 2.0, 35);
    chestGlow.position.set(0, 12, 0);
    scene.add(chestGlow);

    // Add Human Body
    const humanModel = createHumanoidModel();
    scene.add(humanModel);

    // Group for dynamic meridian lines & acupoints
    const meridiansRootGroup = new THREE.Group();
    scene.add(meridiansRootGroup);

    // Energy pulse particle mesh map
    const pulseSpheresMap = new Map<string, THREE.Mesh[]>();

    // Rebuild Meridian Paths & Acupoints
    const buildMeridiansVisuals = () => {
      // Clear previous
      while (meridiansRootGroup.children.length > 0) {
        const obj = meridiansRootGroup.children[0];
        meridiansRootGroup.remove(obj);
      }
      interactivePointMeshes.current.clear();
      pulseSpheresMap.clear();

      MERIDIANS_DATA.forEach((meridian, idx) => {
        const isActive = idx === activeMeridianIndex;
        const shouldShow = circulationMode === 'all' || circulationMode === 'cycle' || isActive;

        if (!shouldShow) return;

        // Spline curve through 3D points
        const vectors = meridian.curvePoints.map(p => new THREE.Vector3(p[0], p[1], p[2]));
        const curve = new THREE.CatmullRomCurve3(vectors);
        curve.tension = 0.5;

        // Tube Geometry for the meridian
        const tubeRadius = isActive ? 0.22 : 0.08;
        const tubeSegments = 80;
        const tubeGeo = new THREE.TubeGeometry(curve, tubeSegments, tubeRadius, 10, false);
        const tubeMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(meridian.color),
          emissive: new THREE.Color(meridian.color),
          emissiveIntensity: isActive ? 1.0 : 0.35,
          roughness: 0.2,
          transparent: true,
          opacity: isActive ? 0.95 : 0.45,
        });
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        meridiansRootGroup.add(tubeMesh);

        // Qi Flow Particles (脉络光斑脉冲)
        const pulseCount = isActive ? 4 : 2;
        const pulses: THREE.Mesh[] = [];
        for (let i = 0; i < pulseCount; i++) {
          const pulseGeo = new THREE.SphereGeometry(isActive ? 0.42 : 0.25, 12, 12);
          const pulseMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9,
          });
          const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
          meridiansRootGroup.add(pulseMesh);
          pulses.push(pulseMesh);
        }
        pulseSpheresMap.set(meridian.id, pulses);

        // Acupoints along this meridian
        meridian.acupoints.forEach(point => {
          const pointGroup = new THREE.Group();
          pointGroup.position.set(point.position[0], point.position[1], point.position[2]);

          const pointGeo = new THREE.SphereGeometry(isActive ? 0.38 : 0.24, 16, 16);
          const pointMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: new THREE.Color(meridian.color),
            emissiveIntensity: isActive ? 1.5 : 0.6,
            roughness: 0.1,
          });
          const pointMesh = new THREE.Mesh(pointGeo, pointMat);
          pointGroup.add(pointMesh);

          // Aura halo ring
          if (isActive) {
            const haloGeo = new THREE.RingGeometry(0.45, 0.62, 24);
            const haloMat = new THREE.MeshBasicMaterial({
              color: new THREE.Color(meridian.color),
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.7,
            });
            const haloMesh = new THREE.Mesh(haloGeo, haloMat);
            haloMesh.rotation.x = Math.PI / 2;
            pointGroup.add(haloMesh);

            // Text Label billboard
            const labelSprite = createAcupointLabel(`${point.name} ${point.code}`, meridian.color);
            labelSprite.position.set(0, 1.2, 0);
            pointGroup.add(labelSprite);
          }

          meridiansRootGroup.add(pointGroup);
          // Register pointMesh for raycaster click/hover
          interactivePointMeshes.current.set(pointMesh, { point, meridian });
        });
      });
    };

    buildMeridiansVisuals();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Mouse / Touch Controls
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      controlsState.current.isDragging = true;
      controlsState.current.prevX = e.clientX;
      controlsState.current.prevY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!cameraRef.current) return;
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Handle Raycasting for Acupoint hover
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);
      const meshes = Array.from(interactivePointMeshes.current.keys());
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = interactivePointMeshes.current.get(hit);
        if (data) {
          setHoveredAcupoint(data.point);
          container.style.cursor = 'pointer';
        }
      } else {
        setHoveredAcupoint(null);
        container.style.cursor = controlsState.current.isDragging ? 'grabbing' : 'default';
      }

      // Handle Rotation Drag
      if (controlsState.current.isDragging) {
        const deltaX = e.clientX - controlsState.current.prevX;
        const deltaY = e.clientY - controlsState.current.prevY;
        controlsState.current.prevX = e.clientX;
        controlsState.current.prevY = e.clientY;

        const sph = controlsState.current.spherical;
        sph.theta -= deltaX * 0.006;
        sph.phi = Math.max(0.15, Math.min(Math.PI - 0.15, sph.phi - deltaY * 0.006));
        camera.position.setFromSpherical(sph);
        camera.lookAt(controlsState.current.target);
      }
    };

    const handleMouseUp = () => {
      controlsState.current.isDragging = false;
      container.style.cursor = 'default';
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const sph = controlsState.current.spherical;
      sph.radius = Math.max(16, Math.min(90, sph.radius + e.deltaY * 0.04));
      camera.position.setFromSpherical(sph);
      camera.lookAt(controlsState.current.target);
    };

    const handleClick = (e: MouseEvent) => {
      if (!cameraRef.current) return;
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);
      const meshes = Array.from(interactivePointMeshes.current.keys());
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = interactivePointMeshes.current.get(hit);
        if (data) {
          setSelectedAcupoint(data.point);
          // Set active meridian to this point's meridian if not already
          const merIdx = MERIDIANS_DATA.findIndex(m => m.id === data.meridian.id);
          if (merIdx !== -1) {
            setActiveMeridianIndex(merIdx);
          }
        }
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('click', handleClick);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Update Meridian Qi Pulse Positions
      if (isPlaying) {
        const speed = 0.35 * circulationSpeed;
        MERIDIANS_DATA.forEach(meridian => {
          if (!flowProgressRef.current[meridian.id]) {
            flowProgressRef.current[meridian.id] = 0;
          }
          flowProgressRef.current[meridian.id] =
            (flowProgressRef.current[meridian.id] + delta * speed) % 1;

          const pulses = pulseSpheresMap.get(meridian.id);
          if (pulses && pulses.length > 0) {
            const curve = new THREE.CatmullRomCurve3(
              meridian.curvePoints.map(p => new THREE.Vector3(p[0], p[1], p[2]))
            );
            const baseProgress = flowProgressRef.current[meridian.id];
            pulses.forEach((pulse, pIdx) => {
              const t = (baseProgress + pIdx / pulses.length) % 1;
              const point = curve.getPointAt(t);
              pulse.position.copy(point);
            });
          }
        });

        // Auto Cycle mode: change active meridian every 8 seconds
        if (circulationMode === 'cycle') {
          cycleTimerRef.current += delta * circulationSpeed;
          if (cycleTimerRef.current > 6.0) {
            cycleTimerRef.current = 0;
            setActiveMeridianIndex(prev => (prev + 1) % MERIDIANS_DATA.length);
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
    };
  }, [activeMeridianIndex, circulationMode, isPlaying, circulationSpeed]);

  // Smooth camera fly to focus on an anatomical region
  const focusOnMeridian = useCallback((meridian: Meridian) => {
    if (!cameraRef.current) return;
    const pts = meridian.curvePoints;
    let avgY = pts.reduce((sum, p) => sum + p[1], 0) / pts.length;
    controlsState.current.target.set(0, avgY, 0);
    controlsState.current.spherical.radius = 42;
    cameraRef.current.position.setFromSpherical(controlsState.current.spherical);
    cameraRef.current.lookAt(controlsState.current.target);
  }, []);

  const handleSelectMeridian = (idx: number) => {
    setActiveMeridianIndex(idx);
    focusOnMeridian(MERIDIANS_DATA[idx]);
  };

  const handleNextMeridian = () => {
    const nextIdx = (activeMeridianIndex + 1) % MERIDIANS_DATA.length;
    handleSelectMeridian(nextIdx);
  };

  const handlePrevMeridian = () => {
    const prevIdx = (activeMeridianIndex - 1 + MERIDIANS_DATA.length) % MERIDIANS_DATA.length;
    handleSelectMeridian(prevIdx);
  };

  const handleResetCamera = () => {
    if (!cameraRef.current) return;
    controlsState.current.spherical.set(48, Math.PI / 2.2, 0);
    controlsState.current.target.set(0, 0, 0);
    cameraRef.current.position.setFromSpherical(controlsState.current.spherical);
    cameraRef.current.lookAt(controlsState.current.target);
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Banner: Current Meridian Circulation Narrative */}
      <div className="absolute top-20 left-6 max-w-lg z-20 space-y-2 pointer-events-auto">
        <div className="p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl space-y-2 text-slate-200">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2.5">
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center font-serif text-sm font-bold shadow"
                style={{
                  backgroundColor: `${activeMeridian.color}25`,
                  color: activeMeridian.color,
                  border: `1.5px solid ${activeMeridian.color}60`
                }}
              >
                {activeMeridian.circulationOrder}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white font-serif flex items-center gap-1.5">
                    {activeMeridian.name}
                  </h2>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    {activeMeridian.code}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans">
                  {activeMeridian.pinyin} · {activeMeridian.timeSlot}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMeridian}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="上一条经脉"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMeridian}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="下一条经脉"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Key Flow Direction & Organ pairs */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">循行走向规程</span>
              <span className="text-cyan-300 font-medium">{activeMeridian.flowDirection.split('（')[0]}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">脏腑络属配偶</span>
              <span className="text-amber-300 font-medium">{activeMeridian.interiorOrgan} · {activeMeridian.pairedOrgan}</span>
            </div>
          </div>

          {/* Start and End Acupoints */}
          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-amber-400 font-semibold shrink-0">起端：</span>
              <span className="truncate">{activeMeridian.startingPoint}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-emerald-400 font-semibold shrink-0">止端：</span>
              <span className="truncate">{activeMeridian.terminatingPoint}</span>
            </div>
          </div>

          {/* Pathway expand toggle */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setShowPathwayCard(prev => !prev)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showPathwayCard ? '收起《灵枢·经脉》原文' : '查看《灵枢·经脉》循行径路原文'}</span>
            </button>
            <span className="text-[10px] text-slate-400">
              已标注 {activeMeridian.acupoints.length} 处核心穴位（可点击查看）
            </span>
          </div>

          {/* Detailed Classical Pathway Description */}
          {showPathwayCard && (
            <div className="bg-amber-950/20 border-l-2 border-amber-500/70 p-2.5 rounded-r-xl text-amber-100 font-serif text-[11px] leading-relaxed max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 animate-fade-in">
              {activeMeridian.pathwayDescription}
            </div>
          )}
        </div>
      </div>

      {/* Floating HUD Controls (Play/Pause, Circulation Mode, Camera Reset) */}
      <div className="absolute top-20 right-6 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Circulation Mode Switcher */}
        <div className="flex rounded-xl bg-slate-900/90 backdrop-blur-md p-1 border border-slate-700/80 text-xs shadow-xl">
          <button
            onClick={() => setCirculationMode('single')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              circulationMode === 'single'
                ? 'bg-cyan-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            单经研习
          </button>
          <button
            onClick={() => setCirculationMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              circulationMode === 'all'
                ? 'bg-cyan-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            十二经全览
          </button>
          <button
            onClick={() => setCirculationMode('cycle')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              circulationMode === 'cycle'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="子午流注动态自动轮巡"
          >
            子午流注巡行
          </button>
        </div>

        {/* Play / Pause Qi Flow */}
        <button
          onClick={() => setIsPlaying(prev => !prev)}
          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 shadow-xl transition-colors"
          title={isPlaying ? '暂停气血流动' : '开启气血巡行'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Speed multiplier */}
        <button
          onClick={() => setCirculationSpeed(prev => prev >= 3 ? 1 : prev + 1)}
          className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-amber-300 font-mono text-xs shadow-xl transition-colors"
          title="调整循行速率"
        >
          {circulationSpeed}x
        </button>

        {/* Reset Camera */}
        <button
          onClick={handleResetCamera}
          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 shadow-xl transition-colors"
          title="复位视角"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Hovered Acupoint Tooltip */}
      {hoveredAcupoint && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-cyan-200 text-xs shadow-2xl flex items-center gap-2 pointer-events-none animate-fade-in">
          <span className="font-serif font-bold text-white text-sm">{hoveredAcupoint.name}</span>
          <span className="text-[10px] text-cyan-400 font-mono">({hoveredAcupoint.code})</span>
          <span className="text-[11px] text-slate-300">| {hoveredAcupoint.actions}</span>
          <span className="text-[10px] text-amber-400">点击查看详细卡片</span>
        </div>
      )}

      {/* Acupoint Detail Floating Card */}
      {selectedAcupoint && (
        <AcupointDetailCard
          acupoint={selectedAcupoint}
          meridian={activeMeridian}
          onClose={() => setSelectedAcupoint(null)}
          onImportToGraph={onImportToGraph}
        />
      )}

      {/* Bottom Meridian Navigation Carousel */}
      <div className="absolute bottom-5 left-6 right-6 z-20 pointer-events-auto">
        <div className="p-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
          <div className="shrink-0 flex items-center gap-1.5 text-xs text-slate-400 pr-2 border-r border-slate-800">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="font-serif text-white font-medium">十二正经巡行</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {MERIDIANS_DATA.map((meridian, idx) => {
              const isSelected = idx === activeMeridianIndex;
              return (
                <button
                  key={meridian.id}
                  onClick={() => handleSelectMeridian(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-slate-800 text-white border shadow-lg scale-105'
                      : 'bg-slate-950/70 hover:bg-slate-800/80 text-slate-300 border border-slate-800'
                  }`}
                  style={{
                    borderColor: isSelected ? meridian.color : undefined,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: meridian.color }}
                  />
                  <div className="text-left">
                    <span className="block font-serif font-bold text-xs">{meridian.name}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      #{meridian.circulationOrder} {meridian.timeSlot.split(' ')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
