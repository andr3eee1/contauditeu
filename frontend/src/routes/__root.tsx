import { useEffect } from 'react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Firmă de Contabilitate și Audit Financiar | Expert Contabil - Contaudit" },
      { name: "description", content: "Servicii complete de contabilitate, audit financiar, consultanță fiscală, salarizare și HR pentru companii. Expert contabil dedicat pentru siguranța afacerii tale." },
      { name: "keywords", content: "firma contabilitate, expert contabil, audit financiar, servicii contabilitate, consultanta fiscala, salarizare, infiintari firme, contabilitate Bucuresti, auditor financiar" },
      { property: "og:site_name", content: "Contaudit" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500;600&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add smooth scrolling after a tiny delay so it doesn't animate on page refresh
    const timeout = setTimeout(() => {
      document.documentElement.classList.add('scroll-smooth');
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <html lang="ro" className="scroll-pt-20">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        <Scripts />
      </body>
    </html>
  )
}
