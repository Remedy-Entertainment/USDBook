# Specifier

When defining a prim in the scene graph, there are three different ways of doing so.

```admonish info title=""
The examples below use the text representation of USD as these concepts are not well visualized in `usdview`
```

~~~admonish abstract title="**def**"
A concrete definition. This is generally used when you want to define a prim for the very first time, or when a prim needs to be redefined. `def`s _always_ contribute to scene composition.
  ```
  def Xform "MyTransform"
  {
    # ...
  }
  ```

  `def` can also be `type-less` and is usually used in context of composition, which will fill in the actual type.
  ```
  def "MyPrim" {
    # ...
  }
  ```
~~~

~~~admonish abstract title="**over**"
This tells USD that a prim is to be overridden. If the composition engine cannot find the prim targeted by the over specification, the override will be ignored and will not contribute to scene composition.
  ```
  over "SomethingThatAlreadyExists"
  {
    # ...
  }
  ```
~~~

~~~admonish abstract title="**class**"
 An abstract prim definition that does not contribute to stage traversal by default. Meaning, it does not show up in the stage hierarchy. Other prims can however, inherit from this class (more on that in the next chapters)
  ```
  class "_MyClass"
  {
    # ...
  }
  ```
~~~

---

```admonish note title=""
↪ [USD Glossary - Specifier](https://graphics.pixar.com/usd/release/glossary.html#usdglossary-specifier)
```