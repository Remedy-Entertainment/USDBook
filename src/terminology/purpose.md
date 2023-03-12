# Purpose


_Purpose_ is an attribute that can be used to give a prim and its descendants a high-level "visibility flag" in context of rendering.

For example, if a prim has its `purpose` attribute set to `render`, it will be excluded from being drawn in a renderer that only wants to draw `proxy` prims.

In some sense, setting purpose could be considered [Stage Traversal](./stage_traversal.md) but for rendering.


Currently, only 4 values are supported by the `purpose` attribute:

| Purpose    | Description | 
|--------------|-----------|
| `default` | The prim has no special rendering purpose and it will be included in all rendering paths      |
| `guide`      | A prim tree marked with `guide` is generally used by interactive applications that have asked to show "guides". Think of it as requesting to visualize controller geometry for rigs, skeleton data, etc  |
| `proxy`      | Proxy is usually reserved for a lightweight representation of another object to be used in an interactive renderer such as a DCC viewport  |
| `render`      | The "final quality" data to be imaged. Usually enabled for offline rendering or final quality rendering |


```admonish warning title=""
Unlike [Kind](./kind.md). `purpose` cannot be extended with custom values!
```


```admonish example title="Example Switching between proxy and render Purposes"
![purpose](../images/terminology/purpose.gif)
```

```admonish note title=""
As seen above, `purpose` is not an exclusive toggle! It is possible to have both `proxy` _and_ `render` purposes active and their contents drawn to the screen.
```


`/root/GEO` has its purpose set to `render`, it will only be drawn when the active renderer requests prims with a `render` purpose.
```admonish example title="Render Purpose"
![renderpurpose](../images/terminology/purpose_render.png)
```

`/root/GEO_PROXY` has its purpose set to `proxy`, it will only be drawn when the active renderer requests prims with a `proxy` purpose.

```admonish example title="Proxy Purpose"
![proxypurpose](../images/terminology/purpose_proxy.png)
```



---

```admonish note title=""
↪ [USD Glossary - Purpose](https://graphics.pixar.com/usd/release/glossary.html#usdglossary-purpose)
```
