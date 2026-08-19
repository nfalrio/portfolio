import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { RoundedBox, Environment, Lightformer } from '@react-three/drei';

extend({ MeshLineGeometry, MeshLineMaterial });

// ---- Types ----
interface JointNodeProps {
  position: [number, number, number];
}

interface MeshLineInstance {
  setPoints: (points: number[]) => void;
}

function getCSSVar(name: string): string {
  if (typeof window === 'undefined') return '#000000';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// ---- Constants ----
const CARD_WIDTH = 1.6;
const CARD_HEIGHT = 2.3; // Reverted to original aspect ratio
const CARD_DEPTH = 0.04;
const WIND_STRENGTH = 0.05;

// ---- Texture Generators ----
function createFrontTexture(img?: HTMLImageElement): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 736;
  const ctx = canvas.getContext('2d')!;

  // Background fallback
  ctx.fillStyle = getCSSVar('--bg-surface') || '#222731';
  ctx.fillRect(0, 0, 512, 736);

  if (img) {
    // Fill with photo (cover)
    const imgAspect = img.width / img.height;
    const canvasAspect = 512 / 736;
    let sWidth = img.width;
    let sHeight = img.height;
    let sx = 0;
    let sy = 0;

    if (imgAspect > canvasAspect) {
      sWidth = img.height * canvasAspect;
      sx = (img.width - sWidth) / 2;
    } else {
      sHeight = img.width / canvasAspect;
      sy = (img.height - sHeight) / 2;
    }
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 512, 736);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createBackTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 736;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = getCSSVar('--bg-surface') || '#222731';
  ctx.fillRect(0, 0, 512, 736);

  // Border
  ctx.strokeStyle = getCSSVar('--accent') || '#D9A441';
  ctx.lineWidth = 12;
  ctx.strokeRect(24, 24, 464, 688);

  // Monogram
  ctx.fillStyle = getCSSVar('--accent') || '#D9A441';
  ctx.font = 'bold 160px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NR', 256, 368);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ---- Rope Band (MeshLine) ----
function RopeBand({
  refs,
}: {
  refs: React.RefObject<RapierRigidBody | null>[];
}) {
  const lineRef = useRef<MeshLineInstance>(null);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        refs.map(() => new THREE.Vector3())
      ),
    [refs]
  );

  useFrame(() => {
    if (!lineRef.current) return;
    const points: THREE.Vector3[] = [];
    if (refs[0].current && refs[1].current) {
      // 1. Ceiling anchor
      const fixedPos = refs[0].current.translation();
      points.push(new THREE.Vector3(fixedPos.x, fixedPos.y, fixedPos.z));
      
      // 2. Card clip anchor (needs to be offset to the top of the card clip and rotated properly)
      const cardPos = refs[1].current.translation();
      const cardRot = refs[1].current.rotation();
      const q = new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w);
      const clipOffset = new THREE.Vector3(0, (CARD_HEIGHT / 2) + 0.16, 0).applyQuaternion(q);
      
      points.push(new THREE.Vector3(cardPos.x + clipOffset.x, cardPos.y + clipOffset.y, cardPos.z + clipOffset.z));
    }
    if (points.length >= 2) {
      curve.points = points;
      const sampled = curve.getPoints(32);
      lineRef.current.setPoints(sampled.flatMap((p: THREE.Vector3) => [p.x, p.y, p.z]));
    }
  });

  return (
    <mesh>
      {/* @ts-expect-error meshline types */}
      <meshLineGeometry ref={lineRef} />
      {/* @ts-expect-error meshline types */}
      <meshLineMaterial
        lineWidth={0.3} // Increased significantly to guarantee visibility
        color={getCSSVar('--accent') || '#D9A441'}
        transparent
        opacity={0.9}
        depthTest={true}
      />
    </mesh>
  );
}

// ---- Physics Scene ----
function LanyardScene({ isMobile }: { isMobile: boolean }) {
  const fixedRef = useRef<RapierRigidBody>(null!);
  const j0Ref = useRef<RapierRigidBody>(null!);
  const j1Ref = useRef<RapierRigidBody>(null!);
  const j2Ref = useRef<RapierRigidBody>(null!);
  const j3Ref = useRef<RapierRigidBody>(null!);
  const cardRef = useRef<RapierRigidBody>(null!);
  const isDragging = useRef(false);
  const dragTarget = useRef(new THREE.Vector3());
  const lastDragTime = useRef(Date.now()); // tracks last user interaction
  
  const isHovered = useRef(false);
  const hoverTarget = useRef(new THREE.Vector2());

  useEffect(() => {
    const handleUp = () => {
      isDragging.current = false;
      lastDragTime.current = Date.now(); // record exact release moment
    };
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, []);

  // Textures
  const [frontTex, setFrontTex] = useState<THREE.CanvasTexture | null>(null);
  const backTex = useMemo(() => createBackTexture(), []);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/img/profil.jpeg';
    
    img.onload = () => {
      setFrontTex(createFrontTexture(img));
    };
    img.onerror = () => {
      console.warn("Lanyard: Failed to load profile image. Using fallback.");
      setFrontTex(createFrontTexture());
    };
  }, []);

  const { viewport, size } = useThree();
  const [targetDrop, setTargetDrop] = useState(0);

  // Measure exact vertical center of the text block in pixels and convert to 3D world space
  useEffect(() => {
    const updateTargetDrop = () => {
      const textEl = document.getElementById('hero-text');
      if (textEl) {
        const rect = textEl.getBoundingClientRect();
        // pixel center of the text block
        const textCenterYpx = rect.top + rect.height / 2;
        // pixel center of the screen/canvas
        const screenCenterYpx = window.innerHeight / 2;
        // offset from center in pixels (positive means text is lower than screen center)
        const pixelOffset = textCenterYpx - screenCenterYpx;
        // convert pixel offset to 3D world units (Three.js Y is UP, so we invert)
        const worldOffset = -(pixelOffset * (viewport.height / size.height));
        
        // Offset slightly UP (+0.4 world units) so it's not too low, while still adapting dynamically
        setTargetDrop(Math.min(worldOffset + 0.4, -0.2)); 
      }
    };
    
    updateTargetDrop();
    window.addEventListener('resize', updateTargetDrop);
    return () => window.removeEventListener('resize', updateTargetDrop);
  }, [viewport.height, size.height]);
  
  // Ensure the clip point is always visible at the top of the viewport
  const anchorY = (viewport.height / 2) - 0.2; 
  
  // Calculate exactly how long the single rope needs to be
  // The distance from the anchor to the card's center must be exactly (anchorY - targetDrop).
  // The card connects to the rope at its clip, which is (CARD_HEIGHT/2 + 0.16) above its center.
  const dynamicRopeLength = Math.max(0.1, anchorY - targetDrop - (CARD_HEIGHT / 2) - 0.16);

  const cardMeshRef = useRef<THREE.Group>(null);

  // Single exact rope joint for flawless positioning
  useRopeJoint(fixedRef, cardRef, [[0, 0, 0], [0, (CARD_HEIGHT / 2) + 0.16, 0], dynamicRopeLength]);

  // Wind + idle return + robust restoring torque
  useFrame((state, delta) => {
    if (isDragging.current && cardRef.current) {
      lastDragTime.current = Date.now(); // update idle timer on every drag frame
      const currentPos = cardRef.current.translation();
      const velocity = {
        x: (dragTarget.current.x - currentPos.x) * 15,
        y: (dragTarget.current.y - currentPos.y) * 15,
        z: 0,
      };
      cardRef.current.setLinvel(velocity, true);
      cardRef.current.wakeUp();
    } else if (cardRef.current) {
      const pos = cardRef.current.translation();
      const idleSec = (Date.now() - lastDragTime.current) / 1000;
      const isReturning = idleSec > 5.0 && !isHovered.current;

      if (isReturning && pos) {
        // Return to perfectly plumb
        const dist = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
        if (dist > 0.05) {
          // Slowed down the return speed significantly
          const speed = Math.min(dist * 0.8, 1.2); // faster when further away
          const currentVel = cardRef.current.linvel();
          cardRef.current.setLinvel(
            {
              x: (-pos.x / dist) * speed,
              y: currentVel.y, // keep gravity-driven Y untouched
              z: (-pos.z / dist) * speed,
            },
            true
          );
        } else {
          // Close enough — kill lateral movement so it stops cleanly
          const currentVel = cardRef.current.linvel();
          cardRef.current.setLinvel({ x: 0, y: currentVel.y, z: 0 }, true);
        }
      } else {
        // ─── Active wind (only when recently touched) ───
        const t = state.clock.getElapsedTime();
        const windX = Math.sin(t * 1.4) * WIND_STRENGTH + Math.cos(t * 2.1) * 0.02;
        const windZ = Math.sin(t * 1.8) * 0.025;
        cardRef.current.applyImpulse(
          { x: windX * delta, y: 0, z: windZ * delta },
          true
        );
      }

      // ─── Robust restoring torque (always active) ───
      const rot = cardRef.current.rotation();
      const q = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
      const cardUp = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
      const worldUp = new THREE.Vector3(0, 1, 0);
      const dot = cardUp.dot(worldUp);

      if (dot > -0.98) {
        const axis = new THREE.Vector3().crossVectors(cardUp, worldUp);
        const tiltAngle = Math.acos(Math.max(-1, Math.min(1, dot)));
        const strength = tiltAngle * 2.5 * delta;
        cardRef.current.applyTorqueImpulse(
          { x: axis.x * strength, y: 0, z: axis.z * strength },
          true
        );
      } else {
        // Fully flipped — kick to escape dead zone
        const kickStrength = 3.5 * delta;
        cardRef.current.applyTorqueImpulse(
          { x: kickStrength, y: 0, z: kickStrength * 0.3 },
          true
        );
      }

        // ─── Z-spring (always) ───
      const pos2 = cardRef.current.translation();
      if (Math.abs(pos2.z) > 0.1) {
        cardRef.current.applyImpulse({ x: 0, y: 0, z: -pos2.z * 0.8 * delta }, true);
      }

      // ─── Front-face rotation restore or hover tilt ───
      // Front face local normal is +Z; camera at +Z sees front when Y-rotation ≈ 0
      if (isHovered.current && !isDragging.current) {
        lastDragTime.current = Date.now(); // keep awake, prevent idle return
        const rot2 = cardRef.current.rotation();
        const qCard = new THREE.Quaternion(rot2.x, rot2.y, rot2.z, rot2.w);
        const euler = new THREE.Euler().setFromQuaternion(qCard, 'YXZ');

        // max tilt ~11.5 degrees
        const MAX_TILT = 0.2; 
        const targetX = hoverTarget.current.y * MAX_TILT; // pitch
        const targetY = -hoverTarget.current.x * MAX_TILT; // yaw

        let yErr = targetY - euler.y;
        if (yErr > Math.PI)  yErr -= 2 * Math.PI;
        if (yErr < -Math.PI) yErr += 2 * Math.PI;

        let xErr = targetX - euler.x;
        if (xErr > Math.PI)  xErr -= 2 * Math.PI;
        if (xErr < -Math.PI) xErr += 2 * Math.PI;

        const angSpeed = 4.0;
        cardRef.current.setAngvel(
          {
            x: xErr * angSpeed,
            y: yErr * angSpeed,
            z: -euler.z * 1.5,
          },
          true
        );
        // Subtle lateral push for 'swing' feel
        cardRef.current.applyImpulse({
          x: hoverTarget.current.x * 0.04 * delta,
          y: 0,
          z: 0
        }, true);
      } else if (isReturning) {
        const rot2 = cardRef.current.rotation();
        const qCard = new THREE.Quaternion(rot2.x, rot2.y, rot2.z, rot2.w);
        const euler = new THREE.Euler().setFromQuaternion(qCard, 'YXZ');

        // Natural rest tilt (looks more realistic than perfectly straight)
        const targetY = -0.15; // slightly turned
        const targetX = 0.05;  // slightly tilted forward

        let yErr = targetY - euler.y;
        if (yErr > Math.PI)  yErr -= 2 * Math.PI;
        if (yErr < -Math.PI) yErr += 2 * Math.PI;

        let xErr = targetX - euler.x;
        if (xErr > Math.PI)  xErr -= 2 * Math.PI;
        if (xErr < -Math.PI) xErr += 2 * Math.PI;

        let zErr = -euler.z; // keep Z straight

        if (Math.abs(yErr) > 0.02 || Math.abs(zErr) > 0.02 || Math.abs(xErr) > 0.02) {
          const angSpeed = 1.2;
          cardRef.current.setAngvel(
            {
              x: xErr * angSpeed,
              y: yErr * angSpeed,
              z: zErr * angSpeed * 0.4,
            },
            true
          );
        } else {
          // Aligned — kill remaining angular velocity
          cardRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }
      }
    }
  });

  const handlePointerDown = (e: import('@react-three/fiber').ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isDragging.current = true;
    dragTarget.current.copy(e.point);
    if (e.nativeEvent.target instanceof HTMLElement) {
      try {
        e.nativeEvent.target.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handlePointerMove = (e: import('@react-three/fiber').ThreeEvent<PointerEvent>) => {
    if (isDragging.current) {
      dragTarget.current.copy(e.point);
    } else if (isHovered.current && e.uv) {
      // e.uv ranges from 0 to 1. Map to -1 to 1 for tilt calculation.
      hoverTarget.current.set((e.uv.x - 0.5) * 2, (e.uv.y - 0.5) * 2);
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const jointNodeProps = { colliders: false as const, linearDamping: 2.0 };

  return (
    <>
      <ambientLight intensity={Math.PI} />
      <Environment resolution={isMobile ? 128 : 256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
        </group>
      </Environment>

      {/* Fixed anchor — dynamically placed at top of viewport */}
      <RigidBody ref={fixedRef} type="fixed" position={[0, anchorY, 0]}>
        <mesh visible={false}>
          <sphereGeometry args={[0.08]} />
          <meshBasicMaterial color={getCSSVar('--bg-surface')} />
        </mesh>
      </RigidBody>

      {/* Card body — spawned near the anchor to freefall and bounce at the end of the rope */}
      <RigidBody
        ref={cardRef}
        position={[0, anchorY - 0.5, 0]}
        mass={1.5}
        angularDamping={6.0}
        linearDamping={4.0}
        colliders="cuboid"
      >
        <group
          ref={cardMeshRef as any}
          onPointerDown={handlePointerDown}
          onPointerOver={(e) => {
            e.stopPropagation();
            isHovered.current = true;
            document.body.style.cursor = 'grab';
          }}
          onPointerOut={(e) => {
            isHovered.current = false;
            document.body.style.cursor = 'auto';
            hoverTarget.current.set(0, 0); // Reset tilt
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Main Card Body */}
          <RoundedBox
            args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]}
            radius={0.08}
            smoothness={4}
            castShadow
          >
            <meshStandardMaterial color={getCSSVar('--bg-surface') || '#222731'} roughness={0.1} metalness={0.8} />
          </RoundedBox>

          {/* Metal Clip / Hook at top */}
          <mesh position={[0, CARD_HEIGHT / 2 + 0.08, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
            <meshStandardMaterial metalness={0.9} roughness={0.3} color="#999999" />
          </mesh>
          <mesh position={[0, CARD_HEIGHT / 2 - 0.02, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.06]} />
            <meshStandardMaterial metalness={0.9} roughness={0.3} color="#999999" />
          </mesh>

          {/* Front Face (Photo) */}
          {frontTex && (
            <mesh position={[0, 0, CARD_DEPTH / 2 + 0.001]}>
              <planeGeometry args={[CARD_WIDTH - 0.04, CARD_HEIGHT - 0.04]} />
              <meshPhysicalMaterial
                map={frontTex}
                roughness={0.1}
                metalness={0.3}
                clearcoat={0.8}
                clearcoatRoughness={0.1}
                transparent
              />
            </mesh>
          )}

          {/* Back Face (Monogram) */}
          <mesh position={[0, 0, -CARD_DEPTH / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[CARD_WIDTH - 0.04, CARD_HEIGHT - 0.04]} />
            <meshPhysicalMaterial
              map={backTex}
              roughness={0.3}
              metalness={0.1}
              clearcoat={0.3}
            />
          </mesh>
        </group>
      </RigidBody>

      {/* Rope band */}
      <RopeBand refs={[fixedRef, cardRef]} />
    </>
  );
}

// ---- Main Export ----
export default function Lanyard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'auto',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]} timeStep={isMobile ? 1 / 45 : 1 / 60}>
            <LanyardScene isMobile={isMobile} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
