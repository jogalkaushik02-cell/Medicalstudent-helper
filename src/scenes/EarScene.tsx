import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export type EarOverlay =
  | 'normal'
  | 'aom'
  | 'otitis-externa'
  | 'cholesteatoma'
  | 'otosclerosis'
  | 'schwannoma'

export interface EarLayers {
  outer: boolean
  middle: boolean
  inner: boolean
  nerves: boolean
}

export interface EarSceneProps {
  selected: string | null
  onSelect: (id: string | null) => void
  layers: EarLayers
  overlay: EarOverlay
  labels: boolean
  pulse: boolean
  resetKey: number
}

type Vec3 = [number, number, number]

interface AnatomyState {
  selected: string | null
  hovered: string | null
  select: (id: string | null) => void
  setHovered: (id: string | null) => void
}

const AnatomyContext = createContext<AnatomyState>({
  selected: null,
  hovered: null,
  select: () => {},
  setHovered: () => {},
})

function Part({ id, children }: { id: string; children: ReactNode }) {
  const { select, setHovered } = useContext(AnatomyContext)
  return (
    <group
      onClick={(event) => {
        event.stopPropagation()
        select(id)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHovered(id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(null)
        document.body.style.cursor = 'auto'
      }}
    >
      {children}
    </group>
  )
}

function Mat({
  id,
  color,
  opacity = 1,
  side,
  roughness = 0.55,
  metalness = 0.04,
  emissive,
}: {
  id: string
  color: string
  opacity?: number
  side?: THREE.Side
  roughness?: number
  metalness?: number
  emissive?: string
}) {
  const { selected, hovered } = useContext(AnatomyContext)
  const active = selected === id
  const hover = hovered === id
  return (
    <meshStandardMaterial
      color={color}
      transparent={opacity < 1}
      opacity={opacity}
      roughness={roughness}
      metalness={metalness}
      side={side}
      depthWrite={opacity >= 0.95}
      emissive={active ? '#2dd4bf' : hover ? '#1f6f66' : emissive ?? '#000000'}
      emissiveIntensity={active ? 0.75 : hover ? 0.35 : emissive ? 0.25 : 0}
    />
  )
}

function Cyl({
  a,
  b,
  radius,
  id,
  color,
  opacity = 1,
  roughness = 0.5,
}: {
  a: Vec3
  b: Vec3
  radius: number
  id: string
  color: string
  opacity?: number
  roughness?: number
}) {
  const start = new THREE.Vector3(...a)
  const end = new THREE.Vector3(...b)
  const delta = end.clone().sub(start)
  const length = Math.max(delta.length(), 0.001)
  const midpoint = start.clone().add(end).multiplyScalar(0.5)
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    delta.clone().normalize(),
  )
  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 14]} />
      <Mat id={id} color={color} opacity={opacity} roughness={roughness} />
    </mesh>
  )
}

function Tube({
  points,
  radius,
  id,
  color,
  opacity = 1,
  tubularSegments = 72,
  radialSegments = 8,
  roughness = 0.5,
}: {
  points: Vec3[]
  radius: number
  id: string
  color: string
  opacity?: number
  tubularSegments?: number
  radialSegments?: number
  roughness?: number
}) {
  const key = points.map((point) => point.join(',')).join(';')
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)))
    return new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, radius, tubularSegments, radialSegments])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry}>
      <Mat id={id} color={color} opacity={opacity} roughness={roughness} />
    </mesh>
  )
}

function Label({
  id,
  position,
  text,
  show,
}: {
  id: string
  position: Vec3
  text: string
  show: boolean
}) {
  const { select } = useContext(AnatomyContext)
  if (!show) return null
  return (
    <Html position={position} center distanceFactor={10} zIndexRange={[30, 0]}>
      <button
        type="button"
        className="label3d"
        onClick={(event) => {
          event.stopPropagation()
          select(id)
        }}
      >
        {text}
      </button>
    </Html>
  )
}

function Pinna() {
  return (
    <Part id="auricle">
      <group position={[-4.35, 0.1, 0]} rotation={[0, Math.PI / 2, 0]} scale={[1, 1.08, 1]}>
        <mesh rotation={[0, 0, 0.25]}>
          <torusGeometry args={[1.38, 0.15, 16, 72, Math.PI * 1.62]} />
          <Mat id="auricle" color="#e8b49a" roughness={0.72} />
        </mesh>
        <mesh position={[0.02, 0.02, 0.08]} rotation={[0, 0, 0.55]}>
          <torusGeometry args={[0.92, 0.1, 14, 64, Math.PI * 1.45]} />
          <Mat id="auricle" color="#dfa78c" roughness={0.75} />
        </mesh>
        <mesh position={[-0.1, -0.12, 0.18]} scale={[0.62, 0.48, 0.18]}>
          <sphereGeometry args={[1, 24, 18]} />
          <Mat id="auricle" color="#b97862" roughness={0.8} />
        </mesh>
        <mesh position={[-0.78, -0.25, 0.32]} scale={[0.22, 0.3, 0.16]}>
          <sphereGeometry args={[1, 16, 12]} />
          <Mat id="auricle" color="#e2a88d" roughness={0.75} />
        </mesh>
        <mesh position={[0.12, -1.18, 0.12]} scale={[0.4, 0.45, 0.18]}>
          <sphereGeometry args={[1, 20, 16]} />
          <Mat id="auricle" color="#d99f86" roughness={0.8} />
        </mesh>
      </group>
    </Part>
  )
}

function ExternalCanal({ overlay }: { overlay: EarOverlay }) {
  const inflamed = overlay === 'otitis-externa'
  return (
    <group>
      <Part id="external-canal">
        <mesh raycast={() => {}}>
          <tubeGeometry
            args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(-4.08, -0.05, 0.16),
                new THREE.Vector3(-3.55, 0.04, 0.1),
                new THREE.Vector3(-3.0, 0.02, 0.04),
                new THREE.Vector3(-2.45, 0, 0.01),
                new THREE.Vector3(-1.92, 0, 0),
              ]),
              48,
              0.4,
              12,
              false,
            ]}
          />
          <Mat
            id="external-canal"
            color={inflamed ? '#d96b5f' : '#e0a58c'}
            opacity={0.32}
            roughness={0.8}
          />
        </mesh>
      </Part>
      {inflamed && (
        <mesh position={[-3.0, 0.02, 0.04]} rotation={[0, 0, Math.PI / 2]} raycast={() => {}}>
          <cylinderGeometry args={[0.5, 0.5, 2.0, 24, 1, true]} />
          <meshStandardMaterial
            color="#e26055"
            transparent
            opacity={0.16}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  )
}

function TympanicMembrane({ overlay }: { overlay: EarOverlay }) {
  const inflamed = overlay === 'aom'
  return (
    <Part id="tympanic-membrane">
      <mesh position={[-1.9, 0, 0]} rotation={[0.1, Math.PI / 2, 0.1]}>
        <circleGeometry args={[0.55, 48]} />
        <Mat
          id="tympanic-membrane"
          color={inflamed ? '#e25d52' : '#f0dfc8'}
          opacity={0.97}
          side={THREE.DoubleSide}
          roughness={0.45}
          emissive={inflamed ? '#7a1f1a' : undefined}
        />
      </mesh>
      <mesh position={[-1.84, -0.05, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <Mat id="tympanic-membrane" color="#d8c3a5" roughness={0.5} />
      </mesh>
      {inflamed && (
        <>
          <mesh position={[-1.74, 0, 0]} scale={[0.16, 0.46, 0.46]}>
            <sphereGeometry args={[1, 24, 18]} />
            <meshStandardMaterial color="#f0b35e" transparent opacity={0.42} roughness={0.6} />
          </mesh>
          <mesh position={[-1.68, 0, 0]} scale={[0.3, 0.36, 0.36]}>
            <sphereGeometry args={[1, 20, 16]} />
            <meshStandardMaterial color="#c98a4a" transparent opacity={0.18} roughness={0.8} />
          </mesh>
        </>
      )}
    </Part>
  )
}

function Ossicles({ overlay }: { overlay: EarOverlay }) {
  const footplateColor = overlay === 'otosclerosis' ? '#ffffff' : '#e9dcc4'
  return (
    <group>
      <Part id="malleus">
        <Cyl a={[-1.86, -0.18, 0.02]} b={[-1.5, 0.1, 0]} radius={0.055} id="malleus" color="#efe3c8" />
        <mesh position={[-1.36, 0.24, 0]}>
          <sphereGeometry args={[0.15, 20, 16]} />
          <Mat id="malleus" color="#efe3c8" roughness={0.5} />
        </mesh>
        <mesh position={[-1.62, -0.02, 0.06]}>
          <sphereGeometry args={[0.07, 14, 12]} />
          <Mat id="malleus" color="#e8d7b6" roughness={0.5} />
        </mesh>
      </Part>

      <Part id="incus">
        <mesh position={[-1.12, 0.24, 0]}>
          <sphereGeometry args={[0.15, 20, 16]} />
          <Mat id="incus" color="#e9dcc4" roughness={0.5} />
        </mesh>
        <Cyl a={[-1.08, 0.18, 0]} b={[-0.86, 0.03, 0.01]} radius={0.045} id="incus" color="#e9dcc4" />
        <mesh position={[-0.84, 0.02, 0.01]}>
          <sphereGeometry args={[0.065, 14, 12]} />
          <Mat id="incus" color="#e9dcc4" roughness={0.5} />
        </mesh>
        <Cyl a={[-1.02, 0.28, -0.02]} b={[-0.98, 0.36, -0.18]} radius={0.04} id="incus" color="#e9dcc4" />
      </Part>

      <Part id="stapes">
        <mesh position={[-0.78, 0.03, 0.01]}>
          <sphereGeometry args={[0.06, 14, 12]} />
          <Mat id="stapes" color="#efe3c8" roughness={0.45} />
        </mesh>
        <Cyl a={[-0.75, 0.03, 0.01]} b={[-0.52, 0.13, 0.01]} radius={0.023} id="stapes" color="#efe3c8" />
        <Cyl a={[-0.75, 0.03, 0.01]} b={[-0.52, -0.06, 0.01]} radius={0.023} id="stapes" color="#efe3c8" />
        <mesh position={[-0.49, 0.035, 0.01]} scale={[0.04, 0.17, 0.1]}>
          <sphereGeometry args={[1, 18, 14]} />
          <Mat
            id="stapes"
            color={footplateColor}
            roughness={0.4}
            emissive={overlay === 'otosclerosis' ? '#8a7a55' : undefined}
          />
        </mesh>
      </Part>

      <mesh position={[-0.46, 0.035, 0.01]} rotation={[0, Math.PI / 2, 0]} raycast={() => {}}>
        <torusGeometry args={[0.18, 0.025, 10, 32]} />
        <meshStandardMaterial color="#6f5f4d" roughness={0.7} />
      </mesh>
      <mesh position={[-0.44, -0.32, 0.12]} rotation={[0, Math.PI / 2, 0]} raycast={() => {}}>
        <circleGeometry args={[0.11, 24]} />
        <meshStandardMaterial color="#4b3f34" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

      <Part id="middle-ear-cleft">
        <mesh position={[-1.25, 0.02, 0]} scale={[0.82, 0.62, 0.5]} raycast={() => {}}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial
            color={overlay === 'aom' ? '#c46a5e' : '#9fd8ff'}
            transparent
            opacity={overlay === 'aom' ? 0.12 : 0.05}
            roughness={0.9}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Part>
    </group>
  )
}

function MiddleEarExtras({ overlay }: { overlay: EarOverlay }) {
  return (
    <group>
      <Part id="eustachian-tube">
        <Tube
          points={[
            [-1.05, -0.32, 0.12],
            [-1.4, -0.68, -0.18],
            [-1.85, -1.12, -0.65],
            [-2.25, -1.52, -1.15],
          ]}
          radius={0.09}
          id="eustachian-tube"
          color="#d7b18b"
          opacity={0.9}
        />
      </Part>

      <Part id="mastoid">
        {Array.from({ length: 20 }).map((_, index) => {
          const angle = index * 2.399
          const spread = 0.18 + (index % 4) * 0.14
          return (
            <mesh
              key={index}
              position={[
                -0.98 + Math.cos(angle) * spread * 0.9,
                -0.82 + Math.sin(angle * 1.3) * spread * 0.75,
                -0.72 + Math.cos(angle * 0.7) * spread,
              ]}
            >
              <sphereGeometry args={[0.09 + (index % 3) * 0.025, 12, 10]} />
              <Mat id="mastoid" color="#e2d2b8" opacity={0.35} roughness={0.85} />
            </mesh>
          )
        })}
      </Part>

      <Part id="chorda-tympani">
        <Tube
          points={[
            [-1.76, 0.12, -0.18],
            [-1.58, 0.02, -0.12],
            [-1.34, -0.05, -0.08],
            [-1.12, 0, -0.1],
          ]}
          radius={0.018}
          id="chorda-tympani"
          color="#f2d38a"
          tubularSegments={32}
          radialSegments={6}
        />
      </Part>

      {overlay === 'cholesteatoma' && (
        <Part id="middle-ear-cleft">
          <mesh position={[-1.32, 0.36, 0.06]} scale={[0.28, 0.25, 0.22]}>
            <sphereGeometry args={[1, 24, 18]} />
            <meshStandardMaterial color="#f4ecd9" roughness={0.95} />
          </mesh>
          <mesh position={[-1.12, 0.3, 0.02]} scale={[0.16, 0.14, 0.13]}>
            <sphereGeometry args={[1, 18, 14]} />
            <meshStandardMaterial color="#e8dcc2" roughness={0.95} />
          </mesh>
        </Part>
      )}

      {overlay === 'otosclerosis' && (
        <mesh position={[-0.46, 0.035, 0.01]} rotation={[0, Math.PI / 2, 0]} raycast={() => {}}>
          <torusGeometry args={[0.21, 0.035, 10, 32]} />
          <meshStandardMaterial color="#fff7df" emissive="#8a7a55" emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
      )}
    </group>
  )
}

function Cochlea() {
  const outerPoints = useMemo<Vec3[]>(() => {
    const points: Vec3[] = []
    const steps = 190
    const turns = 2.55
    for (let index = 0; index <= steps; index += 1) {
      const progress = index / steps
      const theta = progress * turns * Math.PI * 2
      const radius = 0.72 * Math.exp(-0.18 * theta)
      points.push([1.0 + progress * 0.55, radius * Math.cos(theta), radius * Math.sin(theta)])
    }
    return points
  }, [])

  const innerPoints = useMemo<Vec3[]>(
    () =>
      outerPoints.map(([x, y, z]) => [x + 0.01, y * 0.9, z * 0.9] as Vec3),
    [outerPoints],
  )

  return (
    <Part id="cochlea">
      <Tube points={outerPoints} radius={0.075} id="cochlea" color="#e8dcc8" opacity={0.55} tubularSegments={190} />
      <Tube
        points={innerPoints}
        radius={0.028}
        id="membranous-labyrinth"
        color="#2dd4bf"
        opacity={0.95}
        tubularSegments={190}
        radialSegments={6}
      />
      <mesh position={[1.28, 0, 0]} rotation={[0, 0, -Math.PI / 2]} raycast={() => {}}>
        <coneGeometry args={[0.17, 0.8, 20]} />
        <meshStandardMaterial color="#c9b79b" roughness={0.7} />
      </mesh>
      <mesh position={[1.28, 0.02, 0]} scale={[0.1, 0.1, 0.1]} raycast={() => {}}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color="#b8a487" roughness={0.8} />
      </mesh>
    </Part>
  )
}

function VestibularSystem() {
  return (
    <group>
      <Part id="vestibule">
        <mesh position={[1.15, 0.55, 0]}>
          <sphereGeometry args={[0.38, 28, 20]} />
          <Mat id="vestibule" color="#e8dcc8" opacity={0.42} roughness={0.6} />
        </mesh>
      </Part>

      <Part id="semicircular-canals">
        <mesh position={[1.15, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.62, 0.055, 12, 64, Math.PI * 1.35]} />
          <Mat id="semicircular-canals" color="#e8dcc8" opacity={0.72} roughness={0.55} />
        </mesh>
        <mesh position={[1.15, 0.62, 0]} rotation={[0, Math.PI / 2, 0.4]}>
          <torusGeometry args={[0.62, 0.055, 12, 64, Math.PI * 1.35]} />
          <Mat id="semicircular-canals" color="#e8dcc8" opacity={0.72} roughness={0.55} />
        </mesh>
        <mesh position={[1.15, 0.62, 0]} rotation={[0.5, 0.9, 0.2]}>
          <torusGeometry args={[0.62, 0.055, 12, 64, Math.PI * 1.35]} />
          <Mat id="semicircular-canals" color="#e8dcc8" opacity={0.72} roughness={0.55} />
        </mesh>
      </Part>

      <Part id="membranous-labyrinth">
        <mesh position={[1.15, 0.55, 0]} scale={[0.72, 0.72, 0.72]}>
          <sphereGeometry args={[0.36, 24, 18]} />
          <Mat id="membranous-labyrinth" color="#2dd4bf" opacity={0.32} roughness={0.4} />
        </mesh>
      </Part>

      <Part id="bony-labyrinth">
        <mesh position={[1.15, 0.55, 0]} scale={[0.98, 0.98, 0.98]} raycast={() => {}}>
          <sphereGeometry args={[0.41, 24, 18]} />
          <Mat id="bony-labyrinth" color="#d8c9b0" opacity={0.12} roughness={0.7} />
        </mesh>
      </Part>
    </group>
  )
}

function Nerves({ overlay }: { overlay: EarOverlay }) {
  return (
    <group>
      <Part id="facial-nerve">
        <Tube
          points={[
            [-0.55, 0.35, -0.12],
            [-0.2, 0.3, -0.18],
            [0.15, 0.1, -0.2],
            [0.35, -0.4, -0.25],
            [0.4, -0.95, -0.3],
          ]}
          radius={0.045}
          id="facial-nerve"
          color="#f6c453"
        />
      </Part>

      <Part id="auditory-nerve">
        <Tube
          points={[
            [1.5, 0.15, 0],
            [2.2, 0.12, -0.05],
            [2.9, 0.1, -0.1],
            [3.5, 0.08, -0.15],
          ]}
          radius={0.07}
          id="auditory-nerve"
          color="#f2d38a"
        />
      </Part>

      <Part id="internal-auditory-canal">
        <mesh position={[3.15, 0.1, -0.12]} rotation={[0, 0, Math.PI / 2]} raycast={() => {}}>
          <cylinderGeometry args={[0.28, 0.34, 1.0, 24, 1, true]} />
          <meshStandardMaterial
            color="#d8c9b0"
            transparent
            opacity={0.28}
            side={THREE.DoubleSide}
            depthWrite={false}
            roughness={0.8}
          />
        </mesh>
      </Part>

      {overlay === 'schwannoma' && (
        <Part id="internal-auditory-canal">
          <mesh position={[2.98, 0.1, -0.1]}>
            <sphereGeometry args={[0.3, 24, 18]} />
            <meshStandardMaterial color="#e8a0a8" roughness={0.65} />
          </mesh>
          <mesh position={[2.98, 0.1, -0.1]} scale={[1.12, 1.12, 1.12]}>
            <sphereGeometry args={[0.3, 18, 14]} />
            <meshStandardMaterial color="#f4c2c8" transparent opacity={0.18} roughness={0.7} />
          </mesh>
        </Part>
      )}
    </group>
  )
}

function SoundPulse({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.3, 0.05, 0.2),
        new THREE.Vector3(-3.4, 0.04, 0.12),
        new THREE.Vector3(-2.6, 0.02, 0.05),
        new THREE.Vector3(-1.9, 0, 0),
        new THREE.Vector3(-1.35, 0.08, 0),
        new THREE.Vector3(-0.8, 0.03, 0.01),
        new THREE.Vector3(-0.45, 0.03, 0.01),
        new THREE.Vector3(0.1, 0.1, 0),
        new THREE.Vector3(0.9, 0.2, 0),
        new THREE.Vector3(1.35, 0.3, 0),
      ]),
    [],
  )

  useFrame((state) => {
    if (!ref.current) return
    if (!active) {
      ref.current.visible = false
      return
    }
    ref.current.visible = true
    const progress = (state.clock.elapsedTime % 2.6) / 2.6
    ref.current.position.copy(curve.getPointAt(progress))
    const scale = 0.07 + Math.sin(progress * Math.PI) * 0.05
    ref.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color="#5eead4" transparent opacity={0.85} />
    </mesh>
  )
}

function SceneContent({
  layers,
  overlay,
  labels,
  pulse,
  selected,
}: {
  layers: EarLayers
  overlay: EarOverlay
  labels: boolean
  pulse: boolean
  selected: string | null
}) {
  const showLabel = (id: string) => labels || selected === id
  return (
    <group rotation={[0, -0.5, 0]}>
      {layers.outer && (
        <>
          <Pinna />
          <ExternalCanal overlay={overlay} />
          <TympanicMembrane overlay={overlay} />
        </>
      )}

      {layers.middle && (
        <>
          <Ossicles overlay={overlay} />
          <MiddleEarExtras overlay={overlay} />
        </>
      )}

      {layers.inner && (
        <>
          <Cochlea />
          <VestibularSystem />
        </>
      )}

      {layers.nerves && <Nerves overlay={overlay} />}

      <SoundPulse active={pulse} />

      <Label id="auricle" position={[-4.5, 1.55, 0.2]} text="Auricle" show={showLabel('auricle')} />
      <Label
        id="external-canal"
        position={[-3.0, 0.78, 0.2]}
        text="External canal"
        show={showLabel('external-canal')}
      />
      <Label
        id="tympanic-membrane"
        position={[-1.9, 0.72, 0.1]}
        text="Tympanic membrane"
        show={showLabel('tympanic-membrane')}
      />
      <Label id="malleus" position={[-1.38, 0.52, 0.1]} text="Malleus" show={showLabel('malleus')} />
      <Label id="incus" position={[-1.02, 0.55, -0.2]} text="Incus" show={showLabel('incus')} />
      <Label id="stapes" position={[-0.6, 0.3, 0.2]} text="Stapes" show={showLabel('stapes')} />
      <Label id="cochlea" position={[1.3, 0.98, 0.2]} text="Cochlea" show={showLabel('cochlea')} />
      <Label id="vestibule" position={[1.15, 1.15, 0]} text="Vestibule" show={showLabel('vestibule')} />
      <Label
        id="semicircular-canals"
        position={[1.4, 1.65, 0]}
        text="Semicircular canals"
        show={showLabel('semicircular-canals')}
      />
      <Label
        id="eustachian-tube"
        position={[-2.15, -1.5, -0.9]}
        text="Eustachian tube"
        show={showLabel('eustachian-tube')}
      />
      <Label id="mastoid" position={[-0.9, -1.35, -0.8]} text="Mastoid cells" show={showLabel('mastoid')} />
      <Label
        id="internal-auditory-canal"
        position={[3.35, 0.62, -0.2]}
        text="Internal auditory canal"
        show={showLabel('internal-auditory-canal')}
      />
      <Label id="facial-nerve" position={[0.15, -0.7, -0.45]} text="Facial nerve" show={showLabel('facial-nerve')} />
      <Label id="auditory-nerve" position={[2.6, 0.55, -0.15]} text="CN VIII" show={showLabel('auditory-nerve')} />
      <Label
        id="chorda-tympani"
        position={[-1.35, -0.45, -0.2]}
        text="Chorda tympani"
        show={showLabel('chorda-tympani')}
      />
      <Label
        id="middle-ear-cleft"
        position={[-1.15, 0.92, 0.1]}
        text="Middle ear"
        show={showLabel('middle-ear-cleft')}
      />
      <Label
        id="membranous-labyrinth"
        position={[1.65, 0.35, 0.2]}
        text="Membranous labyrinth"
        show={showLabel('membranous-labyrinth')}
      />
    </group>
  )
}

export default function EarScene({
  selected,
  onSelect,
  layers,
  overlay,
  labels,
  pulse,
  resetKey,
}: EarSceneProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <AnatomyContext.Provider value={{ selected, hovered, select: onSelect, setHovered }}>
      <Canvas
        key={resetKey}
        camera={{ position: [2.6, 3.2, 11], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => onSelect(null)}
      >
        <ambientLight intensity={0.75} />
        <hemisphereLight args={['#d8efff', '#1a2230', 0.55]} />
        <directionalLight position={[6, 8, 9]} intensity={1.55} />
        <directionalLight position={[-8, 2, -6]} intensity={0.7} />
        <pointLight position={[0, -4, 6]} intensity={0.45} />

        <SceneContent
          layers={layers}
          overlay={overlay}
          labels={labels}
          pulse={pulse}
          selected={selected}
        />

        <OrbitControls
          makeDefault
          target={[-0.8, 0, 0]}
          enableDamping
          dampingFactor={0.08}
          minDistance={5}
          maxDistance={22}
          minPolarAngle={0.35}
          maxPolarAngle={2.65}
        />
      </Canvas>
    </AnatomyContext.Provider>
  )
}
