# Getting USD

At the time of writing (`2022`), Pixar Animation Studios do not offer an out-of-the-box solution to download pre-built versions of USD and the packaged tools. This page will list a few methods that users can explore to start working with USD.

Generally speaking, there are two ways to be able to use USD.

```admonish abstract title="Standalone"
This is the method used within this book, but relies on the bundled USD tools such as `usdview` and others. The standard USD tools offer ways to visualize USD, but not so much _edit_ or _create_ new USD. Creation of USD layers and composition is done via manually writing the layers in USD's Text representation or by authoring it through the next method.
```

```admonish abstract title="Within a Host Application"
Host Applications are third party software that choose to embed USD into their toolset, or be built entirely on top of USD. 

For example, Autodesk Maya adds support for authoring and viewing USD within itself via its MayaUSD plugin suite. SideFx Houdini comes bundled with Solaris, which is built upon USD. And then there are the hosts that are built entirely on top of USD such as Nvidia's Omniverse and Wizart Dcc.
```

## Host Applications
- [Nvidia Omniverse](https://www.nvidia.com/en-us/omniverse/) - A very capable USD assembler which brings you very close to working with raw USD

## Standalone
These are the least artist friendly options, but can be a good option for the technically inclined or for those who wish to experience USD as it is provided by Pixar.

### Prebuilt binaries
There are little to no prebuilt binaries available, but luckily Nvidia does provide some at [developer.nvidia.com/usd](https://developer.nvidia.com/usd#bin). 

```admonish warning title=""
The binaries made available here are not the latest-and-greatest and they require that a specific version of [Python](https://www.python.org/) is installed!
```

### Compile-it-yourself
This is the "traditional" way of getting started with USD and can be incredibly daunting for non-software engineers. But, if you do wish to do so; Pixar provide [fantastic build instructions](https://github.com/PixarAnimationStudios/USD)!