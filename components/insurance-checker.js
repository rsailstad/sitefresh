// SiteFresh Insurance Checker Widget
// Local-first: zero API calls, insurance data is a JSON file
// Lead capture: optional email verification sends mailto
// Schema: uses insuranceAccepted in LocalBusiness/Dentist schema
//
// Usage:
//   <div id="sf-insurance-checker"></div>
//   <script src="/components/insurance-checker.js"></script>
//   <script>SiteFreshInsuranceChecker.init('#sf-insurance-checker', {
//     practiceName: 'Powell Village Dental',
//     practiceEmail: 'info@powellvillagedental.com',
//     insurances: ['Delta Dental', 'Cigna', 'Aetna', 'MetLife', 'Guardian', 'United Concordia', 'UnitedHealthcare', 'Humana', 'Blue Cross Blue Shield', 'Medicare', 'Medicaid', 'CareCredit'],
//     cashOnly: false
//   })</script>

const SiteFreshInsuranceChecker = (function () {
  // Common insurance providers for dental practices
  const DEFAULT_INSURANCES = [
    'Delta Dental', 'Cigna', 'Aetna', 'MetLife', 'Guardian',
    'United Concordia', 'UnitedHealthcare', 'Humana',
    'Blue Cross Blue Shield', 'BlueCross BlueShield',
    'Medicare', 'Medicaid', 'CareCredit',
    'Assurant', 'Principality', 'Renaissance Dental',
    'Spirit Dental', 'Dominion Dental', 'Dentegra',
    'GEHA', 'Tricare', 'Lincoln Dental',
  ];

  function init(selector, config) {
    const container = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!container) return;

    const {
      practiceName = 'Our Practice',
      practiceEmail = 'team@sitefresh.co',
      insurances = DEFAULT_INSURANCES,
      cashOnly = false,
      theme: themeOverride = null,
    } = config || {};

    // Build the widget
    container.innerHTML = buildHTML(practiceName, cashOnly);

    // State
    let selectedInsurance = null;
    let selectedPlan = null;

    // Elements
    const searchInput = container.querySelector('.sf-ins-search');
    const resultsDiv = container.querySelector('.sf-ins-results');
    const checkBtn = container.querySelector('.sf-ins-check');
    const statusDiv = container.querySelector('.sf-ins-status');

    // Autocomplete on input
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (query.length < 1) {
        resultsDiv.style.display = 'none';
        return;
      }

      const matches = insurances.filter(ins =>
        ins.toLowerCase().includes(query)
      ).slice(0, 8);

      if (matches.length === 0) {
        resultsDiv.innerHTML = '<div class="sf-ins-result-item sf-ins-not-found">No match found - we may still accept it. Email us to check.</div>';
        resultsDiv.style.display = 'block';
      } else {
        resultsDiv.innerHTML = matches.map(ins =>
          '<div class="sf-ins-result-item" data-insurance="' + escapeAttr(ins) + '">' + escapeHtml(ins) + '</div>'
        ).join('');
        resultsDiv.style.display = 'block';
      }
    });

    // Click to select from dropdown
    resultsDiv.addEventListener('click', (e) => {
      const item = e.target.closest('.sf-ins-result-item');
      if (!item || !item.dataset.insurance) return;
      selectedInsurance = item.dataset.insurance;
      searchInput.value = selectedInsurance;
      resultsDiv.style.display = 'none';
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        resultsDiv.style.display = 'none';
      }
    });

    // Check button
    checkBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (!query) {
        statusDiv.innerHTML = '<div class="sf-ins-status-msg sf-ins-info">Please type your insurance provider name.</div>';
        return;
      }

      const matched = insurances.some(ins =>
        ins.toLowerCase() === query.toLowerCase()
      );

      if (matched || cashOnly) {
        statusDiv.innerHTML = buildAccepted(query, practiceName, practiceEmail, cashOnly);
      } else {
        statusDiv.innerHTML = buildUnknown(query, practiceName, practiceEmail);
      }
    });

    // Enter key on search
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkBtn.click();
      }
    });
  }

  function buildHTML(practiceName, cashOnly) {
    return `
      <style>
        .sf-ins-widget {
          --ins-bg: #0a0b0d;
          --ins-bg2: #141518;
          --ins-bg3: #1c1d20;
          --ins-fg: #e8e6e3;
          --ins-muted: #8a8780;
          --ins-muted-bright: #b8b5a8;
          --ins-accent: #00d97e;
          --ins-border: #252629;
          --ins-radius: 12px;
          --ins-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .sf-ins-widget * { margin: 0; padding: 0; box-sizing: border-box; }
        .sf-ins-widget {
          background: var(--ins-bg);
          font-family: var(--ins-sans);
          color: var(--ins-fg);
          padding: 48px 24px;
          border-radius: var(--ins-radius);
        }
        .sf-ins-inner { max-width: 560px; margin: 0 auto; }
        .sf-ins-header { text-align: center; margin-bottom: 32px; }
        .sf-ins-header h2 {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--ins-fg);
        }
        .sf-ins-header p {
          color: var(--ins-muted);
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .sf-ins-form { position: relative; margin-bottom: 16px; }
        .sf-ins-search-wrap { position: relative; }
        .sf-ins-search {
          width: 100%;
          padding: 16px 20px;
          background: var(--ins-bg2);
          border: 1px solid var(--ins-border);
          border-radius: 10px;
          color: var(--ins-fg);
          font-size: 1.05rem;
          font-family: var(--ins-sans);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .sf-ins-search:focus {
          outline: none;
          border-color: var(--ins-accent);
          box-shadow: 0 0 0 3px rgba(0, 217, 126, 0.12);
        }
        .sf-ins-search::placeholder { color: var(--ins-muted); }
        .sf-ins-results {
          display: none;
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: var(--ins-bg2);
          border: 1px solid var(--ins-border);
          border-radius: 10px;
          max-height: 240px;
          overflow-y: auto;
          z-index: 100;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        }
        .sf-ins-result-item {
          padding: 12px 20px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: background 0.1s;
          border-bottom: 1px solid var(--ins-border);
        }
        .sf-ins-result-item:last-child { border-bottom: none; }
        .sf-ins-result-item:hover { background: var(--ins-bg3); }
        .sf-ins-result-item.sf-ins-not-found {
          color: var(--ins-muted);
          cursor: default;
          font-style: italic;
        }
        .sf-ins-result-item.sf-ins-not-found:hover { background: var(--ins-bg2); }
        .sf-ins-check {
          width: 100%;
          padding: 14px;
          background: var(--ins-accent);
          color: #0a0b0d;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--ins-sans);
          transition: transform 0.12s, box-shadow 0.12s;
          margin-top: 12px;
        }
        .sf-ins-check:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0, 217, 126, 0.3);
        }
        .sf-ins-status { margin-top: 20px; }
        .sf-ins-status-msg {
          padding: 20px;
          border-radius: 10px;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .sf-ins-status-msg.sf-ins-accepted {
          background: rgba(0, 217, 126, 0.08);
          border: 1px solid rgba(0, 217, 126, 0.3);
          color: var(--ins-fg);
        }
        .sf-ins-status-msg.sf-ins-accepted .check-icon {
          font-size: 1.3rem;
          margin-right: 8px;
        }
        .sf-ins-status-msg.sf-ins-accepted .ins-name {
          color: var(--ins-accent);
          font-weight: 700;
        }
        .sf-ins-status-msg.sf-ins-accepted .next-steps {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(0, 217, 126, 0.2);
          font-size: 0.9rem;
          color: var(--ins-muted-bright);
        }
        .sf-ins-status-msg.sf-ins-accepted .cta-link {
          display: inline-block;
          margin-top: 14px;
          background: var(--ins-accent);
          color: #0a0b0d;
          padding: 10px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
          transition: transform 0.12s;
        }
        .sf-ins-status-msg.sf-ins-accepted .cta-link:hover {
          transform: translateY(-1px);
        }
        .sf-ins-status-msg.sf-ins-unknown {
          background: rgba(255, 180, 0, 0.06);
          border: 1px solid rgba(255, 180, 0, 0.3);
          color: var(--ins-fg);
        }
        .sf-ins-status-msg.sf-ins-unknown .maybe-icon {
          font-size: 1.3rem;
          margin-right: 8px;
        }
        .sf-ins-status-msg.sf-ins-unknown .verify-form {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 180, 0, 0.2);
        }
        .sf-ins-status-msg.sf-ins-unknown .verify-form label {
          display: block;
          font-size: 0.8rem;
          color: var(--ins-muted);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .sf-ins-status-msg.sf-ins-unknown .verify-form input {
          width: 100%;
          padding: 10px 14px;
          background: var(--ins-bg);
          border: 1px solid var(--ins-border);
          border-radius: 8px;
          color: var(--ins-fg);
          font-size: 0.9rem;
          font-family: var(--ins-sans);
          margin-bottom: 10px;
        }
        .sf-ins-status-msg.sf-ins-unknown .verify-form input:focus {
          outline: none;
          border-color: var(--ins-accent);
        }
        .sf-ins-status-msg.sf-ins-unknown .verify-btn {
          background: var(--ins-accent);
          color: #0a0b0d;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: var(--ins-sans);
        }
        .sf-ins-status-msg.sf-ins-info {
          background: var(--ins-bg2);
          border: 1px solid var(--ins-border);
          color: var(--ins-muted-bright);
          text-align: center;
        }
        .sf-ins-accepted-list {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--ins-border);
        }
        .sf-ins-accepted-list h4 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ins-muted);
          margin-bottom: 10px;
        }
        .sf-ins-accepted-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .sf-ins-chip {
          background: var(--ins-bg2);
          border: 1px solid var(--ins-border);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 0.8rem;
          color: var(--ins-muted-bright);
        }
        .sf-ins-chip.accepted {
          border-color: rgba(0, 217, 126, 0.3);
          color: var(--ins-accent);
        }
        .sf-ins-cashonly-badge {
          display: inline-block;
          background: rgba(0, 217, 126, 0.1);
          border: 1px solid rgba(0, 217, 126, 0.3);
          color: var(--ins-accent);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 20px;
          margin-left: 8px;
        }
        @media (max-width: 600px) {
          .sf-ins-widget { padding: 32px 16px; }
          .sf-ins-header h2 { font-size: 1.3rem; }
        }
      </style>
      <div class="sf-ins-widget">
        <div class="sf-ins-inner">
          <div class="sf-ins-header">
            <h2>Does ${escapeHtml(practiceName)} accept your insurance? ${cashOnly ? '<span class="sf-ins-cashonly-badge">Cash / No Insurance</span>' : ''}</h2>
            <p>Type your insurance provider below to check instantly. No phone call required.${cashOnly ? ' We also offer cash pricing and payment plans.' : ''}</p>
          </div>

          <div class="sf-ins-form">
            <div class="sf-ins-search-wrap">
              <input type="text" class="sf-ins-search" placeholder="Type your insurance provider (e.g., Delta Dental, Cigna, Aetna)..." autocomplete="off">
              <div class="sf-ins-results"></div>
            </div>
            <button class="sf-ins-check">Check my insurance →</button>
          </div>

          <div class="sf-ins-status"></div>
        </div>
      </div>
    `;
  }

  function buildAccepted(name, practiceName, practiceEmail, cashOnly) {
    return `
      <div class="sf-ins-status-msg sf-ins-accepted">
        <span class="check-icon">✅</span>
        Yes! <span class="ins-name">${escapeHtml(practiceName)}</span> accepts <strong>${escapeHtml(name)}</strong>.
        <div class="next-steps">
          You're covered. Book your appointment online or call us to schedule. We'll verify your specific plan details at your first visit.
        </div>
        <a href="mailto:${escapeAttr(practiceEmail)}?subject=Insurance verification: ${escapeAttr(name)}&body=Hi, I have ${escapeAttr(name)} insurance and would like to schedule an appointment. Could you verify my plan details?" class="cta-link">Book appointment →</a>
      </div>
    `;
  }

  function buildUnknown(name, practiceName, practiceEmail) {
    return `
      <div class="sf-ins-status-msg sf-ins-unknown">
        <span class="maybe-icon">🤔</span>
        We don't see <strong>${escapeHtml(name)}</strong> in our standard list, but we may still accept it. Some plans have different names or are under a parent network.
        <div class="verify-form">
          <label>Your email (optional - we'll confirm within 24 hours)</label>
          <input type="email" id="sf-ins-verify-email" placeholder="you@email.com">
          <button class="verify-btn" onclick="SiteFreshInsuranceChecker.sendVerify('${escapeAttr(practiceEmail)}', '${escapeAttr(name)}', '${escapeAttr(practiceName)}')">Verify my plan →</button>
        </div>
      </div>
    `;
  }

  function sendVerify(practiceEmail, insuranceName, practiceName) {
    const emailInput = document.getElementById('sf-ins-verify-email');
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = 'Insurance verification: ' + insuranceName;
    const body = `Hi ${practiceName},\n\nI have ${insuranceName} insurance and I'd like to know if you accept my plan.\n\n${email ? 'You can reach me at: ' + email : ''}\n\nThanks!`;
    window.location.href = `mailto:${practiceEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  return { init, sendVerify };
})();

if (typeof window !== 'undefined') {
  window.SiteFreshInsuranceChecker = SiteFreshInsuranceChecker;
}
