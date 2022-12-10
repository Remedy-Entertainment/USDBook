# Contributing

Before making a contribution to this repository (and we hope you do), please read over this document first.

Any changes or new work should be done on the `develop` branch of this repository. When creating Pull Requests, please ensure that the base branch is set to "develop". The repository owners will take care of promoting any changes to master at their volition.

## Conventions and Style

### Admonishments
This book makes heavy use of admonishments, please use the following guidelines when adding these basic admonishments. Any unlisted admonishments are of course free to use as you see fit.

See the [mkdocs-material documentation](https://squidfunk.github.io/mkdocs-material/reference/admonitions/#supported-types) for the supported types.

#### Notes
When adding notes to a page, do so with the `note` admonish and omit the title. This will result in a simple note box.

~~~markdown
```admonish note title=""
Simple concise note
```
~~~

Larger notes can have titles of course. And there are some within this book, but in general, notes should have a small footprint.

#### Examples
Use the example markdown when you want to showcase an example

~~~markdown
```admonish example title="<EXAMPLE_TITLE>"
images, code, etc...
```
~~~

#### Warnings
Use when it's important to confer to the reader that something may have side effects, information is inconclusive or unverified, etc...

~~~markdown
```admonish warning
Warning about a topic
```
~~~

#### Tips
Use for fun-facts, tidbits of information that are adjacent to the topic

~~~markdown
```admonish tip title="Fun fact"
This is a fun fact
```
~~~

#### Abstract
When needing to distinguish between two different "sub concepts"

See [Properties](./src/terminology/properties.md) for an example on how `abstract`s are used to distinguish between `attributes` and `properties`.

~~~markdown
```admonish abstract title="A sub-concept"
subconcept discription
```
~~~

### Glossary Chapters
Most chapters explaining something from the USD Glossary should follow this simple layout

~~~txt
# <TERM>

<SIMPLE INTRODUCTION>

```admonish example title="<EXAMPLE_TITLE>"
[![](../images/terminology/<EXAMPLE>.png)](../images/terminology/<EXAMPLE>.png)
```

<ANY OTHER EXPLANATION AND OTHER IMAGES/SUBTOPICS/ETC>

---

```admonish note title=""
↪ [USD Glossary - <TERM>](<LINK TO TERM ON THE GLOSSARY PAGE>)
```
~~~
