---
title: Things I’ve Learnt from the Best Software Engineer I Have Ever Met. Part 3
date: 2023-11-03
tags:
  - software-engineering
lang: en
draft: false
description:
category: software-engineering
image: /assets/images/2023/08/20260220195449.png
---
My original list of insights was covered in [Part 2](Things%20I've%20Learnt%20from%20the%20Best%20Software%20Engineer%20I%20Have%20Ever%20Met%20-%20Part%202.md) and [Part 1](Things%20I’ve%20Learnt%20from%20the%20Best%20Software%20Engineer%20I%20Have%20Ever%20Met%20-%20Part%201.md). However, during a recent discussion, I found myself echoing a phrase I often heard from Max: “we need to work on the culture of reading code”. This unexpected realization sparked the idea for this short addition to the series.

While numerous books on software engineering focus on teaching code writing techniques, from patterns to tests, and syntax in various languages, they often overlook a crucial aspect: software engineers spend roughly 70% of their time reading code, and only 30% writing it. Although this statistic lacks concrete research support, it’s a conservative estimate from my findings. Many might assume reading code is an automatic, unimprovable skill, but that’s far from the truth.

Developing any skill requires practice. We hone our coding abilities by writing and similarly, our proficiency in reading code improves with practice. However, solely reading your own code isn’t as enriching as delving into someone else’s work. Your own code often reflects familiar logic and reasoning, whereas interpreting others’ code is where the real skill-building happens. This is true up to a point; within a stable team, the coding style becomes familiar, akin to reading your own work.

The most significant and rewarding learning curve occurs when you join a new project or team, but such opportunities aren’t always feasible or desirable. A practical alternative is to engage in public open-source projects, your company’s community projects, or even explore code from adjacent teams within your organization. By examining external codebases, you gain fresh perspectives and real-world applications of diverse coding techniques and problem-solving approaches.

Being proficient in code reading is like being a detective: it’s engaging and educational when the code is well-crafted and can be challenging otherwise. You’ll know you’re adept at it when you can comfortably navigate and understand new codebases.

How to tell that you are good at reading code? That’s easy. It is when you jump on to the codebase and have a feeling akin to this 🙂

![Matrix](/assets/images/2018/05/tenor.gif)

An interesting resource in this context is the [“Architecture of Open Source Applications”](https://aosabook.org/en/) series. Unlike standard textbooks, these books provide practical, real-world applications of architectural concepts, complete with the necessary trade-offs involved in technical decision-making. Very different from other famous books about code and architecture that you may find on the market, as they really lack the practical aspect.

Max introduced an innovative idea into our hiring process that I hadn’t seen. As a part of the on-site job interviews we were giving candidates a sheet of paper with a code that was not working as expected. The task: figure out what it was supposed to do, share opinions on how to make it better, and figure out why it did not work as expected. You can’t even imagine how many insights about the person you can get from this simple task. You can evaluate their code reading skills, general preferences in code writing, and the way they think to tackle the problems. Even if they didn’t find the root cause of the problem, the way they tackle it could be a big yes or no to the hiring decision. The only downside of this one is that this exercise is somewhat stack-bound. In our case we had a hard requirement of C++ knowledge, but it may be not such a good idea for teams that do stack-agnostic hiring.

Those sheets were containing the actual codebase, and the problems were very real: they were the ones that he himself had spent some time debugging, but very distilled and stripped of business-specific things. Then he presented the question to his brother who was and still is one of the leading engineers in a world renown gaming company (high bar), and me who was a full-time project manager, and did not have a hands on C++ experience for 3 years at that time (low bar 😅), and measured the time to figure out the problem. This delta was our benchmark.

In summary, developing a culture of reading code is as vital as learning to write it. It’s an essential skill that offers insights into different coding styles and approaches, enhancing one’s overall software engineering expertise.