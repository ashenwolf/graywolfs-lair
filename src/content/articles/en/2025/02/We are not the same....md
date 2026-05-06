---
title: We Are Not the Same...
date: 2026-02-22
tags:
  - software-engineering
  - AI
  - LLM
lang: en
draft: false
description: One thing I learned over time is that more does not mean better.
category: software-engineering
image: /assets/images/2026/02/perplexity-image.png
---
One thing I learned over time is that more does not mean better. More lines of code do not mean that the software does more. More code quite often means more code duplication, bad or absent high-level design, and accidental complexity.

Excessive time spent on architecture does not mean that the design is better. Spending too much time often means relying on a significantly larger amount of assumptions and over-engineering.

More people working on the same project does not always bring speed. When there are too many, people step on each other's toes, produce a horrific amount of merge conflicts, and slow down knowledge sharing (sharing with 5 people and sharing with 20 have very different dynamics).

AI could have been our blessing: freeing up time to step back and think about what can be improved, what parts can be simplified, and in the end, create more with less. Instead, we see the glowing eyes of people expecting engineers to deliver everything at a 10x pace but with the same quality. Fifteen years after the [iconic Rich Hickey talk](https://www.youtube.com/watch?v=SxdOUGdseq4), we still have not learned our lesson and are still choosing "easy" over "simple," just on a different abstraction level.

The thing is, AI doesn't "understand" simplicity; all of it is equal in the eyes of AI: whether obfuscated garbage code or beautifully crafted abstractions. Both are just bunches of tokens. Most code on the internet (the AI's training data) is not simple: it’s mediocre, bloated, but "easy." By relying on AI, engineers are essentially outsourcing their architectural standards to the industry average. As Rich Hickey might say, we are choosing the "aggregate easy" over the "intentional simple."

P.S. Intentional irony: this whole website is vibe-coded in Astro without me touching the codebase. Though I had to review the generated codebase several times to seek patterns and optimize it. I'm not sure if I would have written it all the same way, but at least I taught the AI to use [table-driven methods](https://www.oreilly.com/library/view/code-complete-2nd/0735619670/ch18.html) during development.

![More vs better software: we are not the same](/assets/images/2026/02/software-we-are-not-the-same-2.jpg)