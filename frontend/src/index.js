import { USDZScene } from './USDZScene';


/**
 * USDz scenes loaded on the page.
 *
 * @type {Array<USDZScene>}
 */
let usdzScenes = [];


/**
 * @callback onDOMReadyCallback
 * @return {void}
 */

/**
 * Executed the given callback once the DOM is ready.
 *
 * @param {onDOMReadyCallback} callback Callback to execute once the DOM is ready.
 */
function onDOMReady(callback) {
    if (document.readyState !== 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
}

/**
 * Load  all the USDz scenes on the page, identified by the `.js-usd-viewer` CSS class:
 *
 * @returns {Promise<USDZScene[]>} A Promise to be fulfilled once all the USDz scenes on the page have been loaded.
 */
async function loadSceneContainers() {
    const scenes = [];

    // Search for THREE scene containers on the page, identified by the `.js-usd-viewer` CSS class:
    const sceneContainers = document.querySelectorAll('.js-usd-viewer');
    for (const sceneContainer of sceneContainers) {
        const usdzScene = new USDZScene(sceneContainer);
        scenes.push(usdzScene);
    }

    // Load all scene containers found on the page:
    await Promise.all(scenes.map(scene => scene.load()));
    return scenes;
}


/**
 * Animate the USDZ scenes loaded on the page.
 */
async function animateScenes() {
    const frameTime = new Date().getTime() / 1000;
    await new Promise(resolve => setTimeout(resolve, 10));

    for (const usdzScene of usdzScenes) {
        usdzScene.animate(frameTime);
    }

    requestAnimationFrame(animateScenes);
}

/**
 * Callback executed upon resizing the window.
 */
function onWindowResize() {
    for (const usdzScene of usdzScenes) {
        usdzScene.resize();
    }
}


/**
 * Main application entrypoint.
 */
(function main() {
    onDOMReady(async () => {
        usdzScenes = await loadSceneContainers();
        animateScenes();

        window.addEventListener('resize', onWindowResize);
    });
})();
