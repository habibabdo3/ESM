import { site } from '@/config/site';

type Json = Record<string, unknown>;

export function abs(path: string, base: URL | string): string {
  return new URL(path, base).toString();
}

export function organization(base: URL): Json {
  return {
    '@type': 'Organization',
    '@id': abs('/#organization', base),
    name: site.name,
    url: abs('/', base),
    logo: abs('/icons/logo-512.png', base),
    ...(site.email ? { email: site.email } : {}),
    ...(site.phone ? { telephone: site.phone } : {}),
    sameAs: [site.instagram, site.facebook].filter(Boolean),
  };
}

export function website(base: URL): Json {
  return {
    '@type': 'WebSite',
    '@id': abs('/#website', base),
    url: abs('/', base),
    name: site.name,
    inLanguage: 'fr-MA',
    publisher: { '@id': abs('/#organization', base) },
  };
}

/** LocalBusiness : NAP identiques à la fiche Google. Champs absents omis (jamais inventés). */
export function localBusiness(base: URL): Json {
  return {
    '@type': 'HomeAndConstructionBusiness',
    '@id': abs('/#localbusiness', base),
    name: site.name,
    url: abs('/', base),
    image: abs('/og/default.png', base),
    description: site.promise,
    areaServed: { '@type': 'Country', name: 'Maroc' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.hq,
      addressCountry: site.country,
      ...(site.address ? { streetAddress: site.address } : {}),
    },
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.email ? { email: site.email } : {}),
    parentOrganization: { '@id': abs('/#organization', base) },
  };
}

export function service(
  base: URL,
  s: { name: string; description: string; path: string; type?: string },
): Json {
  return {
    '@type': 'Service',
    name: s.name,
    description: s.description,
    url: abs(s.path, base),
    serviceType: s.type ?? s.name,
    provider: { '@id': abs('/#localbusiness', base) },
    areaServed: { '@type': 'Country', name: 'Maroc' },
  };
}

export function breadcrumb(base: URL, items: { name: string; path: string }[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path, base),
    })),
  };
}

export function faqPage(items: { q: string; a: string }[]): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function article(
  base: URL,
  a: { title: string; description: string; path: string; date: Date },
): Json {
  return {
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    datePublished: a.date.toISOString(),
    mainEntityOfPage: abs(a.path, base),
    author: { '@id': abs('/#organization', base) },
    publisher: { '@id': abs('/#organization', base) },
    inLanguage: 'fr-MA',
  };
}
