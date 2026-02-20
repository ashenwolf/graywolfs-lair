---
title: Things I've Learnt from the Best Software Engineer I Have Ever Met. Part 2
date: 2023-09-01
tags:
  - software-engineering
lang: en
draft: false
description:
category: software-engineering
image: /assets/images/2023/08/20260220195449.png
---
Here is the second part of the useful insights I had got from my colleague and friend Max. You can check the [first part](Things%20I’ve%20Learnt%20from%20the%20Best%20Software%20Engineer%20I%20Have%20Ever%20Met%20-%20Part%201.md) that is focused on individual productivity.

These upcoming reflections might seem disjointed, perhaps even conflicting at first glance, but they’re not.

![](../../../../assets/images/2023/08/20260220223356.png)
### Focus on the Right Problems

All the brilliance in engineering can go to waste if directed at the wrong problem. Although this sentiment is commonly known, it’s striking how many engineers seem indifferent to understanding the business context of their work. This disconnect is especially pronounced in outsourcing firms without accessible business stakeholders, but it’s also prevalent in vast product companies — including the likes of FAANG — where technical teams can become siloed from business, and connected only through intermediaries.

Max was considered a huge pain in the ass by many managers because he refused to work on anything, unless the person who brought him a task or feature to implement could explain why we need to spend time developing it. Needless to say that most natural argumentation “Because I told you so”, never worked. This approach of challenging everything was quite irritating, however in retrospective I realise that it was a great exercise that helped us to reach clarity on the problem domain. If neither me, nor our analysts could answer those questions (and as you can imagine, it happened a lot), we would get back to customers and make sure those topics are covered. When Max was satisfied with answers he would agree to put the feature or task into the backlog.

> **Anecdote.** A pivotal figure from our client’s team once departed, causing a considerable knowledge void on the customer side. However, our team (which was kind of semi-outsourcing), managed to fill in the blanks that the company had, reconstruct and enhance the product vision, kept it going for years, and it is still in use 10 years after. It would be impossible without in-depth understanding of business.

So, **if the purpose behind an implementation is murky, best to reconsider the task**. Misdirected software can burden a team, drawing resources without delivering tangible advantages.

This principle is difficult to follow, and to be honest, I am not as uncompromising as Max at following it. Also, it will not make you the most popular person in the room, but it will make you the most useful one. And it will pay off in the long term.

### Missing the Mark Doesn’t Mean Total Loss

Although it’s essential to pursue the right goals, not hitting them doesn’t render our efforts worthless. Even if a project fails to deliver business value, the experience and experimentation — especially with unfamiliar architectures or technologies — holds immense worth.

Max was a champion at trying many novel ideas, when working on any projects. As our team was dwarfed by our potential competitors, we were bound to punch well above our weight, incorporating measured risks. Some of those were quite crazy, and, obviously, not all of them worked. Or, to be fair, they did not always work in a way that was designed, or took longer to pay off. That is small, but important distinction. When we, developers, try an idea, and it does not work as expected, we are so overwhelmed with frustration, that we overlook the good parts this idea brought. Those parts are often unexpected and unplanned, so it requires an effort to acknowledge them.

Max seems to have never been upset with failures: he always spotted the good parts, picked them, and enhanced them when working on the next projects. He used to say that “**Embrace failures. They’re opportunities in disguise. Even if the primary intention fails, we might stumble upon something groundbreaking.**” In the same manner as x-rays and microwave oven were. Or maybe you simply have ran into a case, where this idea is not optimal, but it may still be good enough in some other context, so don’t bury it for good. And even if there are no breakthroughs discovered, the experience itself is valuable.

### Develop Your Own Toolbox

Another mantra I’ve hear from Max was that “**Exceptional teams invariably produce tools as side effects of their endeavors.”** The “tools” here is a generic term. It can be everything: an automation script, your own CLI tools, a software library, or even a full-blown service or application. Of course, there is a number of things already developed, and you don’t want to reinvent the wheel and fall into the “not invented here” thinking. However, if you are working in a specific problem domain for long, you would usually notice an incredible amount of repetitive tasks that beg for automation, or the fact that you spend more and more time tuning the “industry standard” generic solution to work for your use case.

In practice we ended up creating a bunch of things that helped us in daily work: code generators (it might be a bit obsolete now as we have ChatGPT), a bunch of tools to preview inputs and outputs for our software that could not be covered by automated testing, rapid prototyping environments, and many more.

If we think bigger, we can invent the whole new things, that could be abstracted, cleaned up, and even become separate product on their own. Many tools that we used right now, originated as internal ones to solve a particular issue of a certain team, not a thing to be used by millions people worldwide. Just to name a few:

- React was born as a tool [to solve struggles of Facebook front-end developers with cascading updates for Facebook Ads app](https://blog.risingstack.com/the-history-of-react-js-on-a-timeline/). As you can imagine it was not the only front-end JavaScript framework back at a time (and I am not talking about jQuery here), yet the dev team saw that they are not good enough to solve their particular challenges.
- AWS [was born to solve Amazon’s struggles in scaling engineering operations](https://techcrunch.com/2016/07/02/andy-jassys-brief-history-of-the-genesis-of-aws/), and wasn’t even intended as a service available for external clients. Moreover, when it was launched publicly, the interest in the platform was unexpected even for Amazon itself. As AWS CEO Adam Selipsky mentioned in [one of the talks](https://www.youtube.com/watch?v=6PiyzyWXiIk&t=300s&ab_channel=USIEvents), Amazon was developing what became AWS for years before they realised, that they are now in Cloud Computing business.

I’m not suggesting churning out React-like applications routinely, but even modest tools tailored to your team’s needs can prove invaluable. Additionally, these smaller endeavours offer the ideal environment to experiment with new technologies or concepts, allowing room for error without catastrophic consequences.

![](../../../../assets/images/2023/08/20260220223431.png)

### Code for the Exceptional, Not the Average

That is probably the most controversial topic. The prevailing wisdom is to write understandable code. I agree with that (kind of). However, “understandable” is not the same as “easy” or “common”. Yet, for some reason many people think that if they write something that can be understood by a primary schooler is a “good code”. It is not. It is quite the opposite. By writing code in that way we are not only loosing the opportunity to write a compact and clean code, but also deprive others the need and opportunity to learn and grow. If they keep doing the same thing for 10 years, they are not learning, but mastering. Mastering is an important activity too, but it would never lead you to any breakthroughs.

Since Max appeared on our team he was known to have a specific views on problem solving. If I remember correctly he was the one who started actively using functional programming concepts on the real-world production project. That’s actually how we became quite close: while everyone on the team thought it was far-reaching, I was excited and perceived it as a great opportunity to boost my skills, and learn something new from a person who has hands on experience. Was it difficult at first? Sure. Was it worth it? Definitely yes. Often while reading some lines of code I had to go and check books or documentation. You don’t get it first, but then, when you finally understand, you’re like “Wow! That’s smart!”, and ta-daa: there is another tool in your engineering toolbox.

> **Anecdote.** Max’s teaching style resembled throwing a kitten into a river — sink or swim. One colleague, initially overwhelmed, later compared revisiting Max’s project to “reading Goethe poetry.” She said it was a revelation, a world apart from other work she had tackled. However, it took some effort to grow to that level, and experience other projects that were written in a more common fashion.

So, my advice: **Leverage methods you deem fit and encourage peers to elevate their skill set**. Whether it’s adopting idiomatic code for your stack, integrating concepts from other paradigms, or even venturing into low-level optimizations, strive to elevate the standard rather than conforming to it.

If you liked it, the other parts of these series: [Part 1](Things%20I’ve%20Learnt%20from%20the%20Best%20Software%20Engineer%20I%20Have%20Ever%20Met%20-%20Part%201.md) and [Part 3](Things%20I’ve%20Learnt%20from%20the%20Best%20Software%20Engineer%20I%20Have%20Ever%20Met%20-%20Part%203.md).