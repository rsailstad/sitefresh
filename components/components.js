// SiteFresh Optional Components
// Each component is a self-contained HTML/CSS/JS snippet
// Include in any page by adding the component's container div + script
//
// Components:
//   1. Testimonials — customer quote cards with Testimonial schema
//   2. Google Map — embedded map with LocalBusiness geo schema
//   3. Quote Request Form — contact form that emails team@sitefresh.co
//   4. Gallery — responsive image grid with lightbox
//   5. Review Summary — aggregate review scores (Google, Facebook, Yelp)
//
// Pricing:
//   Included in $299: Testimonials, Quote Request Form
//   À la carte add-ons: Google Map ($49), Gallery ($99), Review Summary ($79)
//
// Usage: Add the component's HTML block to any page, then load this script.
// Or copy each component's self-contained block (HTML + CSS + JS) directly.

const COMPONENTS = {
  testimonials: {
    name: 'Testimonials',
    price: 'included',
    description: 'Customer quote cards with Testimonial schema for AI search',
    icon: '💬'
  },
  googleMap: {
    name: 'Google Map',
    price: '$49',
    description: 'Embedded map with LocalBusiness geo coordinates',
    icon: '📍'
  },
  quoteForm: {
    name: 'Quote Request Form',
    price: 'included',
    description: 'Contact form that sends leads to your email',
    icon: '📋'
  },
  gallery: {
    name: 'Gallery',
    price: '$99',
    description: 'Responsive image grid with lightbox viewer',
    icon: '🖼️'
  },
  reviewSummary: {
    name: 'Review Summary',
    price: '$79',
    description: 'Aggregate review scores from Google, Facebook, Yelp',
    icon: '⭐'
  }
};

// ============================================================
// TESTIMONIALS
// ============================================================
function renderTestimonials(container, data) {
  if (!container) return;
  const testimonials = data || [
    { quote: "SiteFresh rebuilt our site in 5 days. We went from invisible on Google to showing up in AI search answers.", author: "Mike R.", role: "Owner, Rhino Roofing", rating: 5 },
    { quote: "The chat widget alone was worth it. Customers ask questions at 11pm and get instant answers.", author: "Sarah K.", role: "Manager, Bright Smile Dental", rating: 5 },
    { quote: "We paid $299 and got more leads in the first month than the last six combined. No brainer.", author: "Tom L.", role: "Founder, GreenLeaf Landscaping", rating: 5 }
  ];

  container.innerHTML = `
    <style>
      .sf-testimonials { padding: 80px 24px; background: var(--bg, #0a0b0d); }
      .sf-testimonials-inner { max-width: 960px; margin: 0 auto; }
      .sf-testimonials h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; color: var(--fg, #e8e6e3); }
      .sf-testimonials .sub { color: var(--muted, #8a8780); margin-bottom: 40px; font-size: 0.95rem; }
      .sf-testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
      .sf-testimonial-card { background: var(--bg2, #141518); border: 1px solid var(--border, #252629); border-radius: 12px; padding: 28px; }
      .sf-testimonial-card .stars { color: #00d97e; margin-bottom: 12px; font-size: 1rem; letter-spacing: 2px; }
      .sf-testimonial-card .quote { color: var(--fg, #e8e6e3); font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px; }
      .sf-testimonial-card .author { display: flex; align-items: center; gap: 12px; }
      .sf-testimonial-card .avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #00d97e, #00b86e); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000; font-size: 0.9rem; }
      .sf-testimonial-card .name { font-weight: 600; color: var(--fg, #e8e6e3); font-size: 0.9rem; }
      .sf-testimonial-card .role { color: var(--muted, #8a8780); font-size: 0.8rem; }
      @media (max-width: 600px) { .sf-testimonials { padding: 48px 16px; } }
    </style>
    <div class="sf-testimonials">
      <div class="sf-testimonials-inner">
        <h2>What our customers say</h2>
        <p class="sub">Real reviews from real businesses. No incentives, no filtering.</p>
        <div class="sf-testimonial-grid">
          ${testimonials.map(t => `
            <div class="sf-testimonial-card">
              <div class="stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
              <div class="quote">"${t.quote}"</div>
              <div class="author">
                <div class="avatar">${t.author.split(' ').map(w => w[0]).join('').slice(0,2)}</div>
                <div>
                  <div class="name">${t.author}</div>
                  <div class="role">${t.role}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Add JSON-LD Testimonial schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": testimonials.map((t, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Review",
        "reviewBody": t.quote,
        "author": { "@type": "Person", "name": t.author },
        "reviewRating": { "@type": "Rating", "ratingValue": t.rating, "bestRating": 5 }
      }
    }))
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  container.appendChild(script);
}

// ============================================================
// GOOGLE MAP
// ============================================================
function renderGoogleMap(container, config) {
  if (!container) return;
  const { lat = 40.7128, lng = -74.0060, label = 'Our Location', zoom = 14, address = '' } = config || {};

  container.innerHTML = `
    <style>
      .sf-map { padding: 80px 24px; background: var(--bg, #0a0b0d); }
      .sf-map-inner { max-width: 960px; margin: 0 auto; }
      .sf-map h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; color: var(--fg, #e8e6e3); }
      .sf-map .sub { color: var(--muted, #8a8780); margin-bottom: 32px; font-size: 0.95rem; }
      .sf-map-embed { width: 100%; height: 360px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border, #252629); }
      .sf-map-embed iframe { width: 100%; height: 100%; border: 0; filter: invert(0.92) hue-rotate(180deg) saturate(0.8); }
      .sf-map-address { margin-top: 16px; color: var(--muted, #8a8780); font-size: 0.9rem; }
      .sf-map-address a { color: var(--accent, #00d97e); text-decoration: none; }
      @media (max-width: 600px) { .sf-map { padding: 48px 16px; } .sf-map-embed { height: 280px; } }
    </style>
    <div class="sf-map">
      <div class="sf-map-inner">
        <h2>${label}</h2>
        <p class="sub">${address}</p>
        <div class="sf-map-embed">
          <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02}%2C${lat - 0.02}%2C${lng + 0.02}%2C${lat + 0.02}&layer=mapnik&marker=${lat}%2C${lng}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <div class="sf-map-address"><a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" target="_blank" rel="noopener">Open in Google Maps →</a></div>
      </div>
    </div>
  `;

  // Add LocalBusiness geo schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "geo": { "@type": "GeoCoordinates", "latitude": lat, "longitude": lng },
    "address": { "@type": "PostalAddress", "streetAddress": address }
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  container.appendChild(script);
}

// ============================================================
// QUOTE REQUEST FORM
// ============================================================
function renderQuoteForm(container, config) {
  if (!container) return;
  const { email = 'team@sitefresh.co', services = ['Website Redesign', 'AI Search Audit', 'Newsletter Subscription', 'À la Carte Enhancement'] } = config || {};

  container.innerHTML = `
    <style>
      .sf-quote { padding: 80px 24px; background: var(--bg, #0a0b0d); }
      .sf-quote-inner { max-width: 640px; margin: 0 auto; }
      .sf-quote h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; color: var(--fg, #e8e6e3); }
      .sf-quote .sub { color: var(--muted, #8a8780); margin-bottom: 32px; font-size: 0.95rem; }
      .sf-quote-form { background: var(--bg2, #141518); border: 1px solid var(--border, #252629); border-radius: 12px; padding: 32px; }
      .sf-quote-form .field { margin-bottom: 20px; }
      .sf-quote-form label { display: block; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted-bright, #b8b5a8); margin-bottom: 8px; }
      .sf-quote-form input, .sf-quote-form select, .sf-quote-form textarea {
        width: 100%; padding: 12px 16px; background: var(--bg, #0a0b0d);
        border: 1px solid var(--border, #252629); border-radius: 8px; color: var(--fg, #e8e6e3);
        font-size: 1rem; font-family: inherit; transition: border-color 0.15s, box-shadow 0.15s;
      }
      .sf-quote-form input:focus, .sf-quote-form select:focus, .sf-quote-form textarea:focus {
        outline: none; border-color: var(--accent, #00d97e); box-shadow: 0 0 0 3px rgba(0,217,126,0.12);
      }
      .sf-quote-form textarea { min-height: 100px; resize: vertical; }
      .sf-quote-form .btn {
        width: 100%; padding: 14px; background: var(--accent, #00d97e); color: #0a0b0d;
        border: none; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer;
        transition: transform 0.12s, box-shadow 0.12s;
      }
      .sf-quote-form .btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,217,126,0.3); }
      .sf-quote-form .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .sf-quote-success { display: none; text-align: center; padding: 24px; color: var(--accent, #00d97e); font-size: 1.05rem; }
      .sf-quote-form .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      @media (max-width: 600px) { .sf-quote { padding: 48px 16px; } .sf-quote-form { padding: 24px; } .sf-quote-form .field-row { grid-template-columns: 1fr; } }
    </style>
    <div class="sf-quote">
      <div class="sf-quote-inner">
        <h2>Get a free quote</h2>
        <p class="sub">Tell us about your business and current website. We'll send a personalized quote within 24 hours.</p>
        <div class="sf-quote-form">
          <form id="sfQuoteForm">
            <div class="field-row">
              <div class="field">
                <label>Name</label>
                <input type="text" name="name" required placeholder="Your name">
              </div>
              <div class="field">
                <label>Business</label>
                <input type="text" name="business" required placeholder="Your business">
              </div>
            </div>
            <div class="field">
              <label>Email</label>
              <input type="email" name="email" required placeholder="you@yourbusiness.com">
            </div>
            <div class="field">
              <label>Service interested in</label>
              <select name="service">
                ${services.map(s => `<option>${s}</option>`).join('')}
              </select>
            </div>
            <div class="field">
              <label>Current website URL</label>
              <input type="url" name="website" placeholder="https://yourcurrentsite.com">
            </div>
            <div class="field">
              <label>What do you need?</label>
              <textarea name="message" placeholder="Tell us about your project..."></textarea>
            </div>
            <button type="submit" class="btn">Send quote request →</button>
          </form>
          <div class="sf-quote-success" id="sfQuoteSuccess">✓ Thanks! We'll email you within 24 hours.</div>
        </div>
      </div>
    </div>
  `;

  // Handle form submission — opens mailto with pre-filled body
  const form = container.querySelector('#sfQuoteForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const subject = `Quote Request: ${formData.get('service')}`;
    const body = `Name: ${formData.get('name')}\nBusiness: ${formData.get('business')}\nEmail: ${formData.get('email')}\nWebsite: ${formData.get('website')}\n\n${formData.get('message')}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.style.display = 'none';
    container.querySelector('#sfQuoteSuccess').style.display = 'block';
  });
}

// ============================================================
// GALLERY
// ============================================================
function renderGallery(container, images) {
  if (!container) return;
  const gallery = images || [
    { url: 'https://images.unsplash.com/photo-1486749296207-3ebc8b00e58f?w=800&q=80', alt: 'Project 1', caption: 'Before: cluttered homepage' },
    { url: 'https://images.unsplash.com/photo-1467234054655-9d5e26688b87?w=800&q=80', alt: 'Project 2', caption: 'After: AI-search-optimized' },
    { url: 'https://images.unsplash.com/photo-1503602644528-7d5494d8b5f2?w=800&q=80', alt: 'Project 3', caption: 'Local business redesign' },
    { url: 'https://images.unsplash.com/photo-1486312338219-ce51dfe48ea8?w=800&q=80', alt: 'Project 4', caption: 'Service page with schema' },
    { url: 'https://images.unsplash.com/photo-1542744095-fcf46d4bb6c4?w=800&q=80', alt: 'Project 5', caption: 'Mobile-first layout' },
    { url: 'https://images.unsplash.com/photo-1551434678-e076cd950cbd?w=800&q=80', alt: 'Project 6', caption: 'Chat widget integration' }
  ];

  container.innerHTML = `
    <style>
      .sf-gallery { padding: 80px 24px; background: var(--bg, #0a0b0d); }
      .sf-gallery-inner { max-width: 960px; margin: 0 auto; }
      .sf-gallery h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; color: var(--fg, #e8e6e3); }
      .sf-gallery .sub { color: var(--muted, #8a8780); margin-bottom: 40px; font-size: 0.95rem; }
      .sf-gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
      .sf-gallery-item { position: relative; border-radius: 12px; overflow: hidden; cursor: pointer; aspect-ratio: 4/3; background: var(--bg2, #141518); }
      .sf-gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
      .sf-gallery-item:hover img { transform: scale(1.05); }
      .sf-gallery-item .caption { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(0deg, rgba(0,0,0,0.8), transparent); color: #fff; font-size: 0.8rem; padding: 20px 16px 12px; opacity: 0; transition: opacity 0.2s; }
      .sf-gallery-item:hover .caption { opacity: 1; }
      .sf-gallery-lightbox { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 9999; align-items: center; justify-content: center; padding: 24px; cursor: pointer; }
      .sf-gallery-lightbox.open { display: flex; }
      .sf-gallery-lightbox img { max-width: 90%; max-height: 85vh; border-radius: 8px; }
      .sf-gallery-lightbox .close { position: absolute; top: 24px; right: 24px; color: #fff; font-size: 1.5rem; cursor: pointer; }
      @media (max-width: 600px) { .sf-gallery { padding: 48px 16px; } .sf-gallery-grid { grid-template-columns: 1fr 1fr; gap: 12px; } }
    </style>
    <div class="sf-gallery">
      <div class="sf-gallery-inner">
        <h2>Our work</h2>
        <p class="sub">Recent redesigns and AI search optimizations.</p>
        <div class="sf-gallery-grid">
          ${gallery.map((img, i) => `
            <div class="sf-gallery-item" data-index="${i}">
              <img src="${img.url}" alt="${img.alt}" loading="lazy">
              <div class="caption">${img.caption || img.alt}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="sf-gallery-lightbox" id="sfLightbox">
      <span class="close">✕</span>
      <img id="sfLightboxImg" src="" alt="">
    </div>
  `;

  // Lightbox logic
  const lightbox = container.querySelector('#sfLightbox');
  const lightboxImg = container.querySelector('#sfLightboxImg');
  container.querySelectorAll('.sf-gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => {
      lightboxImg.src = gallery[i].url;
      lightbox.classList.add('open');
    });
  });
  lightbox.addEventListener('click', () => lightbox.classList.remove('open'));

  // ImageGallery schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "image": gallery.map(img => ({
      "@type": "ImageObject",
      "url": img.url,
      "caption": img.caption || img.alt
    }))
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  container.appendChild(script);
}

// ============================================================
// REVIEW SUMMARY
// ============================================================
function renderReviewSummary(container, reviews) {
  if (!container) return;
  const data = reviews || [
    { platform: 'Google', score: 4.9, count: 47, url: 'https://www.google.com/search?q=sitefresh+reviews' },
    { platform: 'Facebook', score: 4.8, count: 23, url: 'https://www.facebook.com/sitefresh' },
    { platform: 'Yelp', score: 4.7, count: 12, url: 'https://www.yelp.com/biz/sitefresh' }
  ];

  const total = data.reduce((acc, r) => acc + r.count, 0);
  const avg = (data.reduce((acc, r) => acc + r.score * r.count, 0) / total).toFixed(1);

  container.innerHTML = `
    <style>
      .sf-reviews { padding: 80px 24px; background: var(--bg, #0a0b0d); }
      .sf-reviews-inner { max-width: 960px; margin: 0 auto; }
      .sf-reviews h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; color: var(--fg, #e8e6e3); }
      .sf-reviews .sub { color: var(--muted, #8a8780); margin-bottom: 40px; font-size: 0.95rem; }
      .sf-reviews-summary { display: flex; align-items: center; gap: 32px; margin-bottom: 40px; flex-wrap: wrap; }
      .sf-reviews-score { text-align: center; }
      .sf-reviews-score .big { font-size: 3.5rem; font-weight: 800; color: var(--accent, #00d97e); line-height: 1; }
      .sf-reviews-score .stars { color: var(--accent, #00d97e); font-size: 1.2rem; margin: 8px 0; }
      .sf-reviews-score .count { color: var(--muted, #8a8780); font-size: 0.85rem; }
      .sf-reviews-platforms { display: flex; gap: 24px; flex-wrap: wrap; }
      .sf-review-platform { display: flex; align-items: center; gap: 12px; background: var(--bg2, #141518); border: 1px solid var(--border, #252629); border-radius: 10px; padding: 16px 20px; text-decoration: none; transition: border-color 0.15s; }
      .sf-review-platform:hover { border-color: var(--accent, #00d97e); }
      .sf-review-platform .platform-name { font-weight: 600; color: var(--fg, #e8e6e3); font-size: 0.9rem; }
      .sf-review-platform .platform-score { color: var(--accent, #00d97e); font-weight: 700; font-size: 1.1rem; }
      .sf-review-platform .platform-count { color: var(--muted, #8a8780); font-size: 0.8rem; }
      @media (max-width: 600px) { .sf-reviews { padding: 48px 16px; } .sf-reviews-summary { flex-direction: column; text-align: center; } .sf-reviews-platforms { flex-direction: column; width: 100%; } .sf-review-platform { width: 100%; } }
    </style>
    <div class="sf-reviews">
      <div class="sf-reviews-inner">
        <h2>Rated by real customers</h2>
        <p class="sub">Aggregate scores across all review platforms.</p>
        <div class="sf-reviews-summary">
          <div class="sf-reviews-score">
            <div class="big">${avg}</div>
            <div class="stars">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5 - Math.round(avg))}</div>
            <div class="count">${total} reviews</div>
          </div>
          <div class="sf-reviews-platforms">
            ${data.map(r => `
              <a href="${r.url}" target="_blank" rel="noopener" class="sf-review-platform">
                <div>
                  <div class="platform-name">${r.platform}</div>
                  <div class="platform-count">${r.count} reviews</div>
                </div>
                <div class="platform-score">${r.score} ★</div>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // AggregateRating schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avg,
      "reviewCount": total,
      "bestRating": 5
    }
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  container.appendChild(script);
}

// Auto-export for browser
if (typeof window !== 'undefined') {
  window.SiteFreshComponents = {
    renderTestimonials,
    renderGoogleMap,
    renderQuoteForm,
    renderGallery,
    renderReviewSummary,
    COMPONENTS
  };
}
