import { useEffect } from 'react'
import { HeadContent, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import { FileQuestion, AlertTriangle, Home, ArrowLeft } from 'lucide-react'

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
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  pendingComponent: PendingComponent,
  shellComponent: RootDocument,
})

function PendingComponent() {
  return (
    <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in duration-300">
      <div className="w-12 h-12 border-4 border-navy/20 border-t-gold rounded-full animate-spin"></div>
    </div>
  )
}

function NotFoundComponent() {
  return (
    <RootDocument>
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        {/* Decorative blobs */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-navy/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="bg-background/80 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-border/50 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
            <FileQuestion size={48} />
          </div>
          <h1 className="font-display text-7xl font-medium text-foreground mb-2">404</h1>
          <h2 className="text-2xl font-medium text-foreground mb-4">Pagina nu a fost găsită</h2>
          <p className="text-muted-foreground mb-8">
            Ne pare rău, dar documentul sau pagina pe care o căutați nu există, a fost mutată sau nu aveți acces la ea.
          </p>
          <Link to="/" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-medium text-navy-foreground hover:bg-navy/90 hover:shadow-[0_8px_20px_rgba(26,35,64,0.25)] transition-all hover:-translate-y-0.5">
            <Home size={18} />
            Înapoi acasă
          </Link>
        </div>
      </div>
    </RootDocument>
  )
}

function ErrorComponent({ error }: { error: any }) {
  return (
    <RootDocument>
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        {/* Decorative blobs */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-destructive/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="bg-background/80 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-border/50 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
            <AlertTriangle size={48} />
          </div>
          <h1 className="font-display text-7xl font-medium text-foreground mb-2">Oops</h1>
          <h2 className="text-2xl font-medium text-foreground mb-4">Eroare de sistem</h2>
          <p className="text-muted-foreground mb-8 text-sm">
            {error?.message || "Ne cerem scuze, dar a apărut o eroare neașteptată de server. Vă rugăm să încercați din nou."}
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-medium text-navy-foreground hover:bg-navy/90 hover:shadow-[0_8px_20px_rgba(26,35,64,0.25)] transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <ArrowLeft size={18} />
              Reîncărcați pagina
            </button>
            <Link to="/" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
              <Home size={18} />
              Mergeți acasă
            </Link>
          </div>
        </div>
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Intercept clicks on hash links to scroll smoothly, allowing us to remove global 'scroll-smooth'
    // which breaks the browser's back-button scroll restoration.
    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.pathname === window.location.pathname) {
        const id = anchor.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          // Temporarily enable smooth scrolling just for this click
          document.documentElement.style.scrollBehavior = 'smooth';
          
          // Remove it after the scroll animation is finished (1 second)
          setTimeout(() => {
            document.documentElement.style.scrollBehavior = '';
          }, 1000);
        }
      }
    };

    document.addEventListener('click', handleHashClick);
    return () => document.removeEventListener('click', handleHashClick);
  }, []);

  return (
    <html lang="ro" className="scroll-pt-24">
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
