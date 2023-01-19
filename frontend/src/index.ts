import { USDZScene } from './USDZScene';


/**
 * USDz scenes loaded on the page.
 */
let usdzScenes: USDZScene[] = [];


/**
 * Executed the given callback once the DOM is ready.
 *
 * @param callback Callback to execute once the DOM is ready.
 */
function onDOMReady(callback: () => void) {
    if (document.readyState !== 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
}

/**
 * Load  all the USDz scenes on the page, identified by the `.js-usd-viewer` CSS class:
 *
 * @returns A Promise to be fulfilled once all the USDz scenes on the page have been loaded.
 */
async function loadSceneContainers() {
    const scenes = [];

    // Search for THREE scene containers on the page, identified by the `.js-usd-viewer` CSS class:
    const sceneContainers = document.querySelectorAll('.js-usd-viewer') as NodeListOf<HTMLDivElement>;
    for (const sceneContainer of sceneContainers) {
        const usdzScene = new USDZScene(sceneContainer);
        scenes.push(usdzScene);
    }

    // Load all scene containers found on the page:
    await Promise.all(scenes.map(scene => scene.load()));
    return scenes;
}


/**
 * Animate the USDz scenes loaded on the page.
 */
async function animateScenes() {
    const timestamp = new Date().getTime() / 1000;
    await new Promise(resolve => setTimeout(resolve, 10));

    for (const usdzScene of usdzScenes) {
        usdzScene.animate(timestamp);
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
