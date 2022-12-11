# List-Editing

List editing is a feature within USD that allows for non-destructively editing list-typed elements within a scenegraph. You can append, prepend or delete items from a list during composition. Or even explicitly override the entire list. This is generally referring to references, relationships, custom metadata, inherits, specializations and variantsets. Attributes of a list-type cannot be list-edited.

In the example below, we override the list of references on a prim to also prepend a new reference to another layer. This results in the prim referring to two layers (assuming the original definition only points to a single layer).

~~~admonish example title="Example list-editing references"
```
#usda 1.0
 
over "World"
{
    over "Foo"
    {
        # Override "Bar" to also reference baz.usd in addition to its original references
        over "Bar" (
            prepend references = @./baz.usd@
        )
        {
        }
    }
}
```
~~~

---

```admonish note title=""
↪ [USD Glossary - List-Editing](https://graphics.pixar.com/usd/release/glossary.html#usdglossary-list-editing)
```