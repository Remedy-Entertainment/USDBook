import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { USDZLoader } from 'three-usdz-loader';


/**
 * THREE Scene loading USDz assets.
 * 
 * @todo Convert this to TypeScript, to facilitate collaboration.
 * @todo Include additional configuration options within USDz file scene containers (e.g. default file scales, camera
 * position and orientation, etc.).
 * @todo Add progress indicators when loading USDz files, in order to provide a better User experience.
 * @todo Add option to disable auto-rotating the asset in the viewer.
 * @todo Add option to provide the auto-rotation speed of the asset in the viewer, if auto-rotation is enabled.
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
        const innerWidth = this.#sceneContainer.offsetWidth !== undefined
            ? this.#sceneContainer.offsetWidth
            : this.#sceneContainer.clientWidth !== undefined
            ? this.#sceneContainer.clientWidth
            : 800;
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
        // this.#sceneContainer.innerHeight = innerHeight; 
        this.#sceneContainer.innerHTML = [
                `<div class="loader" style="min-width: ${innerWidth}px; min-height: ${innerHeight}px">`,
                    `<div class="vertical-center">`,
                        '<i class="fa fa-spinner fa-spin"></i>',
                    '<div>',
                '</div>',
            ].join('');

        // Setup scene:
        const sceneBackgroundColor = this.#getSceneBackgroundColor();
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(sceneBackgroundColor);

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

        // Only load the scene in the container once the assets have loaded, so the progress indicators are displayed
        // until the sceen and its content are fully loaded:
        this.#sceneContainer.replaceChildren(this.#renderer.domElement);

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
        const usdzLoader = new USDZLoader(this.#getWASMDependenciesDirectory());
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

    /**
     * Return the location of the WASM dependencies.
     * 
     * @returns {string} The location of the WASM dependencies.
     */
    #getWASMDependenciesDirectory() {
        let directory = '';
        const hostname = window.location.hostname.toLowerCase();
        if (hostname === 'localhost') {
            // On `localhost`, WASM dependencies are served at the root of the URL:
            directory = '';
        } else if (hostname.endsWith('.github.io')) {
            // On GitHub Pages, sites are named using the `<username>.github.io/<repository>/...` format:
            const repositorySegments = window.location.pathname.split('/');
            if (repositorySegments.length > 2) {
                directory = `/${repositorySegments[1]}`;
            }
        }
        return `${directory}/wasm`;
    }

    /**
     * Check if the User prefers a dark color scheme.
     * 
     * @returns {boolean} `true` if the User prefers a dark color scheme, `false` otherwise.
     */
    #prefersDarkMode() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark').matches) {
            return true;
        }
        return false;
    }

    /**
     * Return the color to use for the THREE Scene, based on the User's preference for either a `dark` or `light` mode.
     * 
     * @returns {THREE.ColorRepresentation} The color to use for the THREE Scene's background color.
     */
    #getSceneBackgroundColor() {
        // Search for the `.js-usd-viewer.dark` and `.js-usd-viewer.light` CSS class names within the stylesheets
        // definitions present on the page, in order to infer the styles to apply to the USDz THREE `<canvas>`
        // elements:
        const cssModeClassName = this.#prefersDarkMode() ? 'dark' : 'light';
        const cssClassName = `.js-usd-viewer.${cssModeClassName}`;

        // Attempt to extract the `background-color` property of the styles in the stylesheet definitions present on
        // the page:
        for (const styleSheet of document.styleSheets) {
            for (const cssRule of styleSheet.cssRules) {
                if (cssRule.selectorText === cssClassName && 'background-color' in cssRule.style) {
                    return cssRule.style['background-color'];
                }
            }
        }

        // If no CSS classes matching the expected nomenclature were found, default to a known useable color:
        return 0xffffff;
    }
}
