# Overrides


When expressing an opinion withing a layer. it is possible to "redefine" a previously defined value of the property being edited. This mechanism is known as `overrides` because you are _overriding_ what was there before.  
However, it is very important to note that the _original data_ remains unchanged. **The override only exists within the layer where you are defining it**

This is by far _the most important_ aspect to understand about USD. Opinions and its "value resolution" (resolving which value gets applied in the end) is key to the entire composition mechanism.

Below is a simple example of overriding a previously defined attribute's opinion.

```admonish example title="override example"
[![schematic](../images/terminology/overrides.png)](../images/terminology/overrides.png)

1. The layer where an attribute's opinion is first authored (`/GEO/Cube.size`)
2. a. The layer `cube_sphere_torus.usda` is brought into the layer `referenced.usda` via a composition mechanism called `referencing`  
  b. An opinion is expressed on the already defined attribute `/GEO/Cube.size`, but in context of `cube_sphere_torus.usda`, essentially overriding what was there before
3. The composed final result, aka the stage
```

---

```admonish note title=""
↪ [USD Glossary - Override](https://graphics.pixar.com/usd/release/glossary.html#usdglossary-override)
```