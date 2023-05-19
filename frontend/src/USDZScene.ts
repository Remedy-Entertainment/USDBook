import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { USDZLoader } from 'three-usdz-loader';
import { USDZInstance } from 'three-usdz-loader/lib/USDZInstance';


/**
 * THREE Scene loading USDz assets.
 *
 * @todo Include additional configuration options within USDz file scene containers (e.g. default file scales, camera
 * position and orientation, etc.).
 * @todo Add progress indicators when loading USDz files, in order to provide a better User experience.
 */
export class USDZScene {

    /**
     * DOM container of the THREE scene.
     */
    #sceneContainer: HTMLDivElement;

    /**
     * THREE scene renderer.
     */
    #renderer: THREE.WebGLRenderer;

    /**
     * THREE scene.
     */
    #scene: THREE.Scene;

    /**
     * THREE scene camera.
     */
    #camera: THREE.PerspectiveCamera;

    /**
     * THREE scene controls.
     */
    #controls: OrbitControls;

    /**
     * Loaded USDz model.
     */
    #loadedModel: USDZInstance;

    /**
     * Flag indicating whether the object is expected to auto-rotate during animations.
     */
    #autoRotate = true;

    /**
     * Speed at which to auto-rotate the scene during animations.
     */
    #autoRotateSpeed = 0.01;

    /**
     * Flag indicating whether the User is currently performing a drag over the scene.
     */
    #isDragging = false;


    /**
     * Key of the `data-*` attribute holding the path of the USDz file to load.
     */
    #USDZ_SRC_DATA_ATTRIBUTE = 'data-usdz-src';

    /**
     * Key of the `data-*` attribute holding the path of the environment map file to load.
     */
    #ENVIRONMENT_MAP_SRC_DATA_ATTRIBUTE = 'data-envmap-src';

    /**
     * Key of the `data-*` attribute holding the flag indicating whether the scene should auto-rotate during animations.
     */
    #AUTO_ROTATE_DATA_ATTRIBUTE = 'data-auto-rotate';

    /**
     * Key of the `data-*` attribute holding the auto-rotation speed of the scene during animations.
     */
    #AUTO_ROTATE_SPEED_DATA_ATTRIBUTE = 'data-auto-rotate-speed';


    /**
     * Constructor.
     *
     * @param sceneContainer DOM container of the THREE scene.
     */
    constructor(sceneContainer: HTMLDivElement) {
        this.#sceneContainer = sceneContainer;

        // Extract settings from the scene container:
        if (this.#sceneContainer.hasAttribute(this.#AUTO_ROTATE_DATA_ATTRIBUTE)) {
            const autoRotateValue = this.#sceneContainer.getAttribute(this.#AUTO_ROTATE_DATA_ATTRIBUTE).toLowerCase();
            this.#autoRotate = autoRotateValue === 'true';
        }
        if (this.#sceneContainer.hasAttribute(this.#AUTO_ROTATE_SPEED_DATA_ATTRIBUTE)) {
            const autoRotateSpeedValue = this.#sceneContainer.getAttribute(this.#AUTO_ROTATE_SPEED_DATA_ATTRIBUTE);
            const parsedAutoRotateSpeed = parseFloat(autoRotateSpeedValue);
            if (!isNaN(parsedAutoRotateSpeed)) {
                this.#autoRotateSpeed = parsedAutoRotateSpeed;
            }
        }
    }

    /**
     * Load the USDz scene.
     *
     * @returns A Promise to be fulfilled once the USDz scene has been built.
     */
    async load() {
        this.#scene = await this.#buildTHREEScene();
        this.#registerEventListeners();
    }

    /**
     * Return the size of the THREE Scene.
     *
     * @returns The width and height of the THREE Scene.
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
     * @returns A Promise to be fulfilled once the THREE Scene has been built.
     */
    async #buildTHREEScene() {
        const [innerWidth, innerHeight] = this.#getSceneSize();
        const sceneBackgroundColor = this.#getSceneBackgroundColor();

        // Insert a spinner animation while loading the scene, so the User is not facing a blank or partially-loaded
        // content until all assets have been downloaded and processed:
        this.#sceneContainer.style.backgroundColor = sceneBackgroundColor.toString();
        this.#sceneContainer.innerHTML = [
                `<div class="loader" style="min-width: ${innerWidth}px; min-height: ${innerHeight}px; background-color: ${sceneBackgroundColor}">`,
                    '<div class="vertical-center">',
                        '<i class="fa fa-spinner fa-spin"></i>',
                    '<div>',
                '</div>',
            ].join('');

        // Setup scene:
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

        // Load the USDz file and HDR environment map in parallel for efficiency:
        [this.#loadedModel, ] = await Promise.all([
            this.#loadUSDZFile(scene, usdzFile),
            this.#loadEnvironmentMap(environmentMapFile),
        ]);

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
        // pointLight.shadow.samples = 8;
        scene.add(pointLight);

        // Only load the scene in the container once the assets have loaded, so the progress indicators are displayed
        // until the scene and its content are fully loaded:
        this.#sceneContainer.replaceChildren(this.#renderer.domElement);

        return scene;
    }

    /**
     * Register event listeners to be applied on the rendered scene's HTML element.
     */
    #registerEventListeners() {
        this.#renderer.domElement.addEventListener('mousedown', () => {
            this.#isDragging = true;
        }, { passive: true, });

        this.#renderer.domElement.addEventListener('mouseup', () => {
            this.#isDragging = false;
        }, { passive: true, });
    }

    /**
     * Load the given USDz file into the given THREE Scene.
     *
     * @param scene THREE Scene into which to load the USDz file.
     * @param usdzFile Path of the USDz file to load.
     * @returns A Promise to be fulfilled once the USDz file has been loaded.
     */
    async #loadUSDZFile(scene: THREE.Scene, usdzFile: string) {
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
     * @param environmentMapFile Environment map file to load.
     * @returns A Promise to be fulfilled with the texture of the environment map.
     */
    #loadEnvironmentMap(environmentMapFile = 'images/studio_country_hall_1k.hdr'): Promise<THREE.DataTexture> {
        return new Promise(resolve => {
            const pmremGenerator = new THREE.PMREMGenerator(this.#renderer);
            pmremGenerator.compileCubemapShader();

            new RGBELoader().load(environmentMapFile, (texture: THREE.DataTexture) => {
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
     * @param timestamp UNIX timestamp (in milliseconds).
     */
    animate(timestamp: number) {
        this.#loadedModel.update(timestamp);
        if (this.#autoRotate && !this.#isDragging) {
            this.#scene.rotation.y += this.#autoRotateSpeed;
        }
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
     * @param camera THREE Scene camera.
     * @param controls THREE Scene controls.
     * @param selection THREE Objects to fit into the camera framing.
     * @param fitOffset Adjustment factor for the fitting.
     */
    #fitCameraToSelection(camera: THREE.PerspectiveCamera, controls: OrbitControls, selection: THREE.Group[], fitOffset = 1.5) {
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
     * @returns The location of the WASM dependencies.
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
     * @returns `true` if the User prefers a dark color scheme, `false` otherwise.
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
     * @returns The color to use for the THREE Scene's background color.
     */
    #getSceneBackgroundColor(): THREE.ColorRepresentation {
        // Search for the `.js-usd-viewer.dark` and `.js-usd-viewer.light` CSS class names within the stylesheets
        // definitions present on the page, in order to infer the styles to apply to the USDz THREE `<canvas>`
        // elements:
        const cssModeClassName = this.#prefersDarkMode() ? 'dark' : 'light';
        const cssClassName = `.js-usd-viewer.${cssModeClassName}`;

        // Attempt to extract the `background-color` property of the styles in the stylesheet definitions present on
        // the page:
        for (const styleSheet of document.styleSheets) {
            for (const cssRule of styleSheet.cssRules) {
                if (cssRule instanceof CSSStyleRule
                        && cssRule.selectorText === cssClassName
                        && 'background-color' in cssRule.style) {
                    return cssRule.style['background-color'] as THREE.ColorRepresentation;
                }
            }
        }

        // If no CSS classes matching the expected nomenclature were found, default to a known useable color:
        return 0xffffff;
    }
}
