let container;
let camera;
let cameraTwo
let controls;
let renderer;
let scene;

function init() {

  // Get a reference to the container element that will hold our scene
  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();

  createCamera();
  createControls();
  createLights();
  loadModels();
  createWater();
  backgroundPlane();
  createRenderer();

  // Start the animation loop
  renderer.setAnimationLoop( () => {
    update();
    render();
  });

}

function createCamera() {

  aspectRatio = container.clientHeight / container.clientWidth
  camera = new THREE.PerspectiveCamera(
    32, // FOV
    container.clientWidth / container.clientHeight, // aspect
    1, // near clipping plane
    100, // far clipping plane
  );

  camera.position.set( -2.1, 1, 0 );
  camera.lookAt( 100, 0, 0 );

  // Visualize the main camera
  //const helper = new THREE.CameraHelper( camera );
  //scene.add( camera, helper );

  // Create a second camera
  cameraTwo = new THREE.PerspectiveCamera(
    50, // FOV
    container.clientWidth / container.clientHeight, // aspect
    0.1, // near clipping plane
    1100, // far clipping plane
  );
  cameraTwo.position.set( -2, 1, 0 );

}

function createControls() {

  controls = new THREE.OrbitControls( cameraTwo, container );

}

function createLights() {

  const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.2 );

  const mainLight = new THREE.PointLight( 0xffffff, 5 );
  mainLight.position.set( -3, 1, 0 );
  mainLight.castShadow = true;

  // Remember to add the light to the scene
  scene.add( ambientLight, mainLight );

}

function loadModels() {

  const loader = new THREE.GLTFLoader();

  const url = '/models/canoe_scene.glb';

  // Here, 'gltf' is the object that the loader returns to us
  const onLoad = ( gltf ) => {

    console.log ( gltf );

    const model = gltf.scene;
    model.castShadow = true;
		model.receiveShadow = true;
    //model.position.copy( position );
    //model1.scale.set( 0.0001, 0.0001, 0.0001 );

    scene.add( model );

  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to the console
  const onError = ( errorMessage ) => { console.log( errorMessage ); };

  // load the first model
  //const parrotPosition = new THREE.Vector3( 0, 0, 2.5 );
  //loader.load( 'models/Parrot.glb', gltf => onLoad( gltf, parrotPosition ), onProgress, onError );

  loader.load( url, onLoad );

}

function createWater() {

  // Water plane
  const waterGeometry = new THREE.PlaneBufferGeometry( 40, 80 );

  water = new THREE.Water( waterGeometry, {
    color: 0x6C809E,
    scale: 1,
    flowDirection: new THREE.Vector2( 0.05, 0.05 ),
    textureWidth: 1024,
    textureHeight: 1024
  } );

  water.position.x = 20;
  water.rotation.x = Math.PI * - 0.5;
  water.receiveShadow = true;

  // Ground plane underneath water plane
  const groundGeometry = new THREE.PlaneBufferGeometry( 40, 80 );
	const groundMaterial = new THREE.MeshStandardMaterial( { color: 0x000000, roughness: 0.8, metalness: 0.4 } );
	const ground = new THREE.Mesh( groundGeometry, groundMaterial );

  ground.position.x = 20;
  ground.position.y = -0.2;
	ground.rotation.x = Math.PI * - 0.5;

  scene.add( water, ground );

}

function backgroundPlane() {

  const planeGeometry = new THREE.PlaneBufferGeometry( 102*1.02, 77*1.02, 1, 1 );

  const texture = new THREE.TextureLoader().load( 'textures/background/lake_forest_sunset.jpg' );
  texture.encoding = THREE.sRGBEncoding;

  const planeMaterial = new THREE.MeshBasicMaterial( { map: texture } );

  const plane = new THREE.Mesh( planeGeometry, planeMaterial );

  plane.rotation.y = Math.PI / -2;
  plane.position.x = 80;
  plane.position.y = 27;

  scene.add( plane );

}

function createRenderer() {

  // Create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize(container.clientWidth, container.clientHeight);

  // Set correct pixel ratio for mobile devices
  renderer.setPixelRatio( window.devicePixelRatio );

  // Set the gamma correction so that output colors look correct on our screens
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;

  // Add the automatically created <canvas> element to the page
  container.appendChild( renderer.domElement );

}

// Perform any updates to the scene, called once per frame
// avoid heavy computation here
function update() {

  window.onmousemove = function(e) {

    camera.position.y = 1 + (window.innerHeight / 2 - e.clientY) / 7000;
    camera.position.z = (window.innerWidth / 2 - e.clientX) / 4000;

  };

}

// Render, or 'create a still image', of the scene
function render () {

  renderer.render( scene, camera );

}

// A function that will be called every time the window gets resized
// It can get called a lot, so don't put any heavy computation in here!
function onWindowResize() {

  console.log( 'You resized the browser window!' );

  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // Update the camera's frustrum
  camera.updateProjectionMatrix();

  // Update the size of the renderer AND the canvas
  renderer.setSize(container.clientWidth, container.clientHeight);

}

window.addEventListener( 'resize', onWindowResize );

// Call the init function to set everything up
init();
