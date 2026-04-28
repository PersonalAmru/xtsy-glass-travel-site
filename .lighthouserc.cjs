module.exports = {
  ci: {
    collect: {
      // URLs are injected from TOP_SEO_ROUTES via the workflow.
      // Default sample if run locally without env override:
      url: (process.env.LHCI_URLS || 'https://xtsy.one,https://xtsy.one/best-hostel-in-shillong,https://xtsy.one/meghalaya-tour-packages').split(','),
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        // Mobile is the more important budget — workflow runs both presets.
        chromeFlags: '--no-sandbox --headless=new',
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Core Web Vitals — block-on-regression budgets
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'interactive': ['warn', { maxNumericValue: 3800 }],
        'speed-index': ['warn', { maxNumericValue: 3400 }],

        // Category scores
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],

        // Quiet noisy audits unrelated to our budgets
        'uses-http2': 'off',
        'uses-long-cache-ttl': 'warn',
        'csp-xss': 'off',
        'unused-javascript': 'warn',
        'unused-css-rules': 'warn',
        'unsized-images': 'warn',
        'is-crawlable': 'error',
        'robots-txt': 'error',
        'canonical': 'error',
        'meta-description': 'error',
        'document-title': 'error',
        'structured-data': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
