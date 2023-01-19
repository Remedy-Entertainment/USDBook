# ThreeJS viewer for USDz

## About

This NodeJS project contains the front-end code to build and package a ThreeJS viewer for USDz file, using an early WebAssembly build of USD.

### Utilization

Once included on an HTML page, the script will scan for document for `<div class="js-usd-viewer"></div>` containers that are meant to be used as placeholders for the USDz file to be displayed.

USDz files can be provided using the `data-usdz-src="<path of the USDz file>"` data attribute on the element, to indicate where the file can be located.

For example:

```html
<div class="js-usd-viewer" data-usdz-src="usdz/usd-cookie.usdz"></div>
```

#### Available `data-*` attribute options

|Option|Required|Default value|Description|
|---|:---:|:---:|---|
|`data-usdz-src`|yes|-|Path of the USDz file to display|
|`data-envmap-src`|no|-|Path of the HDR image to use as environment map for the scene|
|`data-auto-rotate`|no|`true`|Flag indicating whether the scene should auto-rotate during animations|
|`data-auto-rotate-speed`|no|`0.01`|Auto-rotation speed of the scene during animations.|

### Customization

The ThreeJS element rendered in the placeholders on the document can be styled using CSS definitions, which makes it possible to provide different background colors depending on whether Users indicate a preference for dark or light modes.

The following CSS class names can be used, and are expected to contain a `background-color` attribute providing the color to use for the background of the elements: `.js-usd-viewer.dark` and `.js-usd-viewer.light`. If provided, it is recommended to define these CSS classes in the */theme/usdz-viewer.css* file in order to maintain a certain level of organization within the project.

The HTML scene container also supports a `data-envmap-src="<path to environment map>"` data attribute, which can be used to supply a custom environment map to be used by ThreeJS when rendering the USDz asset.

## Building

To build the project:

1. Install [NodeJS](https://nodejs.org) on the host platform.
2. From a terminal, navigate to this directory (i.e. `cd /frontend`).
3. Execute `npm install` to pull the dependencies and build tools required for the project.
4. Execute `npm run build` to transpile, optimize and bundle the assets in their locations, so that running `mdbook` from the root location later can serve the assets.

Then, navigate to the root folder of the project (i.e. `cd ..`) and follow the instructions to use `mdbook`.

## Scripts

The project offers the following scripts:

- `npm run build:dev`: Build the front-end in development mode, avoiding minification to make it easier to debug the front-end code.
- `npm run build:dev:watch`: Build the front-end in development mode, and maintain a live file watcher open on the source file, so the assets can be recompiled whenever a change is detected so `mdbook` can also reload the live website preview.

## TODO

Over time, this project could be improved in the following ways:

- [ ] Packaging this front-end code into a separate project, in order not to risk polluting the `mdbook` project by moving files at build-time in order to place them in the locations expected by the HTML renderer.
- [ ] Adding progress indicators when loading USDz files, in order to provide a better User experience.
