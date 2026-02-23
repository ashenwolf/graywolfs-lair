---
title: To code or not to code, that is the question
date: 2026-02-20
tags:
  - software-engineering
  - AI
  - LLM
lang: en
draft: false
description: My long-term fear about fully AI-driven development
category: software-engineering
image: /assets/images/2026/02/Pasted%20image%2020260220190858.png
---
![](../../../../assets/images/2026/02/20260220190858.png)

Checking my LinkedIn stream I saw Simon Wardley (yeah, the one that invented [Wardley map](https://en.wikipedia.org/wiki/Wardley_map)), [expressed his concerns](https://www.linkedin.com/posts/simonwardley_im-seeing-non-technical-people-build-massive-activity-7422285867748139008-LtEb?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAAD25FABa-zKja27Yk5uhKQcXSwNY1M327c) about the direction in which the software engineering is now moving: "A swarm of agents and the human reduced to a very narrow form of defined decision making (which in itself can be automated) whilst the swarm makes nearly all the decisions." Which would result in atrophy of the skills, where software engineers would lose the ability to reason about the code.

Honestly, that is my fear word-for-word that I expressed in many conversations. By outsourcing *all* of the low-level decisions to AI we would eventually lose the skills necessary to provide reasonable decision making. The reason why AI-augmented development works great right now is _exactly_ because there are experienced humans in the loop. Humans that know consequences of the good and bad decisions. These skills, however, become dull without the regular practice, and I'm really afraid that we may eventually reach a point of no return if we keep the current course.  

To become a senior software engineer, a person needs to start as a junior software engineer and grow for years. So, we are shooting our own feet twice: reducing the market for juniors (why do we need them, AI can write much better code!), and even those that make it to the software companies soon wouldn't be capable of writing a decent code without AI with the current organization set-ups. Who remembers the ["programming by coincidence"](https://dev.to/decoeur_/programming-by-coincidence-dont-do-it-7cp) from "Pragmatic Programmer" book? We are running there full speed pushed by our leadership to get results fast and who really cares what would come tomorrow.

Fast-forward some 20 years, and let's imagine a bright world when AI is nearly perfect (yeah, let's be realistic, it won't be perfect-perfect). Would you fly a plane with 100% software written by AI, and at best supervised by a human that has shallow understanding how software works, or not supervised at all? Even much less skilled human in the loop has one thing AI doesn't have: a moral compass. Human understands that the consequences of bad decision here are lives, and I do not see how would it be possible to pass this understanding to machine (no, there is no such formula or NN node connection weights). Ok, not all humans have that either... But at least they can be prosecuted for criminal negligence. Who would be prosecuted if the plane falls? Who is morally responsible?

So, should we stop using AI at all? Obviously we shouldn't. The performance boost is so drastic that it would be a crime. But at least make sure that you understand every single line of code that has your name attached to. One of the personal self-checks that I have when I reviewing generated code is to give an honest answer to a simple question: "if I discard the proposed change now, will I be able to write the same functionality myself fast and with minimal research?" (*honest* part is really important). If no, that is a no-go, and a good sign that it is a time to roll up the sleeves and get your hands dirty.

I also really liked the Mitchell Hashimoto's idea from his [AI Adoption journey](https://mitchellh.com/writing/my-ai-adoption-journey) where he keeps agents running for some tasks, while he also keeps working on some features old-school without AI help, so that he can still understand and reason about the system he's building.
  
P.S. The analogy with assembly and high-level languages does not work here as compilation/interpretation is a deterministic task. It can be mathematically proven, and if run 1000 times with the same compiler options, we would always get the same result. So, I can rely on the compiler to be correct and do not mess too much with low level understanding (though that is never a bad thing either).