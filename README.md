# SiteFresh - We Don't Design Websites. We Engineer Them for AI Search.

AI search engineering service that delivers AI-search-optimized websites for small businesses. $299 one-time, no subscription required, no hosting lock-in.

## What's in this repo

- `index.html` - the main landing page (self-contained, inline CSS/JS, JSON-LD, chat widget)
- `whitepaper.md` - "AI Search: Why Your Website Needs to Change" white paper (markdown source)
- `whitepaper.html` - polished HTML version of the white paper
- `designs/` - 6 visual design approaches (cinematic, glass, editorial, neon, organic, architect)
- `knowledge-base.yaml` - the single source of truth (business info, services, FAQ)
- `schema.jsonld` - auto-generated JSON-LD (ProfessionalService + FAQPage + Organization + BreadcrumbList)
- `robots.txt` - allows all crawlers, points to sitemap
- `sitemap.xml` - single URL entry for sitefresh.co

## Architecture

One YAML file → three renderings:
1. **Landing page** - the human-facing surface
2. **Chat widget** - local-first FAQ search (zero network calls, token-overlap matching)
3. **JSON-LD schema** - the AI-search-facing surface (Google SGE, ChatGPT search, Perplexity)

## Deploy

Static files - deploy to Vercel, Netlify, GitHub Pages, or any static host.

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Or just open index.html in a browser
```

## Related tools (separate repos)

- `sitefresh-audit/` - AI Search Audit tool (scores any website 0-100)
- `sitefresh-prospect/` - Prospecting pipeline (scrape → audit → prototype → email)

## License

Proprietary · © 2026 SiteFresh
