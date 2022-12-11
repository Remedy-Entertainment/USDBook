# Schemas

Schemas are the "descriptions" of Prims, properties, metadata, etc... Schemas allow USD to have "knowledge" of what a Prim or its attributes mean. 
USD can be extended with new schemas via Plugins to define custom sets of properties, whole new prim types, metadata, and more. 

Schemas are built by authoring the schema definition itself in the .usda file format syntax, which can be use to generate the necessary source code and plugin files.  
Without diving into the particulars, USD's default prims and properties are in fact Schemas that Pixar has provided in the source code.

```admonish tip title=""
Since USD 21.08, schemas do not require to generate code to be usable, so only the plugin is needed. These are known as `codeless schemas`
```

Generally there are two types of schemas users can author.

```admonish abstract title=""
[IsA Schemas](./isa_schemas.md)
```

```admonish abstract title=""
[API Schemas](./api_schemas.md)
```

---

```admonish note title=""
↪ [USD Glossary - Schema](https://graphics.pixar.com/usd/release/glossary.html#usdglossary-schema)
```