---
title: "Things I’ve Learnt from the Best Software Engineer I Have Ever Met: Part 1"
date: 2023-08-10
tags:
  - software-engineering
  - engineering
lang: en
draft: false
description: Tips to maximize personal productivity
category: software-engineering
image: /assets/images/2023/08/20260220195449.png
---
A few months ago I have lost a dear friend, a former colleague, and the best software engineer I have met. So I wanted to honor his memory by sharing a few professional insights that helped me to become a better engineer and I hope you find those useful too.

### Maximize Individual Performance

Improving individual productivity for software engineers offers a multitude of benefits. It often leads to quicker problem-solving, and anticipates future challenges. Contrary to popular belief, this enhancement in productivity is usually not the result of single major change or breakthrough. Instead, it often comes from a collection of small adjustments and improvements that synergistically contribute to the whole. With each small change building upon the others to create a significant overall impact and here are a few ideas that I have learnt from Max.


![](/assets/images/2023/08/1_bTLnen9xpQuiaXRAPs2igw.gif)
### Mastering the Tools of the Trade: The Keyboard

One of the things that I have noticed is that he always started his working day with a keyboard training app. Just about 10–15 minutes, but every day. The reason behind that is that the speed and correctness of typing is a bottleneck for your productivity. It seems to be minor one, and as such is often overlooked. However, if you pay attention, people either look at the keyboard when typing really fast (increasing the chance of missed typos), or type blindly, but slower, often make mistakes, and correct those all the time. You may see it rather often during online workshops when presenter is sharing the screen: a substantial amount of time is spent correcting the typos in the code. Also, whenever you make a correction, you are getting distracted as your mind briefly switches contexts to fix a typo, and some small, but important details of the problem may slip away from your mind. Hence, **mastering the keyboard**, your second main tool as a software engineer, is crucial. There is a number of tools out there that can help you with that. I use [Keybr](https://www.keybr.com/), for example.

_Max even used a Dvorak keyboard layout instead of the traditional “QWERTY” to squeeze even more performance, but I am not geeky enough and stick to the traditional one._


![](/assets/images/2023/08/1_SpQgK985lWvYzEJAXubhMA.gif)
### Training the Mind: A Software Engineer’s Prime Tool

The primary tool of a software engineer is, of course, the brain. A trained brain, or intuition, enables quicker solutions and anticipates problems before users spot them. Intuition is not usually among the skills that would be listed in a job posting for a software engineer, yet it is one of the top contributors to your productivity. Naturally, it comes with experience, but it is also possible to give yourself a small boost in its development.

For those interested in training their intuition and creativity, the book [**“Pragmatic Thinking and Learning: Refactor Your Wetware”**](https://www.amazon.com/Pragmatic-Thinking-Learning-Refactor-Programmers-ebook/dp/B00A32NYYE/) by Andrew Hunt, co-author of the famous [**“The Pragmatic Programmer: From Journeyman to Master”**](https://www.amazon.com/Pragmatic-Programmer-Journeyman-Master-ebook/dp/B003GCTQAE), offers many valuable insights. This book is about training the creative and intuitive part of your brain, but also teaches how to validate your ideas and fight cognitive biases. You cannot follow the intuition blindly!

Additionally, common practices can indirectly foster creativity:

- Creative Arts: Drawing, painting, playing musical instruments, or any other form of artistic expression can help engage your imagination and spatial reasoning.
- Mind Mapping: This brainstorming technique can help you see connections between disparate ideas and foster creativity.
- Puzzles and Games: Activities like solving puzzles (such as jigsaws or sudoku) or playing spatially challenging games like chess can enhance your spatial and pattern recognition skills.
- Physical Exercise: Engaging in activities that require hand-eye coordination, balance, and spatial awareness, such as dancing, martial arts, or team sports, can stimulate various cognitive functions.
- Learning a New Language: Understanding the nuances and cultural context of another language can help you think more flexibly and creatively.
- Writing: Whether it’s keeping a journal, writing fiction, or even composing poetry, putting your thoughts and feelings into words can foster creativity and reflective thinking.


![](/assets/images/2023/08/1_J-1MC3QGbIuwq4tb-yr-iA.webp)
### Shorten the Feedback Loop

Another way to significantly increase your productivity is by shortening the feedback loop from whatever you implement. Back in the old days we worked with computational geometry and 3D visualisations, and thus we have used C++ heavily. The feedback loop in C++ was disastrously long as a tiny one-line change in formula, or some coefficients of a polynomial would trigger a rebuild, and it would take a few minutes at best. Then you would need to rerun the whole application, load the case file and it would take another few minutes. In the end, our whole day could consist of chunks of 1–2 minute editing and 10 minute waiting to properly test it (and no, unit tests would not help as we needed to test the behaviour of the real-time movement operations in 3D).

Nowadays, software engineering made a huge leap forward and we often have some kind of hot reloads that can minimise the time needed to see the effect of the change in the code. We can also use unit-tests to test separate functions, but it is not very efficient when doing exploratory development, or when you need to visually confirm the effect of the change. There are also cases when some things can be tested only by deploying to cloud which can easily take half of an hour or more. Or we may lose the state within the running SPA application after the hot reload on the frontend site.

One of the first things Max invested on pretty much every project is to shorten this feedback cycle. Usually, he took some runtime that had REPL capabilities and integrated it into the native C++ runtime, enabling development team to do magical things on the running system (somewhat close to the famous talk [“Inventing on a principle”](https://www.youtube.com/watch?v=8QiPFmIMxFc) by Bret Victor, but within our problem domain). While it has significant benefits, it requires a senior engineer that understands the interoperation between different stacks to build such a system, and it will not be suitable (and probably even not feasible) for majority of the projects and teams. The good news is that in most of the cases you won’t need to go as far to beat the average productivity.

If you still need a half an hour deployment to cloud to test something, invest time to make it testable from dev. It may be challenging, because it would work well only when you have a proper level of modularity (yes, yes: low coupling and high cohesion). But even if it is a complicated thing to implement, and you spend a week doing so, this investment would return within a month or two.

If your runtime allows, I highly recommend to harness the power of the REPL if you already use stacks that are capable of that (e.g. Python, C#/F#, Scala, Clojure, etc). You would be amazed how fast you can move if you can incrementally develop separate functions, or even modules without (re-)starting the whole app.

_It may also be useful when working with data as you may try to use tools like Jupyter notebook to iteratively write the ETL pipelines before deploying the whole pipeline._

Many modern code editors already have capabilities to send selected lines of code to REPL via a hot-key, so you can use a normal file as a playground to execute various stuff. Look at this [cool video](https://www.youtube.com/watch?v=5PdYmhS48NE) from 12 years ago where we have a plain old Visual Studio converted to the math toolbox without using anythong but FSharp interactive console (which is just a REPL).

However, using REPL to move fast does not mean that you are expected to stop writing tests, or sacrifice the modularity. In [this article](https://blog.cleancoder.com/uncle-bob/2020/05/27/ReplDrivenDesign.html) Uncle Bob blames REPL for him not writing a test at all, but actually [those things are not mutually exclusive](https://medium.com/codex/test-driven-vs-repl-driven-development-809d3c7a681). Moreover, working on the real data allows you to test the success scenarios, and spot some real-world exceptions. Yet, it does not mean that an engineer now can ignore the corner cases, and skip mocking and testing those, and just rely on the fact that no-one breaks it afterwards, right?

Increasing individual performance is about paying attention to the overlooked details and making incremental improvements. Whether it’s mastering the keyboard, nurturing the mind, or optimising the development feedback loop, these strategies collectively contribute to a more productive and satisfying work experience. The journey to enhanced productivity is filled with experimentation and continuous learning, and the insights shared here may offer a valuable starting point on this path.

If you liked it, the other parts of these series:  [Part 2](Things%20I've%20Learnt%20from%20the%20Best%20Software%20Engineer%20I%20Have%20Ever%20Met%20-%20Part%202.md) and [Part 3](Things%20I’ve%20Learnt%20from%20the%20Best%20Software%20Engineer%20I%20Have%20Ever%20Met%20-%20Part%203.md).