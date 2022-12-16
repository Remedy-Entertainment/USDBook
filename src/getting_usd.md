# Getting USD

USD is an amazing technology stack, but unfortunately that is also what it is to this date (2022); a tech stack. While the generalized tooling is getting better and better, just "getting USD" can prove to be quite troublesome.

Pixar Animation Studios offers the source code and for developers that is generally the first point of entry to get started. They clone the repository, bootstrap the right version of Python and their favorite C++ compiler and then take a long coffee break to get all the tools and libraries built for their system.

If you are not an experienced software engineer, this can be an incredibly intimidating experience! 

```admonish quote title=""
Ok, I need Python? I need to install which dependency now? Now I need CMAKE? And a C++ Compiler? What are all these warnings??!? Environment Variables?! 😱
```

Suffice to say, this approach isn't for everyone. Fortunately, there are already some good tools out there that bundle with USD, commercial and free; but using "raw" USD is currently not easy.

That said, there are generally two ways in how one can use USD.

```admonish abstract title="Within a Host Application"
Host Applications are third party software that choose to embed USD into their toolset, or be built entirely on top of USD. 
```

```admonish abstract title="Standalone"
This is the method used within this book, but relies on the bundled USD tools such as `usdview` and others. 

The standard USD tools offer ways to _visualize_ USD compositions, but not so much _edit or create_ them. Creation of USD layers and composition is done via manually writing the layers in USD's Text representation or by authoring it through the previous method.
```

## Host Applications
If you are new to USD, and you want to learn to construct and work with USD; it's recommended to build USD compositions and layers through one of these tools. Each tool does have its own learning curve and individual challenges and idiosyncrasies with regards to USD; but will likely get you going the fastest.

- [Nvidia Omniverse Create](https://www.nvidia.com/en-us/omniverse/apps/create/) - A very capable USD assembler built on top of [NVidia's Omniverse](https://www.nvidia.com/en-us/omniverse) which brings you very close to working with raw USD
- [Autodesk Maya + MayaUsd](https://www.autodesk.com/products/maya) - Professional 3D Software, the Maya USD integration is an add-on that can be installed during installation
- [SideFx Houdini + Solaris](https://www.sidefx.com/products/houdini/solaris/) - Professional 3D Software, the look development suite called Solaris is built-in and built on USD

## Standalone
These are the least artist friendly options, but can be a good option for the technically inclined or for those who wish to experience USD as it is provided by Pixar Animation Studios.

### Prebuilt binaries
There are little to no prebuilt binaries available, but luckily Nvidia does provide some at [developer.nvidia.com/usd](https://developer.nvidia.com/usd#bin). 

```admonish warning title=""
The binaries made available here are not the latest-and-greatest and they require that a specific version of [Python](https://www.python.org/) is installed!
```

### Compile-it-yourself
This is the "traditional" way of getting started with USD and can be as mentioned incredibly daunting for non-software engineers. But, if you do wish to do so; Pixar Animation Studios provide [fantastic build instructions](https://github.com/PixarAnimationStudios/USD)!