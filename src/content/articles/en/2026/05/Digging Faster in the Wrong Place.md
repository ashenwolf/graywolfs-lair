---
title: Digging Faster in the Wrong Place
date: 2026-05-12
tags:
  - software-engineering
  - AI
  - LLM
lang: en
draft: false
description: The AI content economy is self-referential. The people posting about 10x productivity are selling courses, not shipping products. Meanwhile, 92,000 engineers lost their jobs this year based on the promise.
category: software-engineering
image: /assets/images/2026/05/2cfec30a-9684-4445-8a02-17300b7e40e1_1153x987.jpg
---
Open LinkedIn on any given Tuesday. Three posts in, someone "replaced their entire engineering team with Claude and saved $200k." By post six, a founder built a full SaaS product over a weekend. By post ten, you're wondering if you've been doing software wrong for the past decade.

But here's the thing I noticed. Look at what these people actually *do*. Click through to their profiles. Check their products. Nine times out of ten, the product IS the post. The thing they shipped is the content about AI. The course. The $997 masterclass. The "AI workflow" template.

They are not showing you a product that solves a business problem. They are teaching you how to use AI -- not how to build the thing. The content is about the tool, never about the output.

This would be fine if it stayed on LinkedIn. Content creators gonna create content. The problem is who's *reading* it.

CTOs and VPs see these posts and do napkin math. "If AI makes engineers 10x productive, I can fire 50% and still get 5x the output. Same budget, five times the result." [Cloudflare cut 1,100 people in May](https://techcrunch.com/2026/05/08/cloudflare-says-ai-made-1100-jobs-obsolete-even-as-revenue-hit-a-record-high/), saying AI made their jobs obsolete -- while posting record revenue. [GM laid off 600 IT workers](https://techcrunch.com/2026/05/11/gm-just-laid-off-hundreds-of-it-workers-to-hire-those-with-stronger-ai-skills/) to "make room for AI-focused backgrounds." [Tech layoffs hit 92,000 in 2026](https://cybernews.com/ai-news/tech-layoffs-ai/) so far. A 33% increase from last year.

Here's what's wild: a [Gartner study from this month](https://fortune.com/2026/05/11/ai-automation-layoffs-gartner-study-roi/) found that 80% of companies that piloted AI reported workforce reductions -- *regardless of whether the technology was actually generating returns*. They're firing people based on the *promise*, not the results.

The 10x productivity claim comes from people selling shovels. And the executives buying those shovels are paying for them with headcount.

So what happens to the engineers who survive the cut?

They use AI. Not because they're excited about it -- because they have no choice. The workload of 100 people doesn't disappear when you fire 50. You just need the remaining 50 to *look* like they're keeping up. AI helps with that. It generates code fast. It generates documentation fast. It generates the *appearance* of progress fast.

I've seen this firsthand. A codebase written predominantly by AI -- tons of code, tons of documentation, looks like a well-functioning system from the outside. But open a file and you can't tell why a function exists. The code is correct -- syntactically, logically -- but it has no *intent*. It's like reading a book translated by someone who speaks the language but has never lived in the country.

And here's the trap: the system incentivizes speed, so you trust AI's judgment instead of diving deep. Every shortcut makes the next shortcut more necessary. Understanding erodes. The codebase grows but comprehension shrinks. It's a ticking bomb.

![Task Failed Successfully](../../../../assets/images/2026/05/dca5b4001b88399f9013259d10a7a129.jpg)

A recent essay called ["Appearing Productive in the Workplace"](https://nooneshappy.com/article/appearing-productive-in-the-workplace/) on the No One's Happy blog put it better than I could:

> "The slowness was not a tax on the real work; the slowness WAS the real work. It was how the work got good, and how the people producing the work got good, and how the firm whose name was on the work could promise the client that what they were buying was a particular kind of thing rather than a generic one."

This is the part the LinkedIn crowd never talks about. The struggle to understand a problem *is* the value. The time spent reading code, breaking things, rebuilding them -- that's not inefficiency. That's how expertise forms. Cut that out and you don't get faster engineers. You get faster typists who can't debug their own systems.

The essay describes a colleague who spent two months building a system with AI. Great deal of code, great deal of documentation, great deal of what looked like progress. He could not, when asked, explain how any of it worked. The schemas were wrong from day one -- obvious to anyone with two years in the field. But management was too invested in the appearance of momentum to want it disturbed.

We are not digging faster. We are digging faster *in the wrong place*. And nobody wants to stop the excavator to check the map.

There's a reason [Linear](https://linear.app) -- 178 people, $100M ARR -- is widely considered a better product than Jira with its army of thousands. DHH wrote about this in [*ReWork*](https://basecamp.com/books/rework): underdo your competitors. Don't build 10 features. Build 2, but nail them.

AI does the opposite. It makes building cheap, so you build everything. Ten features instead of two. Twelve-page requirements docs instead of one. Code to support every possible edge case, because why not -- it only took thirty seconds to generate. The codebase balloons. The product becomes generic. Barely usable by customers, barely maintainable by engineers, barely understandable by anyone.

The hard part of building products was never typing code. It was deciding what *not* to build. AI has no taste for that. And the people firing their teams don't seem to either.

I'm not anti-AI. I use it daily. It's great for prototypes, brainstorming, drafting, getting past a blank page. Nobody serious disputes that it accelerates the path from zero to a working first version.

But a prototype is not a product. A demo is not a business. And a LinkedIn post is not evidence that you can fire half your engineering team.

![Draw the resto of the owl](../../../../assets/images/2026/05/2cfec30a-9684-4445-8a02-17300b7e40e1_1153x987.jpg)
The next time you see "built this in 3 hours with AI" -- ask yourself: is it still running six months later? Does anyone understand how it works? Would you bet your company on it?

The firms still doing the work properly -- slowly, deliberately, with people who understand what they're building -- will be in a position to charge for it. The firms that hollowed themselves out will discover that what they hollowed out was the thing the client was paying for.

P.S. This article was written with AI assistance -- for brainstorming and drafting. I can explain every sentence in it. Can your AI-generated codebase say the same?

## Appendix: References & Data

**Layoffs (Q2 2026):**
- Tech layoffs exceeded 92,000 in 2026 across 98 companies (33% increase YoY) -- [Cybernews](https://cybernews.com/ai-news/tech-layoffs-ai/)
- Cloudflare cut 20% (1,100 people), cited AI -- [TechCrunch](https://techcrunch.com/2026/05/08/cloudflare-says-ai-made-1100-jobs-obsolete-even-as-revenue-hit-a-record-high/)
- GM laid off 600+ IT workers for "AI-focused backgrounds" -- [TechCrunch](https://techcrunch.com/2026/05/11/gm-just-laid-off-hundreds-of-it-workers-to-hire-those-with-stronger-ai-skills/)
- 80% of AI-piloting companies cut workforce regardless of ROI -- [Fortune/Gartner](https://fortune.com/2026/05/11/ai-automation-layoffs-gartner-study-roi/)
- In 2025, companies cited AI in 55,000 job cuts -- 12x from two years prior -- [CBS News](https://www.cbsnews.com/news/ai-layoffs-2026-artificial-intelligence-amazon-pinterest/)

**AI production failure rates:**
- MIT: only 5% of companies saw rapid revenue gains from AI -- [TechSpot](https://www.techspot.com/news/109148-mit-report-95-ai-implementations-dont-increase-profits.html)
- S&P Global: 42% of companies abandoned most AI initiatives in 2025 (up from 17%) -- [CIO Dive](https://www.ciodive.com/news/AI-project-fail-data-SPGlobal/742590/)
- Gartner: 40% of agentic AI projects will be canceled before end of 2027 -- [Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027)
- 90-95% of AI initiatives fail to reach sustained production value -- [NextBuild](https://nextbuild.co/blog/ai-agent-demo-vs-production-failure)
- Columbia University DAPLab: vibe coding gets ~70% of the way, then breaks under real use -- [Columbia CS](https://www.cs.columbia.edu/2026/why-vibe-coding-fails-and-how-to-fix-it/)

**Key articles:**
- "Appearing Productive in the Workplace" -- [No One's Happy](https://nooneshappy.com/article/appearing-productive-in-the-workplace/)
- "Claude Code Is Not Making Your Product Better" -- [Ethan Ding](https://ethanding.substack.com/p/claude-code-is-not-making-your-product)
- "Everyone's Winning at AI" -- [Ilya](https://ilyaem.substack.com/p/everyones-winning-at-ai)
- "AI Made It Easy to Look Like a Builder. Shipping Is Still Hard" -- [HackerNoon](https://hackernoon.com/ai-made-it-easy-to-look-like-a-builder-shipping-is-still-hard)
- "Why Your AI Demo Always Outperforms Your Launch" -- [tianpan.co](https://tianpan.co/blog/2026-04-15-ai-demo-outperforms-launch)

**Books:**
- *ReWork* -- Jason Fried & David Heinemeier Hansson (the "underdo your competitors" concept)
