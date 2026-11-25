import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export interface EyeLayers {
  globe: boolean
  anterior: boolean
  retina: boolean
  muscles: boolean
}

export interface EyeSceneProps {
  selected: string | null
  onSelect: (id: string | null) => void
  layers: EyeLayers
  cataract: number
  pupil: number
  labels: boolean
  cutaway: boolean
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
  metalness = 0.02,
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
      emissiveIntensity={active ? 0.75 : hover ? 0.35 : emissive ? 0.2 : 0}
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
  tubularSegments = 48,
  radialSegments = 8,
  roughness = 0.55,
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
    <Html position={position} center distanceFactor={7} zIndexRange={[30, 0]}>
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

function Globe({ cutaway }: { cutaway: boolean }) {
  return (
    <group>
      <Part id="sclera">
        <mesh raycast={() => {}}>
          <sphereGeometry args={[1.3, 64, 48]} />
          <Mat
            id="sclera"
            color="#eef3f9"
            opacity={cutaway ? 0.07 : 0.24}
            roughness={0.32}
            metalness={0.02}
          />
        </mesh>
      </Part>
    </group>
  )
}

function AnteriorSegment({ cataract, pupil }: { cataract: number; pupil: number }) {
  const severity = Math.min(100, Math.max(0, cataract)) / 100
  const lensColor = severity > 0.55 ? '#d8b56a' : severity > 0.25 ? '#e5d3a4' : '#dff2ff'
  const lensOpacity = 0.3 + severity * 0.62
  const lensRoughness = 0.06 + severity * 0.58

  return (
    <group>
      <Part id="cornea">
        <mesh position={[0, 0, 0.559]} rotation={[Math.PI / 2, 0, 0]} raycast={() => {}}>
          <sphereGeometry args={[0.76, 48, 24, 0, Math.PI * 2, 0, 0.952]} />
          <meshPhysicalMaterial
            color="#dff6ff"
            transparent
            opacity={0.16}
            roughness={0.05}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0, 0.998]} rotation={[0, 0, 0]} raycast={() => {}}>
          <torusGeometry args={[0.62, 0.012, 8, 64]} />
          <meshStandardMaterial color="#b9d8e8" transparent opacity={0.4} roughness={0.4} />
        </mesh>
      </Part>

      <Part id="anterior-chamber">
        <mesh position={[0, 0, 0.8]} raycast={() => {}}>
          <cylinderGeometry args={[0.62, 0.62, 0.3, 48, 1, true]} />
          <meshStandardMaterial
            color="#9fd8ff"
            transparent
            opacity={0.035}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </Part>

      <Part id="iris-pupil">
        <mesh position={[0, 0, 0.93]}>
          <circleGeometry args={[0.56, 64]} />
          <meshStandardMaterial
            color="#6f8fd8"
            roughness={0.62}
            emissive="#1d2c4d"
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh position={[0, 0, 0.935]} scale={[pupil, pupil, 1]}>
          <circleGeometry args={[0.2, 48]} />
          <meshBasicMaterial color="#05070a" />
        </mesh>
        <mesh position={[0, 0, 0.936]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.56, 0.012, 8, 64]} />
          <meshStandardMaterial color="#3f5a8a" roughness={0.6} />
        </mesh>
      </Part>

      <Part id="lens">
        <mesh position={[0, 0, 0.58]} scale={[0.43, 0.43, 0.17]}>
          <sphereGeometry args={[1, 48, 32]} />
          <meshPhysicalMaterial
            color={lensColor}
            transparent
            opacity={lensOpacity}
            roughness={lensRoughness}
            metalness={0}
            clearcoat={0.6}
            clearcoatRoughness={0.1}
            depthWrite={lensOpacity >= 0.95}
          />
        </mesh>
        <mesh position={[0, 0, 0.58]} scale={[0.26, 0.26, 0.1]} raycast={() => {}}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial
            color={severity > 0.4 ? '#c69a4e' : '#f0e2c0'}
            transparent
            opacity={0.2 + severity * 0.45}
            roughness={0.5}
          />
        </mesh>
      </Part>

      <Part id="ciliary-body">
        <mesh position={[0, 0, 0.63]}>
          <torusGeometry args={[0.6, 0.06, 12, 64]} />
          <Mat id="ciliary-body" color="#c98b6b" roughness={0.65} />
        </mesh>
        {Array.from({ length: 14 }).map((_, index) => {
          const angle = (index / 14) * Math.PI * 2
          const inner = 0.43
          const outer = 0.61
          return (
            <Cyl
              key={index}
              a={[Math.cos(angle) * outer, Math.sin(angle) * outer, 0.62]}
              b={[Math.cos(angle) * inner, Math.sin(angle) * inner, 0.6]}
              radius={0.006}
              id="ciliary-body"
              color="#d8b49a"
              opacity={0.65}
            />
          )
        })}
      </Part>
    </group>
  )
}

function PosteriorSegment() {
  return (
    <group>
      <Part id="retina">
        <mesh raycast={() => {}}>
          <sphereGeometry args={[1.18, 64, 48]} />
          <Mat
            id="retina"
            color="#b5483f"
            side={THREE.BackSide}
            roughness={0.85}
            emissive="#3a0f0c"
          />
        </mesh>
        <mesh position={[0.22, 0, -1.175]}>
          <circleGeometry args={[0.13, 32]} />
          <meshStandardMaterial color="#f0c674" roughness={0.8} />
        </mesh>
        <mesh position={[-0.18, 0, -1.178]}>
          <circleGeometry args={[0.1, 32]} />
          <meshStandardMaterial color="#7a2e2a" roughness={0.9} />
        </mesh>
        <mesh position={[-0.18, 0, -1.179]}>
          <circleGeometry args={[0.032, 24]} />
          <meshStandardMaterial color="#3d1412" roughness={0.9} />
        </mesh>
      </Part>

      <Part id="vitreous">
        <mesh raycast={() => {}}>
          <sphereGeometry args={[1.03, 48, 32]} />
          <Mat id="vitreous" color="#bfe6ff" opacity={0.05} roughness={0.1} />
        </mesh>
      </Part>

      <Part id="optic-nerve">
        <Cyl
          a={[0, 0, -1.2]}
          b={[0, 0, -2.75]}
          radius={0.21}
          id="optic-nerve"
          color="#e8d8b8"
          roughness={0.6}
        />
        <Cyl
          a={[0, 0, -1.25]}
          b={[0, 0, -2.75]}
          radius={0.28}
          id="optic-nerve"
          color="#d8c9b0"
          opacity={0.16}
          roughness={0.8}
        />
        <Cyl
          a={[-0.05, 0.04, -1.3]}
          b={[-0.05, 0.04, -2.6]}
          radius={0.018}
          id="optic-nerve"
          color="#c94f4f"
          opacity={0.8}
        />
        <Cyl
          a={[0.05, -0.04, -1.3]}
          b={[0.05, -0.04, -2.6]}
          radius={0.018}
          id="optic-nerve"
          color="#4f7fc9"
          opacity={0.8}
        />
      </Part>

    </group>
  )
}

function ExtraocularMuscles() {
  return (
    <group>
      <Part id="extraocular-muscles">
        <Tube
          points={[
            [0, 0.22, -2.25],
            [0, 0.72, -1.4],
            [0, 1.05, 0.1],
            [0, 1.02, 0.5],
          ]}
          radius={0.075}
          id="extraocular-muscles"
          color="#a34a4a"
          opacity={0.82}
        />
        <Tube
          points={[
            [0, -0.22, -2.25],
            [0, -0.72, -1.4],
            [0, -1.05, 0.1],
            [0, -1.02, 0.5],
          ]}
          radius={0.075}
          id="extraocular-muscles"
          color="#a34a4a"
          opacity={0.82}
        />
        <Tube
          points={[
            [-0.22, 0, -2.25],
            [-0.72, 0, -1.4],
            [-1.05, 0, 0.1],
            [-1.02, 0, 0.5],
          ]}
          radius={0.075}
          id="extraocular-muscles"
          color="#a34a4a"
          opacity={0.82}
        />
        <Tube
          points={[
            [0.22, 0, -2.25],
            [0.72, 0, -1.4],
            [1.05, 0, 0.1],
            [1.02, 0, 0.5],
          ]}
          radius={0.075}
          id="extraocular-muscles"
          color="#a34a4a"
          opacity={0.82}
        />
        <Tube
          points={[
            [-0.05, 0.25, -2.2],
            [-0.2, 0.9, -0.4],
            [-0.35, 1.25, 0.45],
          ]}
          radius={0.055}
          id="extraocular-muscles"
          color="#b25a5a"
          opacity={0.82}
        />
        <Tube
          points={[
            [-0.35, 1.25, 0.45],
            [0, 1.15, 0.2],
            [0.45, 0.9, -0.25],
          ]}
          radius={0.05}
          id="extraocular-muscles"
          color="#b25a5a"
          opacity={0.82}
        />
        <Tube
          points={[
            [-0.45, -0.9, -0.9],
            [-0.2, -1.0, -0.2],
            [0.3, -0.8, 0.2],
            [0.65, -0.55, 0.35],
          ]}
          radius={0.05}
          id="extraocular-muscles"
          color="#b25a5a"
          opacity={0.82}
        />
      </Part>
    </group>
  )
}

function LightBeam() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const material = ref.current.material as THREE.MeshBasicMaterial
    material.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03
  })
  return (
    <mesh ref={ref} position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]} raycast={() => {}}>
      <cylinderGeometry args={[0.012, 0.06, 3.4, 12, 1, true]} />
      <meshBasicMaterial color="#5eead4" transparent opacity={0.1} depthWrite={false} />
    </mesh>
  )
}

function SceneContent({
  layers,
  cataract,
  pupil,
  labels,
  cutaway,
  selected,
}: {
  layers: EyeLayers
  cataract: number
  pupil: number
  labels: boolean
  cutaway: boolean
  selected: string | null
}) {
  const showLabel = (id: string) => labels || selected === id
  return (
    <group>
      {layers.globe && <Globe cutaway={cutaway} />}
      {layers.anterior && <AnteriorSegment cataract={cataract} pupil={pupil} />}
      {layers.retina && <PosteriorSegment />}
      {layers.muscles && <ExtraocularMuscles />}
      <LightBeam />

      <Label id="cornea" position={[0.1, 1.42, 0.7]} text="Cornea" show={showLabel('cornea')} />
      <Label id="anterior-chamber" position={[-0.9, 0.55, 1.0]} text="Anterior chamber" show={showLabel('anterior-chamber')} />
      <Label id="iris-pupil" position={[0.8, 0.7, 0.95]} text="Iris & pupil" show={showLabel('iris-pupil')} />
      <Label id="lens" position={[0.2, -0.7, 0.65]} text="Lens" show={showLabel('lens')} />
      <Label id="ciliary-body" position={[0.95, -0.55, 0.45]} text="Ciliary body" show={showLabel('ciliary-body')} />
      <Label id="sclera" position={[1.45, 0.75, 0.1]} text="Sclera" show={showLabel('sclera')} />
      <Label id="retina" position={[0.75, 0.95, -0.85]} text="Retina" show={showLabel('retina')} />
      <Label id="vitreous" position={[-0.75, -0.35, 0.2]} text="Vitreous" show={showLabel('vitreous')} />
      <Label id="optic-nerve" position={[0.55, -0.35, -2.2]} text="Optic nerve" show={showLabel('optic-nerve')} />
      <Label id="extraocular-muscles" position={[1.35, 0.05, 0.2]} text="Rectus muscles" show={showLabel('extraocular-muscles')} />
    </group>
  )
}

export default function EyeScene({
  selected,
  onSelect,
  layers,
  cataract,
  pupil,
  labels,
  cutaway,
  resetKey,
}: EyeSceneProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <AnatomyContext.Provider value={{ selected, hovered, select: onSelect, setHovered }}>
      <Canvas
        key={resetKey}
        camera={{ position: [0, 1.6, 6.4], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => onSelect(null)}
      >
        <ambientLight intensity={0.8} />
        <hemisphereLight args={['#e8f4ff', '#1a2230', 0.5]} />
        <directionalLight position={[5, 7, 8]} intensity={1.5} />
        <directionalLight position={[-7, 2, -5]} intensity={0.65} />
        <pointLight position={[0, -3, 5]} intensity={0.4} />

        <SceneContent
          layers={layers}
          cataract={cataract}
          pupil={pupil}
          labels={labels}
          cutaway={cutaway}
          selected={selected}
        />

        <OrbitControls
          makeDefault
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.08}
          minDistance={3.4}
          maxDistance={12}
          minPolarAngle={0.4}
          maxPolarAngle={2.6}
        />
      </Canvas>
    </AnatomyContext.Provider>
  )
}
