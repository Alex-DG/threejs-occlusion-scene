import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const loader = new GLTFLoader()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
)
const p = 35
camera.position.x = p
camera.position.y = p
camera.position.z = p

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Objects
 */
const material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide })

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// { Plane } : background visible plane
const planeGeometry = new THREE.PlaneGeometry(10, 10, 4, 4)
const planeMesh = new THREE.Mesh(planeGeometry, material.clone())

planeMesh.material.color.set(0xff0000)

planeMesh.renderOrder = 0

planeMesh.position.z = -20
scene.add(planeMesh)

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// { Occlusion } : invisible plane
const invisibleGeometry = new THREE.PlaneGeometry(15, 52, 4, 4)
const invisibleMesh = new THREE.Mesh(invisibleGeometry, material.clone())

invisibleMesh.material.color.set(0x0000ff)
invisibleMesh.material.colorWrite = false

invisibleMesh.renderOrder = 1

invisibleMesh.position.z = 25
invisibleMesh.position.y = 20
invisibleMesh.rotation.y = -Math.PI / 10

scene.add(invisibleMesh)

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// { Icosphere }
const icoGeometry = new THREE.IcosahedronGeometry(15, 1)
const icoMesh = new THREE.Mesh(icoGeometry, material.clone())
icoMesh.material.color.set(0x606060)
icoMesh.renderOrder = 2
icoMesh.position.z = 0
scene.add(icoMesh)

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// GLB Model
const group = new THREE.Group()

loader.load('/model/cyber2.glb', (gltf) => {
  gltf.scene.rotation.y = (Math.PI / 2) * 2
  gltf.scene.position.z = 50
  gltf.scene.position.y = -10
  group.add(gltf.scene)
  scene.add(group)
})

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.AmbientLight(0xffffff, 1.5)
directionalLight.position.copy(camera.position)
scene.add(directionalLight)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - lastElapsedTime
  lastElapsedTime = elapsedTime

  // Update controls
  //   controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
