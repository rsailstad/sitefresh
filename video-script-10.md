# Video 10 Script: "I rebuilt 10 roofing websites for AI search. Here's what was broken."
## SiteFresh YouTube Channel · ~8-12 minutes

---

## COLD OPEN (0:00 - 0:20)

[Camera on, talking head]

Before we built SiteFresh, we ran a prospecting pipeline on ten roofing contractors in Minneapolis.

We audited all ten for AI search visibility. Nine out of ten scored a C or D. The best one scored a B - 50 out of 100. That's still failing.

Then we looked at what was broken. And the same five things were broken on almost every single site. Let me walk through what we found, what it's costing these roofers, and what it would take to fix.

---

## SECTION 1: The audit (0:20 - 2:00)

[Screen share: sitefresh.co/audit, run a live audit]

We used our own AI search audit tool. It's free - sitefresh.co/audit. You type in a URL, it scores the site across seven categories: structured data, FAQ content, semantic HTML, Open Graph, page speed, mobile, and content depth.

We searched for roofers in Minneapolis, found ten independent contractors, and audited all ten.

Here are the scores:

[Show a list of all 10 with scores]

- Ettel and Franz Construction - 54 out of 100, grade C
- Walker Roofing - 50 out of 100, grade C
- Rhino Roofer - 43 out of 100, grade C
- Minneapolis Roofing Experts - 51 out of 100, grade C
- Voyager Roofing - 0 out of 100, grade D (site was unreachable)
- Wright at Home - 79 out of 100, grade B (best of the bunch)
- AmeriPro Roofing - 50 out of 100, grade C
- Apple Roofing - 55 out of 100, grade C
- Minneapolis Roofing Expert - 50 out of 100, grade C
- Sela Roofing - 41 out of 100, grade C

Average score: 47 out of 100. Grade C. That means the AI can sort of read them, but not well enough to recommend them with confidence.

---

## SECTION 2: The five things that were broken (2:00 - 5:00)

[Camera on, or screen share with a checklist]

Here are the five things that were broken on almost every site:

**1. No JSON-LD structured data.** Nine out of ten had zero structured data. No LocalBusiness schema. No Organization schema. No FAQPage schema. The AI literally cannot tell what business this is, what services they offer, or where they're located. It's like having a store with no signage.

**2. No FAQ content.** None of the ten had a FAQ section with question-and-answer pairs. When a homeowner asks ChatGPT "does this roofer handle insurance claims?" or "how long does a roof replacement take?" - the AI can't answer from these sites. There's no FAQ schema to read. It falls back to Angi or HomeAdvisor, which do have FAQ content.

**3. No pricing data.** Not one of the ten roofers had pricing on their website. No "starts at" pricing. No range. No factors that drive cost. When someone asks ChatGPT "how much does a roof cost in Minneapolis?" - the AI cites HomeAdvisor's cost guide, not the roofer's own site. Because the roofer's site doesn't have the answer.

**4. Slow, heavy pages.** Most of these sites loaded 200-400KB of assets. Multiple JavaScript files. Render-blocking scripts. Large images without alt text. The AI crawlers penalize slow sites. A 50KB structured page gets crawled and cited faster than a 300KB bloated page.

**5. No Open Graph or social meta tags.** Six out of ten had no Open Graph tags. When someone shares the roofer's site in a text message or on Facebook, it shows a blank preview with no title, no description, no image. It looks unprofessional and gets fewer clicks.

---

## SECTION 3: What it's costing them (5:00 - 6:30)

[Camera on]

Here's the math on what these gaps are costing a roofing contractor.

A new roof in Minneapolis costs between $8,000 and $25,000. Let's say the average job is $15,000.

A typical roofer gets maybe 30-50% of their leads from online search. The rest comes from referrals and repeat customers.

If a homeowner searches "best roofer in Minneapolis" and asks ChatGPT the same question - and the AI cites Angi or HomeAdvisor instead of the roofer's own site - the homeowner goes to Angi. Angi shows them three roofers. The homeowner picks one. That roofer gets the job.

The roofer whose site the AI couldn't read? They never even knew they were considered. The homeowner never visited their site. The lead went to a competitor who was either on Angi's list or who had structured data the AI could read.

One missed roof. $15,000. Gone. Because the website didn't have structured data.

Now multiply that by the number of homeowners in Minneapolis who search for a roofer every month. It's not one missed job. It's a steady stream of missed jobs.

---

## SECTION 4: What it would take to fix (6:30 - 7:30)

[Screen share: sitefresh.co/get-started]

Here's what we'd fix for each of these ten roofers. Same thing we do for any small business:

**Add LocalBusiness schema.** Name, address, phone, hours, services, service area, price range. The AI instantly knows "this is a roofing contractor in Minneapolis."

**Add FAQ schema with 15-20 questions.** "How much does a roof replacement cost?" "Do you handle insurance claims?" "How long does a roof last in Minnesota?" "What's the warranty on a new roof?" "Do you offer free estimates?" Each one as a structured Q&A pair.

**Add pricing transparency.** A pricing page or section that talks about the factors. Square footage, materials, roof pitch, tear-off vs overlay. A range. Even "most of our projects fall between $12,000 and $18,000" is better than nothing. With OfferCatalog schema so the AI can cite it.

**Add a chat widget.** Local-first, zero API calls. Answers questions from the FAQ data. Captures leads at 2 AM when the homeowner is researching roofers and can't call anyone.

**Optimize page speed.** Under 50KB. No render-blocking scripts. Fast loading on mobile. AI crawlers love it.

All of that. $299. One time. Five business days. You own the files.

The ROI: one roof is $8,000 to $25,000. The redesign is $299. If it brings in one job, it paid for itself thirty times over.

---

## SECTION 5: The best one (7:30 - 8:30)

[Camera on]

Wright at Home scored 79 - the highest of the ten. Why? They had some basic schema, a faster page, and better content structure. They were doing some things right.

But they still didn't have FAQ schema. They still didn't have pricing data. They still didn't have a chat widget. If they added those three things, they'd jump from 79 to 90+.

And here's the thing - they'd be the only roofer in Minneapolis with that score. When someone asks ChatGPT "best roofer in Minneapolis" - the AI would cite them first. Not because they're the best roofer. Because they're the most readable.

That's the opportunity. You don't have to be the best. You have to be the most readable. And most of your competitors aren't readable at all.

---

## CTA (8:30 - 9:00)

[Camera on, sitefresh.co on screen]

So that's what I found. Ten roofers. Nine scoring C or D. The same five things broken on almost all of them. And the fix is $299.

If you're a roofer - or any local service business - go to sitefresh.co/audit. Type in your URL. See your score. It's free and it takes ten seconds.

If you want us to fix it - sitefresh.co/get-started. $299. Five days. You own the files. Full refund if you're not satisfied.

We also audited ten dentists in Columbus. That video is linked in the card up here. Same pattern. Same results. Same fix.

Subscribe for more audits and case studies. See you next time.

---

## END SCREEN
[SiteFresh logo, sitefresh.co, "Subscribe for AI search strategy"]
