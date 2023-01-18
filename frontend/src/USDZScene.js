import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { USDZLoader } from 'three-usdz-loader';


/**
 * THREE Scene loading USDz assets.
 * 
 * @todo Convert this to TypeScript, to facilitate collaboration.
 */
export class USDZScene {

    /**
     * DOM container of the THREE scene.
     * 
     * @type {HTMLDivElement}
     */
    #sceneContainer;

    /**
     * THREE scene renderer.
     * 
     * @type {THREE.WebGLRenderer}
     */
    #renderer;

    /**
     * THREE scene.
     * 
     * @type {THREE.Scene}
     */
    #scene;

    /**
     * THREE scene camera.
     * 
     * @type {THREE.PerspectiveCamera}
     */
    #camera;

    /**
     * THREE scene controls.
     * 
     * @type {OrbitControls}
     */
    #controls;

    /**
     * Loaded USDz model.
     * 
     @type {USDZInstance}
     */
    #loadedModel;

    
    /**
     * Key of the `data-*` attribute holding the path of the USDz file to load.
     */
    #USDZ_SRC_DATA_ATTRIBUTE = 'data-usdz-src';

    /**
     * Key of the `data-*` attribute holding the path of the environment map file to load.
     */
    #ENVIRONMENT_MAP_SRC_DATA_ATTRIBUTE = 'data-envmap-src';

    
    /**
     * Constructor.
     * 
     * @param {HTMLDivElement} sceneContainer DOM container of the THREE scene.
     */
    constructor(sceneContainer) {
        this.#sceneContainer = sceneContainer;
    }

    /**
     * Load the USDz scene.
     *
     * @returns {Promise<void>} A Promise to be fulfilled once the USDz scene has been built.
     */
    async load() {
        this.#scene = await this.#buildTHREEScene();
    }

    /**
     * Return the size of the THREE Scene.
     * 
     * @returns {Array<number>} The width and height of the THREE Scene.
     */
    #getSceneSize() {
        const ASPECT_RATIO = 9.0 / 16.0;
        const innerWidth = this.#sceneContainer.offsetWidth || 800;
        const innerHeight = Math.ceil(innerWidth * ASPECT_RATIO);

        return [innerWidth, innerHeight];
    }

    /**
     * Build the THREE Scene.
     * 
     * @returns {Promise<THREE.Scene>} A Promise to be fulfilled once the THREE Scene has been built.
     */
    async #buildTHREEScene() {
        const [innerWidth, innerHeight] = this.#getSceneSize();

        // Setup scene:
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        // Setup light:
        const ambientLight = new THREE.AmbientLight(0x111111, 0.01);
        scene.add(ambientLight);

        this.#camera = new THREE.PerspectiveCamera(27, innerWidth / innerHeight, 0.1, 1000 );

        this.#renderer = new THREE.WebGLRenderer();
        this.#renderer.setPixelRatio(window.devicePixelRatio);
        this.#renderer.setSize(innerWidth, innerHeight);
        this.#renderer.toneMapping = THREE.CineonToneMapping;
        this.#renderer.toneMappingExposure = 2;
        this.#renderer.shadowMap.enabled = false;
        this.#renderer.shadowMap.type = THREE.VSMShadowMap;
        this.#sceneContainer.appendChild(this.#renderer.domElement);

        this.#controls = new OrbitControls(this.#camera, this.#renderer.domElement);
        this.#controls.update();

        const usdzFile = this.#sceneContainer.getAttribute(this.#USDZ_SRC_DATA_ATTRIBUTE);
        const environmentMapFile = this.#sceneContainer.hasAttribute(this.#ENVIRONMENT_MAP_SRC_DATA_ATTRIBUTE)
            ? this.#sceneContainer.getAttribute(this.#ENVIRONMENT_MAP_SRC_DATA_ATTRIBUTE)
            : undefined;
        
        await this.#loadEnvironmentMap(environmentMapFile);

        this.#loadedModel = await this.#loadUSDZFile(scene, usdzFile);

        this.#camera.position.set(0.0, 0.0, 7.5);

        const pointLight = new THREE.PointLight(0xff8888, 0.01);
        pointLight.position.set(-30, 20, 220);
        pointLight.castShadow = true;
        pointLight.shadow.camera.near = 8;
        pointLight.shadow.camera.far = 1000;
        pointLight.shadow.mapSize.width = 1024;
        pointLight.shadow.mapSize.height = 1024;
        pointLight.shadow.bias = -0.002;
        pointLight.shadow.radius = 4;
        pointLight.shadow.samples = 8;
        scene.add(pointLight);

        return scene;
    }

    /**
     * Load the given USDz file into the given THREE Scene.
     * 
     * @param {THREE.Scene} scene THREE Scene into which to load the USDz file.
     * @param {string} usdzFile Path of the USDz file to load.
     * @returns {Promise<USDZInstance>} A Promise to be fulfilled once the USDz file has been loaded.
     */
    async #loadUSDZFile(scene, usdzFile) {
        const usdzLoader = new USDZLoader('./wasm');
        const usdzBuffer = await fetch(usdzFile);
        const fileBits = [await usdzBuffer.arrayBuffer(),];
        const file = new File(fileBits, usdzFile);
        
        const group = new THREE.Group();
        group.name = 'USD Root';
        group.position.set(0.0, 0.0, 0.0);
        group.scale.set(0.05, 0.05, 0.05);
        scene.add(group);

        const loadedModel = await usdzLoader.loadFile(file, group);
        this.#fitCameraToSelection(this.#camera, this.#controls, [group]);
        return loadedModel;
    }

    /**
     * Load the environment map for the scene.
     * 
     * @param {string} environmentMapFile Environment map file to load.
     * @returns {Promise<THREE.DataTexture>} A Promise to be fulfilled with the texture of the environment map.
     */
    #loadEnvironmentMap(environmentMapFile = 'images/studio_country_hall_1k.hdr') {
        return new Promise(resolve => {
            const pmremGenerator = new THREE.PMREMGenerator(this.#renderer);
            pmremGenerator.compileCubemapShader();

            new RGBELoader().load(environmentMapFile, texture => {
                const hdrRenderTarget = pmremGenerator.fromEquirectangular(texture);
                texture.mapping = THREE.EquirectangularRefractionMapping;
                texture.needsUpdate = true;
                window.envMap = hdrRenderTarget.texture;

                resolve(texture);
            });
        });
    }

    /**
     * Animate the USDz scene.
     * 
     * @param {number} frameTime Duration of the frame.
     */
    animate(frameTime) {
        this.#loadedModel.update(frameTime);
        this.#scene.rotation.y += 0.01
        this.#renderer.render(this.#scene, this.#camera);
    }

    /**
     * Resize the THREE Scene.
     */
    resize() {
        const [innerWidth, innerHeight] = this.#getSceneSize();

        this.#camera.aspect = innerWidth / innerHeight;
        this.#camera.updateProjectionMatrix();
        this.#renderer.setSize(innerWidth, innerHeight);
    }

    /**
     * Fit the given selected THREE Objects into the camera framing.
     * 
     * @param {THREE.Camera} camera THREE Scene camera.
     * @param {THREE.OrbitControls} controls THREE Scene controls.
     * @param {Array<THREE.Group>} selection THREE Objects to fit into the camera framing.
     * @param {number} fitOffset Adjustment factor for the fitting.
     */
    #fitCameraToSelection(camera, controls, selection, fitOffset = 1.5) {
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        const box = new THREE.Box3();
        
        box.makeEmpty();
        for (const object of selection) {
            box.expandByObject(object);
        }
  
        box.getSize(size);
        box.getCenter(center);
  
        const maxSize = Math.max(size.x, size.y, size.z);
        const fitHeightDistance = maxSize / (2 * Math.atan(Math.PI * camera.fov / 360));
        const fitWidthDistance = fitHeightDistance / camera.aspect;
        const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);
  
        const direction = controls.target.clone()
            .sub(camera.position)
            .normalize()
            .multiplyScalar(distance);
  
        controls.maxDistance = distance * 10;
        controls.target.copy(center);
  
        camera.near = distance / 100;
        camera.far = distance * 100;
        camera.updateProjectionMatrix();
  
        camera.position.copy(controls.target).sub(direction);
  
        controls.update();
    }
}
