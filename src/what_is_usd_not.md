# What is it not?

## Just a File Format

While the main "interface" of working with USD for many artists is through its file-on-disk representation, it's important to consider USD more as an ecosystem than another file type on disk.  
Given its abilities and what it can offer, calling it a fileformat would be a disservice to the technology.

USD can be molded to your needs or it can be used as-is. File-on-disk representations can be omitted altogether. The way you can refer to other USD scenes is extremely flexible. And you can even integrate any custom rendering engine via a simple plugin so it understands how to work with USD data, etc... 

```admonish tip title="Hot tip!"
If you use USD enough, it becomes a way of life 😄
```

## A Replacement for Content _Creation_

USD can do a lot of things, but it also cannot do quite a few other things. A major component of its architecture does not allow for _interactive values_. Meaning that values are resolved essentially "only once" and do not change unless the entire scene is "re-composed". In reality the way values are computed is a bit more complex than the aforementioned, but it's easier to think of it this way.

From a design point of view, USD was built with "low-memory footprint, higher-latency data access" in mind. Thus, in order to allow for low memory usage, data access is slower than in a "high-memory footprint, low-latency access to data" paradigm. The latter sacrificies memory footprint in favor of fast data access, allowing for dynamic evaluations.

Because of this design decision, USD cannot easily express "dynamic" systems like Rigging which relies on fast dynamically computed data access. It can however via its extensibility allow studios to _define_ rigging concepts. But this is merely a _specification_, the rig itself would not be _evaluated_ inside USD and will require the host software (for example Autodesk Maya) to take that information and translate it into a rig that it can understand.

----
```admonish note title=""
↪ [USD Intro - What Can't USD Do](https://graphics.pixar.com/usd/release/intro.html#what-can-t-usd-do)
```
