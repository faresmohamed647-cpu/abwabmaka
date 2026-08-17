(function initSiteSeo() {
  const SITE_ORIGIN = 'https://abwabmaka.zeusmediaeg.com';

  const toAbsoluteUrl = (value) => {
    if (!value) return value;
    try {
      if (value === 'index.html' || value === './' || value === '/') {
        return SITE_ORIGIN + '/';
      }
      const absolute = new URL(value, SITE_ORIGIN + '/').href;
      if (absolute === SITE_ORIGIN + '/index.html') return SITE_ORIGIN + '/';
      return absolute;
    } catch {
      return value;
    }
  };

  document.querySelectorAll('link[rel="canonical"], link[rel="alternate"]').forEach((el) => {
    const href = el.getAttribute('href');
    if (href) el.setAttribute('href', toAbsoluteUrl(href));
  });

  document.querySelectorAll(
    'meta[property="og:url"], meta[property="og:image"], meta[name="twitter:image"]'
  ).forEach((el) => {
    const content = el.getAttribute('content');
    if (content) el.setAttribute('content', toAbsoluteUrl(content));
  });

  if (document.getElementById('seo-local-business') || !document.head) return;

  const siteUrl = SITE_ORIGIN + '/';
  const logoUrl = toAbsoluteUrl('images/logo.svg');

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
        '@id': siteUrl + '#business',
        name: 'أبواب مكة',
        alternateName: 'Abwab Makkah',
        description:
          'تصنيع وتركيب بوابات حديدية وأبواب أوتوماتيكية وشتر في المملكة العربية السعودية',
        url: siteUrl,
        telephone: '+966553925444',
        email: 'info@aletqan.com',
        image: logoUrl,
        logo: logoUrl,
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'المدينة الصناعية الثانية، طريق الخرج',
          addressLocality: 'الرياض',
          addressCountry: 'SA',
        },
        areaServed: [
          'الرياض',
          'جدة',
          'مكة المكرمة',
          'المدينة المنورة',
          'الدمام',
          'الخبر',
          'الجبيل',
          'القصيم',
        ],
        sameAs: [
          'https://wa.me/966553925444',
          'https://www.snapchat.com/add/sysbur',
          'https://www.tiktok.com/@user9753979848595',
          'https://web.facebook.com/abw.amyrh.76342',
        ],
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '08:00',
            closes: '17:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '09:00',
            closes: '14:00',
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': siteUrl + '#website',
        name: 'أبواب مكة',
        inLanguage: 'ar',
        url: siteUrl,
        publisher: { '@id': siteUrl + '#business' },
      },
    ],
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'seo-local-business';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
})();
