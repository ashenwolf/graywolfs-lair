---
title: We are not the same
date: 2026-02-21
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
One thing I learned over time is that more does not mean better.

More lines of code does not mean that the software does more. More code much more often means more code duplication, bad design and accidental complexity.

More time spent on architecture does not mean that design is better. Spending too much time often means relying on significantly larger amount of assumptions and over-engineering.

More people working on the same project does not always bring speed. If too much, people are stepping on each others' toes, produce horrific amount of merge conflicts, slow down knowledge sharing (yes, sharing with 5 people, and sharing with 20 has a very different dynamic).

AI could've been our blessing: freeing a time to step back and think what can be improved, what parts can be simplified, and in the end create more with less. Instead we see glowing eyes of people expecting engineers to deliver everything at 10x pace but with the same quality. 15 years after famous Rich Hickeys talk and we did not learn our lesson and are still choosing easy over simple, just on a different abstraction level.

The thing is, AI doesn't "understand" simplicity; all of it is equal in the eyes of AI: an obfuscated or garbage code, or beautifully crafted abstractions. Both of those are just a bunch of tokens... Most code on the internet (meaning the AI's training data) is not simple -- it’s mediocre, bloated, and "easy." By relying on AI, engineers are essentially outsourcing their architectural standards to the average of the industry. As Rich Hickey might say, we are choosing the "aggregate easy" over the "intentional simple."

P.S. Intentional irony: this whole website is vibe-coded in Astro without me touching the codebase. Though I several times had to make a review of the generated codebase to seek for patterns and optimize it. Not sure if I would wrote it all the same way, but at least I taught AI to use [table-driven methods](https://www.oreilly.com/library/view/code-complete-2nd/0735619670/ch18.html) during development.

![More vs better software: we are not the same](/assets/images/2026/02/software-we-are-not-the-same-2.jpg)