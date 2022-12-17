# Getting USD

USD is an amazing technology stack, but unfortunately that is also what makes it hard to get started with. It is a suite of libraries and tools that are all part of the larger ecosystem that makes up USD. And while third party tooling is getting better and better, just "grabbing USD" can prove to be quite challenging.

Pixar Animation Studios offers the [source code on GitHub](https://github.com/PixarAnimationStudios/USD), and for developers that is generally the first point of entry to get started. They would clone the repository, bootstrap the right version of Python and their favorite C++ compiler and then take a long coffee break to get all the tools and libraries built for their system.

Suffice to say, this approach isn't for everyone. Fortunately, it is also not the _only_ way to get started with USD.

As a newcomer, there are generally two ways in how to get and use USD.

```admonish abstract title="Within a Host Application"
Host Applications are third party software that choose to embed USD into their toolset, or be built entirely on top of USD.

Below is a small list of the most well known applications that do so:  
- [NVIDIA Omniverse Create](https://www.nvidia.com/en-us/omniverse/apps/create/) - A very capable USD assembler built on top of [NVIDIA's Omniverse](https://www.nvidia.com/en-us/omniverse) which brings you very close to working with raw USD
- [Autodesk Maya + MayaUsd](https://www.autodesk.com/products/maya) - Professional 3D Software, the Maya USD integration is an add-on that can be installed during installation
- [SideFx Houdini + Solaris](https://www.sidefx.com/products/houdini/solaris/) - Professional 3D Software, the look development suite called Solaris is built-in and built on USD

```

~~~admonish abstract title="Standalone"
This is at the moment the least artist-friendly option, but can be interesting for those who wish to experience USD as it is provided by Pixar Animation Studios. There are two ways of getting to use USD in a standalone manner:

* **Prebuilt binaries**  
  While there are few prebuilt binaries available, NVIDIA does provide some at [developer.nvidia.com/usd](https://developer.nvidia.com/usd#bin)  

* **Compile-it-yourself**  
  This is the "traditional" way of getting started with USD and can be as mentioned incredibly daunting for non-software engineers. But, if you do wish to go down this route; Pixar Animation Studios provide [fantastic build instructions](https://github.com/PixarAnimationStudios/USD)

~~~


If you are new to USD, and you want to learn to construct and work with USD; it's recommended to build USD compositions and layers through a Host Application. Each host does have its own learning curve and individual challenges and idiosyncrasies with regards to USD; but will likely get you going the fastest.

```admonish note title=""
The `Compile-it-yourself` method is used for all images within this book, and relies heavily on bundled USD tools such as `usdview`.
```