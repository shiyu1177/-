import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { TCMNode, TCMRelation, OrganizationDimension, Graph3DLayout } from '../types/tcm';
import { CATEGORY_MAP } from '../data/tcmConfig';

interface TCMGraph3DProps {
  nodes: TCMNode[];
  relations: TCMRelation[];
  dimension: OrganizationDimension;
  layout: Graph3DLayout;
  selectedNodeId: string | null;
  selectedNodeIds?: string[];
  onSelectNode: (node: TCMNode | null, isMultiSelect?: boolean) => void;
  highlightedPathNodeIds?: string[];
}

interface SimNode extends TCMNode {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  targetX?: number;
  targetY?: number;
  targetZ?: number;
  mesh?: THREE.Mesh;
  sprite?: THREE.Sprite;
  glowMesh?: THREE.Mesh;
}

export const TCMGraph3D: React.FC<TCMGraph3DProps> = ({
  nodes,
  relations,
  dimension,
  layout,
  selectedNodeId,
  selectedNodeIds = [],
  onSelectNode,
  highlightedPathNodeIds = []
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<TCMNode | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [viewDistance, setViewDistance] = useState<number>(360);

  // References to keep Three.js state across re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesGroupRef = useRef<THREE.Group | null>(null);
  const linksGroupRef = useRef<THREE.Group | null>(null);
  const particlesGroupRef = useRef<THREE.Group | null>(null);
  const simNodesRef = useRef<SimNode[]>([]);
  const simRelationsRef = useRef<TCMRelation[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  // Mouse interaction state
  const isDraggingRef = useRef(false);
  const isRightDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const cameraPosTargetRef = useRef<THREE.Vector3 | null>(null);

  // Effective selected node IDs (single or multiple)
  const activeSelectedIds = React.useMemo(() => {
    if (selectedNodeIds && selectedNodeIds.length > 0) return selectedNodeIds;
    return selectedNodeId ? [selectedNodeId] : [];
  }, [selectedNodeId, selectedNodeIds]);

  // Filtered relations based on selected organization dimension
  const filteredRelations = React.useMemo(() => {
    if (dimension === 'all') return relations;
    return relations.filter(r => r.dimension === dimension);
  }, [relations, dimension]);

  // Connected nodes map for highlighting neighbors
  const connectedNodeIds = React.useMemo(() => {
    if (activeSelectedIds.length === 0) return new Set<string>();
    const set = new Set<string>(activeSelectedIds);
    filteredRelations.forEach(r => {
      if (activeSelectedIds.includes(r.source)) set.add(r.target);
      if (activeSelectedIds.includes(r.target)) set.add(r.source);
    });
    return set;
  }, [activeSelectedIds, filteredRelations]);

  // Helper to create text sprite for node label
  const createTextSprite = (text: string, color: string, isBig = false) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Soft background tag
      ctx.fillStyle = 'rgba(10, 16, 26, 0.75)';
      ctx.roundRect ? ctx.roundRect(8, 8, canvas.width - 16, canvas.height - 16, 8) : ctx.fillRect(8, 8, canvas.width - 16, canvas.height - 16);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = isBig ? 'bold 26px "PingFang SC", "Microsoft YaHei", sans-serif' : '22px "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(24, 6, 1);
    return sprite;
  };

  // Compute Layout Target Positions
  const computeTargetPositions = useCallback((simNodes: SimNode[], currentLayout: Graph3DLayout) => {
    const count = simNodes.length;
    if (count === 0) return;

    if (currentLayout === 'force') {
      // Force layout lets dynamic force simulation handle positions
      return;
    }

    if (currentLayout === 'sphere_classification') {
      // Celestial nested spheres by category
      const categories: string[] = ['theory', 'meridian', 'syndrome', 'method', 'formula', 'herb', 'pathology', 'symptom'];
      simNodes.forEach((node, idx) => {
        const catIdx = categories.indexOf(node.category);
        const radius = 100 + (catIdx !== -1 ? catIdx * 25 : 120);
        const phi = Math.acos(-1 + (2 * idx) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;

        node.targetX = radius * Math.cos(theta) * Math.sin(phi);
        node.targetY = radius * Math.sin(theta) * Math.sin(phi);
        node.targetZ = radius * Math.cos(phi);
      });
    } else if (currentLayout === 'thematic_rings') {
      // Distinct helical rings grouped by thematic groups
      const themes = Array.from(new Set(simNodes.map(n => n.thematicGroup || '总论')));
      simNodes.forEach((node) => {
        const tIdx = themes.indexOf(node.thematicGroup || '总论');
        const themeNodes = simNodes.filter(n => (n.thematicGroup || '总论') === (node.thematicGroup || '总论'));
        const inGroupIdx = themeNodes.indexOf(node);
        const ringAngle = (tIdx / Math.max(1, themes.length)) * Math.PI * 2;
        const ringCenterX = Math.cos(ringAngle) * 160;
        const ringCenterZ = Math.sin(ringAngle) * 160;
        const ringCenterY = (tIdx - themes.length / 2) * 40;

        const subAngle = (inGroupIdx / Math.max(1, themeNodes.length)) * Math.PI * 2;
        const subRadius = 45;

        node.targetX = ringCenterX + Math.cos(subAngle) * subRadius;
        node.targetY = ringCenterY + Math.sin(subAngle) * subRadius * 0.6;
        node.targetZ = ringCenterZ + Math.sin(subAngle) * subRadius;
      });
    } else if (currentLayout === 'meridian_cube') {
      // 3D coordinate system:
      // Y: Upper (上焦/肺心头面) -> Middle (中焦/脾胃肝胆) -> Lower (下焦/肾膀胱)
      // X: External 表 (卫表肌腠) -> Internal 里 (内脏精髓)
      simNodes.forEach((node, idx) => {
        let posY = 0;
        let posX = 0;
        if (node.category === 'theory' || node.category === 'symptom') posY = 90;
        else if (node.category === 'syndrome' || node.category === 'formula') posY = 20;
        else if (node.category === 'herb' || node.category === 'method') posY = -40;
        else posY = -90;

        const angle = (idx / count) * Math.PI * 2;
        const rad = 70 + (idx % 3) * 35;
        posX = Math.cos(angle) * rad;
        const posZ = Math.sin(angle) * rad;

        node.targetX = posX;
        node.targetY = posY;
        node.targetZ = posZ;
      });
    }
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060b13);
    scene.fog = new THREE.FogExp2(0x060b13, 0.0012);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000);
    camera.position.set(0, 80, viewDistance);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xa5f3fc, 1.5);
    dirLight1.position.set(200, 300, 200);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xfef08a, 0.8);
    dirLight2.position.set(-200, -200, -200);
    scene.add(dirLight2);

    // Decorative Cosmic Grid Rings (TCM Taiji / Astrological Celestial Rings)
    const ringGroup = new THREE.Group();
    const ringMat = new THREE.LineBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.35 });
    [80, 150, 220, 290].forEach(r => {
      const ringGeo = new THREE.BufferGeometry();
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * r, -80, Math.sin(theta) * r));
      }
      ringGeo.setFromPoints(points);
      const ringLine = new THREE.Line(ringGeo, ringMat);
      ringGroup.add(ringLine);
    });
    scene.add(ringGroup);

    // Subtle background dust stars
    const starGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 1200;
      starCoords[i + 1] = (Math.random() - 0.5) * 1000;
      starCoords[i + 2] = (Math.random() - 0.5) * 1200;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 2.2, transparent: true, opacity: 0.5 });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Node & Link groups
    const nodesGroup = new THREE.Group();
    const linksGroup = new THREE.Group();
    const particlesGroup = new THREE.Group();
    scene.add(linksGroup);
    scene.add(nodesGroup);
    scene.add(particlesGroup);
    nodesGroupRef.current = nodesGroup;
    linksGroupRef.current = linksGroup;
    particlesGroupRef.current = particlesGroup;

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Update nodes and links meshes when nodes/relations/dimension change
  useEffect(() => {
    if (!sceneRef.current || !nodesGroupRef.current || !linksGroupRef.current) return;

    const nodesGroup = nodesGroupRef.current;
    const linksGroup = linksGroupRef.current;

    // Clear old meshes
    while (nodesGroup.children.length > 0) {
      const obj = nodesGroup.children[0];
      nodesGroup.remove(obj);
    }
    while (linksGroup.children.length > 0) {
      const obj = linksGroup.children[0];
      linksGroup.remove(obj);
    }

    // Initialize simulation nodes
    const simNodes: SimNode[] = nodes.map((node, i) => {
      // Find existing coordinates or distribute randomly on sphere
      const existing = simNodesRef.current.find(n => n.id === node.id);
      const angle = (i / Math.max(1, nodes.length)) * Math.PI * 2;
      const radius = 90 + Math.random() * 80;
      const height = (Math.random() - 0.5) * 120;

      return {
        ...node,
        x: existing ? existing.x : Math.cos(angle) * radius,
        y: existing ? existing.y : height,
        z: existing ? existing.z : Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        vz: 0
      };
    });

    computeTargetPositions(simNodes, layout);
    simNodesRef.current = simNodes;
    simRelationsRef.current = filteredRelations;

    // Shared sphere geometry
    const sphereGeometry = new THREE.SphereGeometry(1, 24, 24);

    // Create 3D Meshes for each Node
    simNodes.forEach(simNode => {
      const catMeta = CATEGORY_MAP[simNode.category] || CATEGORY_MAP.theory;
      const nodeColor = new THREE.Color(catMeta.color);

      const baseRadius = 5.5 + (simNode.importance ? (simNode.importance / 10) * 4 : 2);

      // Node mesh
      const material = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: nodeColor.clone().multiplyScalar(0.4),
        roughness: 0.25,
        metalness: 0.35,
      });

      const mesh = new THREE.Mesh(sphereGeometry, material);
      mesh.scale.set(baseRadius, baseRadius, baseRadius);
      mesh.position.set(simNode.x, simNode.y, simNode.z);
      mesh.userData = { nodeId: simNode.id, nodeName: simNode.name, node: simNode };

      // Outer glow aura
      const haloGeo = new THREE.SphereGeometry(baseRadius * 1.45, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.22,
        side: THREE.BackSide,
      });
      const glowMesh = new THREE.Mesh(haloGeo, haloMat);
      mesh.add(glowMesh);

      // Text billboard label
      const isBigNode = Boolean(simNode.importance && simNode.importance >= 9);
      const sprite = createTextSprite(simNode.name, catMeta.color, isBigNode);
      sprite.position.set(0, baseRadius + 4.5, 0);
      mesh.add(sprite);

      nodesGroup.add(mesh);
      simNode.mesh = mesh;
      simNode.sprite = sprite;
      simNode.glowMesh = glowMesh;
    });

  }, [nodes, filteredRelations, layout, computeTargetPositions]);

  // Adjust highlight and transparency based on selection & hover
  useEffect(() => {
    if (!simNodesRef.current.length) return;

    const hasSelection = activeSelectedIds.length > 0;

    simNodesRef.current.forEach(simNode => {
      if (!simNode.mesh) return;
      const isSelected = activeSelectedIds.includes(simNode.id);
      const isHovered = hoveredNode && hoveredNode.id === simNode.id;
      const isNeighbor = connectedNodeIds.has(simNode.id);
      const isPath = highlightedPathNodeIds.includes(simNode.id);

      const catMeta = CATEGORY_MAP[simNode.category] || CATEGORY_MAP.theory;
      const baseColor = new THREE.Color(catMeta.color);
      const mat = simNode.mesh.material as THREE.MeshStandardMaterial;

      if (hasSelection) {
        if (isSelected) {
          const selectIndex = activeSelectedIds.indexOf(simNode.id);
          const haloColor = selectIndex === 1 ? 0xec4899 : 0xfacc15; // Pink/Cyan for node 2, Gold for node 1
          mat.emissive = new THREE.Color(haloColor);
          mat.color = new THREE.Color(0xffffff);
          simNode.mesh.scale.set(13, 13, 13);
          if (simNode.glowMesh) {
            simNode.glowMesh.scale.set(2.4, 2.4, 2.4);
            (simNode.glowMesh.material as THREE.MeshBasicMaterial).opacity = 0.75;
            (simNode.glowMesh.material as THREE.MeshBasicMaterial).color.set(haloColor);
          }
        } else if (isNeighbor || isPath) {
          mat.emissive = baseColor.clone().multiplyScalar(0.7);
          mat.color = baseColor;
          simNode.mesh.scale.set(9, 9, 9);
          if (simNode.glowMesh) {
            (simNode.glowMesh.material as THREE.MeshBasicMaterial).opacity = 0.35;
          }
        } else {
          // Dim unrelated nodes
          mat.emissive = baseColor.clone().multiplyScalar(0.08);
          mat.color = baseColor.clone().multiplyScalar(0.25);
          simNode.mesh.scale.set(5, 5, 5);
          if (simNode.glowMesh) {
            (simNode.glowMesh.material as THREE.MeshBasicMaterial).opacity = 0.05;
          }
        }
      } else {
        // Normal state
        if (isHovered) {
          mat.emissive = baseColor.clone().multiplyScalar(0.9);
          simNode.mesh.scale.set(10.5, 10.5, 10.5);
          if (simNode.glowMesh) {
            (simNode.glowMesh.material as THREE.MeshBasicMaterial).opacity = 0.5;
          }
        } else {
          const baseRadius = 5.5 + (simNode.importance ? (simNode.importance / 10) * 3 : 2);
          mat.emissive = baseColor.clone().multiplyScalar(0.35);
          mat.color = baseColor;
          simNode.mesh.scale.set(baseRadius, baseRadius, baseRadius);
          if (simNode.glowMesh) {
            simNode.glowMesh.scale.set(1.4, 1.4, 1.4);
            (simNode.glowMesh.material as THREE.MeshBasicMaterial).opacity = 0.22;
          }
        }
      }
    });
  }, [activeSelectedIds, connectedNodeIds, hoveredNode, highlightedPathNodeIds]);

  // Camera Fly-To when selected nodes change (single or dual midpoint)
  useEffect(() => {
    if (activeSelectedIds.length === 0) return;

    if (activeSelectedIds.length === 1) {
      const targetNode = simNodesRef.current.find(n => n.id === activeSelectedIds[0]);
      if (targetNode && cameraRef.current) {
        cameraTargetRef.current = new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z);
        cameraPosTargetRef.current = new THREE.Vector3(
          targetNode.x + 35,
          targetNode.y + 40,
          targetNode.z + 90
        );
      }
    } else if (activeSelectedIds.length === 2) {
      const node1 = simNodesRef.current.find(n => n.id === activeSelectedIds[0]);
      const node2 = simNodesRef.current.find(n => n.id === activeSelectedIds[1]);
      if (node1 && node2 && cameraRef.current) {
        const midX = (node1.x + node2.x) / 2;
        const midY = (node1.y + node2.y) / 2;
        const midZ = (node1.z + node2.z) / 2;
        const dist = Math.hypot(node1.x - node2.x, node1.y - node2.y, node1.z - node2.z);
        cameraTargetRef.current = new THREE.Vector3(midX, midY, midZ);
        const viewDist = Math.max(130, dist * 1.55);
        cameraPosTargetRef.current = new THREE.Vector3(midX + 25, midY + 45, midZ + viewDist);
      }
    }
  }, [activeSelectedIds]);

  // Main Render & Physics Simulation Loop
  useEffect(() => {
    let pulseTime = 0;

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      pulseTime += 0.02;

      const simNodes = simNodesRef.current;
      const simRelations = simRelationsRef.current;
      const linksGroup = linksGroupRef.current;

      // Force or Target interpolation
      if (layout === 'force') {
        // Physical Force Simulation:
        // 1. Repulsion between all node pairs
        for (let i = 0; i < simNodes.length; i++) {
          for (let j = i + 1; j < simNodes.length; j++) {
            const n1 = simNodes[i];
            const n2 = simNodes[j];
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            const dz = n1.z - n2.z;
            const distSq = dx * dx + dy * dy + dz * dz + 10;
            const dist = Math.sqrt(distSq);
            if (dist < 260) {
              const force = 350 / distSq;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              const fz = (dz / dist) * force;
              n1.vx += fx;
              n1.vy += fy;
              n1.vz += fz;
              n2.vx -= fx;
              n2.vy -= fy;
              n2.vz -= fz;
            }
          }
        }

        // 2. Spring attraction along links
        const nodeMap = new Map(simNodes.map(n => [n.id, n]));
        for (const rel of simRelations) {
          const n1 = nodeMap.get(rel.source);
          const n2 = nodeMap.get(rel.target);
          if (n1 && n2) {
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dz = n2.z - n1.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;
            const desiredDist = 55;
            const springForce = (dist - desiredDist) * 0.015;
            const fx = (dx / dist) * springForce;
            const fy = (dy / dist) * springForce;
            const fz = (dz / dist) * springForce;
            n1.vx += fx;
            n1.vy += fy;
            n1.vz += fz;
            n2.vx -= fx;
            n2.vy -= fy;
            n2.vz -= fz;
          }
        }

        // 3. Centering force & damping
        simNodes.forEach(n => {
          n.vx -= n.x * 0.002;
          n.vy -= n.y * 0.002;
          n.vz -= n.z * 0.002;

          n.vx *= 0.88;
          n.vy *= 0.88;
          n.vz *= 0.88;

          n.x += n.vx;
          n.y += n.vy;
          n.z += n.vz;

          if (n.mesh) {
            n.mesh.position.set(n.x, n.y, n.z);
          }
        });
      } else {
        // Interpolate smoothly toward computed target layout positions
        simNodes.forEach(n => {
          if (n.targetX !== undefined) {
            n.x += (n.targetX - n.x) * 0.08;
            n.y += ((n.targetY || 0) - n.y) * 0.08;
            n.z += ((n.targetZ || 0) - n.z) * 0.08;
            if (n.mesh) {
              n.mesh.position.set(n.x, n.y, n.z);
            }
          }
        });
      }

      // Rebuild link lines in 3D
      if (linksGroup) {
        while (linksGroup.children.length > 0) {
          const obj = linksGroup.children[0];
          linksGroup.remove(obj);
        }

        const nodeMap = new Map(simNodes.map(n => [n.id, n]));

        simRelations.forEach(rel => {
          const src = nodeMap.get(rel.source);
          const tgt = nodeMap.get(rel.target);
          if (src && tgt) {
            const isRelevant =
              activeSelectedIds.length === 0 ||
              activeSelectedIds.includes(rel.source) ||
              activeSelectedIds.includes(rel.target);

            const isDirectBetweenSelected =
              activeSelectedIds.length >= 2 &&
              activeSelectedIds.includes(rel.source) &&
              activeSelectedIds.includes(rel.target);

            const isPath =
              highlightedPathNodeIds.includes(rel.source) &&
              highlightedPathNodeIds.includes(rel.target);

            // Determine line color by relation dimension
            let linkColor = 0x38bdf8; // cyan
            if (rel.dimension === 'classification') linkColor = 0x10b981; // emerald
            if (rel.dimension === 'thematic') linkColor = 0xf59e0b; // amber
            if (rel.dimension === 'relational') linkColor = 0xec4899; // rose
            if (isDirectBetweenSelected) linkColor = 0xf43f5e; // vibrant rose for dual selection connection
            if (isPath) linkColor = 0xfacc15; // bright gold

            const points = [
              new THREE.Vector3(src.x, src.y, src.z),
              new THREE.Vector3(tgt.x, tgt.y, tgt.z)
            ];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
              color: linkColor,
              transparent: true,
              opacity: isDirectBetweenSelected ? 1.0 : isPath ? 0.95 : isRelevant ? (activeSelectedIds.length > 0 ? 0.8 : 0.45) : 0.08,
              linewidth: isDirectBetweenSelected ? 3.5 : isPath ? 3 : isRelevant ? 2 : 1
            });
            const line = new THREE.Line(geometry, material);
            linksGroup.add(line);
          }
        });
      }

      // Camera smooth target interpolation
      if (cameraRef.current) {
        if (cameraPosTargetRef.current) {
          cameraRef.current.position.lerp(cameraPosTargetRef.current, 0.06);
          if (cameraRef.current.position.distanceTo(cameraPosTargetRef.current) < 2) {
            cameraPosTargetRef.current = null;
          }
        }

        // Camera auto rotation if not dragging and enabled
        if (isRotating && !isDraggingRef.current && !selectedNodeId) {
          const rotSpeed = 0.0018;
          const x = cameraRef.current.position.x;
          const z = cameraRef.current.position.z;
          cameraRef.current.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
          cameraRef.current.position.z = x * Math.sin(rotSpeed) + z * Math.cos(rotSpeed);
        }

        cameraRef.current.lookAt(cameraTargetRef.current);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [layout, selectedNodeId, highlightedPathNodeIds, isRotating]);

  // Mouse / Touch Event Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) isDraggingRef.current = true;
    if (e.button === 2) isRightDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cameraRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

    if (isDraggingRef.current) {
      // Rotate camera around target
      const camera = cameraRef.current;
      const offset = camera.position.clone().sub(cameraTargetRef.current);
      const radius = offset.length();
      let theta = Math.atan2(offset.x, offset.z);
      let phi = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));

      theta -= deltaX * 0.008;
      phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi - deltaY * 0.008));

      camera.position.x = cameraTargetRef.current.x + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = cameraTargetRef.current.y + radius * Math.cos(phi);
      camera.position.z = cameraTargetRef.current.z + radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(cameraTargetRef.current);
    } else if (isRightDraggingRef.current) {
      // Pan camera target
      const panSpeed = 0.35;
      const forward = cameraRef.current.getWorldDirection(new THREE.Vector3());
      const right = new THREE.Vector3().crossVectors(forward, cameraRef.current.up).normalize();
      const up = new THREE.Vector3().crossVectors(right, forward).normalize();

      cameraTargetRef.current.add(right.multiplyScalar(-deltaX * panSpeed));
      cameraTargetRef.current.add(up.multiplyScalar(deltaY * panSpeed));
      cameraRef.current.position.add(right.multiplyScalar(-deltaX * panSpeed));
      cameraRef.current.position.add(up.multiplyScalar(deltaY * panSpeed));
    } else {
      // Raycasting for hover
      if (!mountRef.current || !rendererRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);
      if (nodesGroupRef.current) {
        const intersects = raycaster.intersectObjects(nodesGroupRef.current.children, false);
        if (intersects.length > 0) {
          const topObj = intersects[0].object;
          if (topObj.userData && topObj.userData.node) {
            setHoveredNode(topObj.userData.node);
            return;
          }
        }
      }
      setHoveredNode(null);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isRightDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!cameraRef.current) return;
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
    const offset = cameraRef.current.position.clone().sub(cameraTargetRef.current);
    const newLen = Math.max(40, Math.min(1200, offset.length() * zoomFactor));
    offset.setLength(newLen);
    cameraRef.current.position.copy(cameraTargetRef.current).add(offset);
    setViewDistance(newLen);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const isMultiSelect = Boolean(e.ctrlKey || e.metaKey || e.shiftKey);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    if (nodesGroupRef.current) {
      const intersects = raycaster.intersectObjects(nodesGroupRef.current.children, false);
      if (intersects.length > 0) {
        const clickedNode = intersects[0].object.userData.node as TCMNode;
        if (clickedNode) {
          onSelectNode(clickedNode, isMultiSelect);
          return;
        }
      }
    }
    // Clicked empty background
    onSelectNode(null, false);
  };

  const resetView = () => {
    cameraTargetRef.current = new THREE.Vector3(0, 0, 0);
    cameraPosTargetRef.current = new THREE.Vector3(0, 80, 360);
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Floating 3D Navigation Controls Toolbar */}
      <div className="absolute bottom-5 left-6 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 shadow-xl text-xs text-slate-300">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            isRotating
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
          title="开启或暂停天地周天自转"
        >
          {isRotating ? '⏸ 暂停天行' : '▶ 漫游自转'}
        </button>
        <button
          onClick={resetView}
          className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
          title="重置视角至原点"
        >
          ↺ 视角归元
        </button>
        <div className="h-3 w-px bg-slate-700 mx-1" />
        <span className="text-slate-400 font-mono">
          节点: <b className="text-cyan-300">{nodes.length}</b> | 关系: <b className="text-emerald-300">{filteredRelations.length}</b>
        </span>
      </div>

      {/* Hover Node Tooltip */}
      {hoveredNode && activeSelectedIds.length === 0 && (
        <div
          className="pointer-events-none absolute top-6 left-6 z-20 max-w-sm bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-cyan-500/30 shadow-2xl animate-fade-in"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: CATEGORY_MAP[hoveredNode.category]?.color || '#38bdf8' }}
            />
            <h4 className="font-bold text-slate-100 text-base">{hoveredNode.name}</h4>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-cyan-500/20">
              {CATEGORY_MAP[hoveredNode.category]?.label}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
            {hoveredNode.description}
          </p>
          {hoveredNode.thematicGroup && (
            <div className="mt-2 text-[11px] text-amber-300/90 flex items-center gap-1">
              <span>研讨主题:</span>
              <span className="font-medium">{hoveredNode.thematicGroup}</span>
            </div>
          )}
        </div>
      )}

      {/* 3D Visual Tips */}
      <div className="absolute top-4 right-4 pointer-events-none text-right text-[11px] text-slate-400/80 bg-slate-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800">
        <div>左键拖拽：旋转 | 滚轮：缩放 | 右键：平移</div>
        <div className="text-cyan-300/90">单击：单节点辨证 | Ctrl/Cmd+单击：双节点属性对比</div>
      </div>
    </div>
  );
};
