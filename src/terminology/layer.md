# Layer

A Layer is a collection of Prims and their Properties that can be saved to/loaded from disk or memory. As such, it can be considered a "saveable hierarchy".

Standard USD Layers can be represented on-disk via

| Extension    | Description |
|--------------|-----------|
| `.usda` | ASCII Text, human-readable format      |
| `.usdc`      | USD Crate file format. High performance binary not human-readable format  |
| `.usd`      | either Crate or Text  |
| `.usdz`      | uncompressed and packaged format (.zip)  |

```admonish info title=""
USD allows for extending what you can load as a "Layer" via a special kind of plugin (`SdfFileFormat`). In fact, the file types listed above are actually all plugins of this type.  
Using this `SdfFileFormat` plugin type, it is for example possible to also support loading `.fbx`, `.abc`, `.obj` (or anything really) in Usd.
```

---

```admonish note title=""
↪ [USD Glossary - Layer](https://graphics.pixar.com/usd/release/glossary.html#usdglossary-layer)
```