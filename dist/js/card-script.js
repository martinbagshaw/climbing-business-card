// JavaScript Document

// set variables
var scene, camera, renderer, geometry, material, mesh, controls, hemiLight, animate;
var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;
// mobile conditional - loads smaller sized mesh
var isMobile = {
	Android: function() { return navigator.userAgent.match(/Android/i); },
	BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); },
	iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
	Opera: function() { return navigator.userAgent.match(/Opera Mini/i); },
	Windows: function() { return navigator.userAgent.match(/IEMobile/i); },
	any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};
// instructions text
var instructions = document.getElementById('demo').getElementsByTagName('p')[0];
if (isMobile.any()) {
	instructions.innerHTML = 'Drag one finger to rotate, spread and contract two fingers to zoom in and out';
} else {
	instructions.innerHTML = 'Rotate by clicking and dragging. Zoom with the mousewheel or two fingers on the trackpad';
}
// animation buttons
var frontButton = document.getElementById('button_front');
var rearButton = document.getElementById('button_rear');
// functions for animation buttons
// a) hasclass
function hasClass(el, selector) {
var className = " " + selector + " ";
if ((" " + el.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1) {
	return true;
}
	return false;
}
// b) addclass
function addClass(el, className) {
  if (el.classList)
	el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}
// c) removeclass
function removeClass(el, className) {
  if (el.classList)
	el.classList.remove(className)
  else if (hasClass(el, className)) {
	var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
	el.className=el.className.replace(reg, ' ')
  }
}


// initiate and render
init(); // ERROR HERE - chrome
render();

function init() {
	scene = new THREE.Scene();
    initMesh();
    initCamera();
    initLights();
	initControls();
    initRenderer(); // ERROR HERE - chrome
    document.body.appendChild(renderer.domElement);	// where the scene is placed
	// event listeners
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'orientationchange', onWindowOrientationChange, false ); // render on device re-orientation
	controls.addEventListener( 'change', onMeshManipulation, false );
}







// - - - - - - - - - -
// initiate functions
// 1. mesh
function initMesh() {
    var loader = new THREE.JSONLoader();
	loader.load("js/card-model.js", modelLoadedCallback);	
} // end initMesh

// 2. camera
function initCamera() {
    camera = new THREE.PerspectiveCamera( 90, WIDTH / HEIGHT, 0.01, 1000 );
    camera.position.set(0, 0.2, 5);
	scene.add(camera);
}
// 3. lights
function initLights() {
	// ambient light
	scene.add(new THREE.AmbientLight(0xc0c0c0, 0.65));
	// hemisphere light
	hemiLight = new THREE.HemisphereLight( 0xfffddb, 0x000000, 0.5 );
	hemiLight.position.set(0, 10, 20).normalize();
	hemiLight.castShadow = true;
	scene.add(hemiLight);
	// spotlight
	var spotLight = new THREE.SpotLight(0xffffff, 0.5);
  	spotLight.position.set(5, 10, -20);
	spotLight.rotation.x = Math.PI / 2;
  	scene.add(spotLight);
}
// 4. controls
function initControls() {
	controls = new THREE.OrbitControls(camera);
	controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
	controls.maxDistance = 10;
	controls.minDistance = 1;
	controls.enablePan = false;
}
// 5. render
function initRenderer() {
	renderer = new THREE.WebGLRenderer({ antialias: true }); // ERROR HERE - chrome
    renderer.setSize(WIDTH, HEIGHT);
}

// - - - - - - - - - -
// callback functions
function modelLoadedCallback(geometry) {

	// allows shadows
	material = new THREE.MeshLambertMaterial({
		color: 0xfffff2,
		shading: THREE.FlatShading
	});
	mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add(mesh);

	// animation buttons
	// 1) Rear Button
	rearButton.onclick = function() {
		// a) from and to positions
		var from = camera.position;
		var to = new THREE.Vector3(0, 0.2, -5);
		// b) tween function
		var tween = new TWEEN.Tween(from)
		.to(to, 750)
		.easing(TWEEN.Easing.Linear.None)
		.onUpdate(function () {
			camera.position.set(this.x, this.y, this.z);
			camera.lookAt(new THREE.Vector3(0, 0, 0)); // make sure camera looks at center, controls don't need updating
			//controls.target.copy(mesh.position);
		})
		.start();
		removeClass(this, 'unclicked');
		addClass(frontButton, 'unclicked');
	} // end rearButton.onclick

	// 2) Front Button
	frontButton.onclick = function() {
		// a) from and to positions
		var from = camera.position;
		var to = new THREE.Vector3(0, 0.2, 5);
		// b) tween function
		var tween = new TWEEN.Tween(from)
		.to(to, 750)
		.easing(TWEEN.Easing.Linear.None)
		.onUpdate(function () {
			camera.position.set(this.x, this.y, this.z);
			camera.lookAt(new THREE.Vector3(0, 0, 0));
		})
		.start();
		// remove clicked class and add to other button
		removeClass(this, 'unclicked');
		addClass(rearButton, 'unclicked');
	} // end frontButton.onclick
} // end modelLoadedCallback

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	render();
}

function onWindowOrientationChange() {
	renderer.setSize( window.innerWidth, window.innerHeight );
	render();
}

function onMeshManipulation() {
	addClass(rearButton, 'unclicked');
	addClass(frontButton, 'unclicked');
}

function animate() {
	requestAnimationFrame(animate);
	TWEEN.update();
    renderer.render(scene, camera);
    controls.update();
}

function render() {
	requestAnimationFrame(render);
	TWEEN.update();
    renderer.render(scene, camera);
}
