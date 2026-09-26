# Video 3 Script: "What is JSON-LD structured data and why does it matter for AI search?"
## SiteFresh YouTube Channel · ~8-10 minutes

---

## COLD OPEN (0:00 - 0:15)

[Camera on, talking head]

JSON-LD.

Three letters and a hyphen that most business owners have never heard of. But it's the single most important thing on your website if you want to show up when customers ask AI about your business.

Let me explain what it is, why it matters, and how to check if your site has it.

---

## SECTION 1: The concept (0:15 - 2:00)

[Screen share: simple visual - two versions of a website]

Think of it this way. Your website has two audiences. One is human. One is machine.

The human audience sees your design, your photos, your text, your layout. They read it with their eyes and understand it because humans are good at understanding context.

The machine audience is the AI. ChatGPT. Google AI Overviews. Perplexity. Microsoft Copilot. They don't see your design. They don't look at your photos. They read your HTML - the raw code - and try to understand what your business is, what you do, and what questions you can answer.

The problem is that most HTML is written for humans. It says "Welcome to Smith Roofing!" in a big heading. It shows a photo of a roof. It has a contact form. A human understands "this is a roofing company in Duluth." But the machine just sees HTML tags and text content. It can't tell if "Smith Roofing" is a business name, a product, or a random phrase.

JSON-LD fixes this. It's a structured label - a machine-readable tag - that explicitly says: "This is a LocalBusiness. Its name is Smith Roofing. It's located in Duluth, Minnesota. Its phone number is this. It offers these services. Its customers ask these questions."

The AI reads that label and understands your business instantly. Without it, it's guessing. And when the AI guesses wrong, it doesn't recommend you.

---

## SECTION 2: Show what it looks like (2:00 - 4:30)

[Screen share: open a site with schema, open DevTools]

Let me show you what it actually looks like. I'm going to open a website we built - this is sitefresh.co - and show you the structured data.

[Open sitefresh.co, right-click, View Source, or open DevTools]

If I search the source code for "application/ld+json"...

[Ctrl+F, search for "ld+json"]

Here it is. This is JSON-LD structured data. Let me read through it.

[Scroll through the schema]

This first block says "@type": "Organization". It says our name is SiteFresh. It gives our URL. It describes what we do.

The next block says "@type": "ProfessionalService". It includes our price range, our area served, our opening hours.

Then there's a "@type": "FAQPage" - this is the one that matters most for AI search. It has 20 question-and-answer pairs. Each one is a question a customer might ask: "What exactly do you do?" "How much does it cost?" "How long does it take?" And each one has a structured answer.

When someone asks ChatGPT "how much does a SiteFresh website cost?" - the AI reads this FAQ schema, finds the answer ($299 one-time), and cites us. If this schema didn't exist, the AI would either not answer or answer from some other source.

Now let me show you what a typical small business site looks like.

[Open a typical small business site, View Source]

Same search. "ld+json"...

[Ctrl+F, search for "ld+json"]

Nothing. No structured data at all. The AI can read the text on this page, but it can't understand the structure. It doesn't know what's a business name, what's a service, what's a price, what's a question. It's just a wall of HTML.

---

## SECTION 3: The 5 schema types that matter (4:30 - 6:30)

[Camera on, or screen share with a list]

There are hundreds of schema types on schema.org. But for a small business, five matter most:

**1. LocalBusiness** - tells the AI you're a business, where you're located, your phone, your hours, your price range. This is the foundation. Without it, the AI doesn't know you exist as a business.

**2. FAQPage** - question-and-answer pairs. This is the one AI cites most. When a customer asks the same question that's in your FAQ schema, the AI pulls your answer. This is how you go from invisible to "the answer."

**3. Organization** - tells the AI who you are, your logo, your contact info, your social profiles. This is what shows up when the AI mentions your brand name.

**4. BreadcrumbList** - tells the AI how your site is organized. What page is the homepage, what page is the services page, what page is the contact page. Helps the AI navigate your content.

**5. OfferCatalog or Offer** - if you sell services or products, this tells the AI what you sell and what it costs. When someone asks "how much does [your service] cost in [your city]?" - this is what the AI cites.

If your site has these five, you're ahead of ninety percent of small business websites. Most have zero.

---

## SECTION 4: How to check your site (6:30 - 7:30)

[Screen share: sitefresh.co/audit]

Here's how to check your site right now. Go to sitefresh.co/audit. Type in your URL. It'll tell you exactly which schema types you have and which you're missing.

[Type in a URL, show the audit running]

It scores you across seven categories. If you see a lot of red - you're not alone. Most small business sites score below 50 out of 100.

The good news is it's all fixable. This isn't a design problem. It's a data problem. You just need to add the structured data.

---

## CTA (7:30 - 8:00)

[Back to camera]

So that's JSON-LD. It's the label that tells AI what your business is. Without it, you're invisible to AI search. With it, you're the answer.

Go to sitefresh.co/audit. Check your site. It's free.

And if you want us to fix it for you - $299, one time, five days. We add all the structured data, FAQ schema, semantic HTML, and a chat widget. You own the files.

Subscribe for more on how AI search works and how to make it work for you. See you in the next one.

---

## END SCREEN
[SiteFresh logo, sitefresh.co, "Subscribe for AI search strategy"]
