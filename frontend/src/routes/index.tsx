import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  FileSpreadsheet,
  ClipboardCheck,
  Users,
  BarChart3,
  Building2,
  ShieldCheck,
  ArrowRight,
  Check,
  Quote,
  Star,
  Menu,
  X
} from 'lucide-react'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Firmă de Contabilitate și Audit Financiar | Contaudit' },
      { name: 'description', content: 'Cauti o firmă de contabilitate cu experiență? Oferim servicii de expertiză contabilă, audit financiar, consultanță fiscală și salarizare. Programează o discuție!' },
      { name: 'keywords', content: 'firma contabilitate, expert contabil, servicii contabilitate, audit financiar, consultanta fiscala, firma audit, salarizare, evidenta contabila, contabilitate Bucuresti' },
      { property: 'og:title', content: 'Firmă de Contabilitate și Audit Financiar | Contaudit' },
      { property: 'og:description', content: 'Servicii de contabilitate, audit financiar, salarizare și consultanță fiscală, livrate cu rigoare și transparență.' },
      { property: 'og:url', content: 'https://contaudit.eu/' },
      { property: 'og:type', content: 'website' },
    ],
    links: [{ rel: 'canonical', href: 'https://contaudit.eu/' }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["AccountingService", "FinancialService"],
          "name": "Contaudit",
          "url": "https://contaudit.eu",
          "areaServed": "RO",
          "description": "Firma de contabilitate si audit financiar. Oferim servicii de expertiza contabila, audit, salarizare, consultanta fiscala si due diligence pentru companii din Romania.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "București",
            "addressCountry": "RO"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 40.761293,
            "longitude": -73.982294
          },
          "telephone": "+40312345678",
          "email": "contact@contaudit.eu",
          "priceRange": "$$",
          "founder": {
            "@type": "Person",
            "name": "Ioana Popescu",
            "jobTitle": "Expert Contabil si Auditor Financiar"
          }
        }),
      },
    ],
  }),
  component: Home,
})

function Home() {
  const currentYear = new Date().getFullYear();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-gold/20">
      {/* Header Sticky Floating */}
      <div className="py-6 px-4 sticky top-0 z-50">
        <header className="max-w-5xl mx-auto backdrop-blur-xl bg-background/85 border border-border/50 shadow-soft rounded-full">
          <div className="h-16 flex items-center justify-between px-6 md:px-8">
            <a href="#" className="flex items-baseline gap-0.5 group z-50" onClick={() => setMobileMenuOpen(false)}>
              <span className="font-display text-2xl tracking-tight text-navy group-hover:text-gold transition-colors">contaudit</span>
              <span className="text-xs font-semibold text-muted-foreground">.eu</span>
            </a>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#servicii" className="text-foreground/80 hover:text-gold transition-colors">Servicii</a>
              <a href="#despre" className="text-foreground/80 hover:text-gold transition-colors">Despre noi</a>
              <a href="#proces" className="text-foreground/80 hover:text-gold transition-colors">Proces</a>
              <a href="#contact" className="text-foreground/80 hover:text-gold transition-colors">Contact</a>
            </nav>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/login" className="text-sm font-medium text-navy hover:text-gold transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                Portal
              </Link>
              <a href="#contact" className="inline-flex items-center justify-center rounded-full bg-navy px-6 py-2 text-sm font-medium text-navy-foreground hover:bg-navy/90 hover:shadow-md transition-all hover:-translate-y-0.5">
                Programează o discuție
              </a>
            </div>
            
            <button 
              className="md:hidden flex items-center justify-center p-2 -mr-2 text-foreground z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-x-4 top-24 bg-background/95 backdrop-blur-md z-40 flex flex-col p-6 rounded-2xl shadow-xl border border-border/50 animate-in fade-in slide-in-from-top-4 duration-200">
              <nav className="flex flex-col gap-6 text-lg font-medium pt-2">
                <a href="#servicii" onClick={() => setMobileMenuOpen(false)} className="text-foreground/80 hover:text-gold transition-colors border-b border-border/40 pb-4">Servicii</a>
                <a href="#despre" onClick={() => setMobileMenuOpen(false)} className="text-foreground/80 hover:text-gold transition-colors border-b border-border/40 pb-4">Despre noi</a>
                <a href="#proces" onClick={() => setMobileMenuOpen(false)} className="text-foreground/80 hover:text-gold transition-colors border-b border-border/40 pb-4">Proces</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-foreground/80 hover:text-gold transition-colors border-b border-border/40 pb-4">Contact</a>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-navy hover:text-gold transition-colors font-semibold flex items-center gap-2 pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                  Portal Clienți
                </Link>
              </nav>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="mt-6 inline-flex items-center justify-center rounded-full bg-navy px-5 py-4 text-base font-medium text-navy-foreground hover:bg-navy/90 transition-colors w-full">
                Programează o discuție
              </a>
            </div>
          )}
        </header>
      </div>

      {/* Hero */}
      <section className="relative bg-navy text-navy-foreground overflow-hidden pt-16 md:pt-24 pb-20 md:pb-32">
        <div className="absolute inset-0 opacity-25">
          <img src="/hero-office.jpg" alt="Firmă de contabilitate și audit financiar - Birou profesional" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy/60 mix-blend-multiply"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-5 z-10">
          <div className="max-w-3xl">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-semibold mb-6 block">
              Contabilitate · Audit · Fiscalitate
            </span>
            <h1 className="font-display text-5xl md:text-7xl mb-6 font-normal tracking-[-0.01em] leading-[1.1]">
              Firmă de Contabilitate și Audit Financiar cu Experiență.
            </h1>
            <p className="text-lg md:text-xl text-navy-foreground/80 mb-10 max-w-2xl font-light">
              Oferim antreprenorilor și companiilor din România servicii complete de contabilitate, audit, salarizare și consultanță fiscală. Cifre corecte pentru decizii sigure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <a href="#contact" className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-4 text-sm font-medium text-gold-foreground hover:bg-gold/90 hover:shadow-lg transition-all hover:-translate-y-0.5 gap-2">
                Solicită o ofertă
                <ArrowRight size={16} />
              </a>
              <a href="#servicii" className="inline-flex items-center justify-center rounded-full border border-navy-foreground/30 px-8 py-4 text-sm font-medium text-navy-foreground hover:bg-navy-foreground/10 transition-colors">
                Vezi serviciile
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 pt-8 border-t border-navy-foreground/20">
              <div>
                <p className="font-display text-3xl text-gold mb-1">18+</p>
                <p className="text-xs uppercase tracking-wider text-navy-foreground/70">ani de experiență</p>
              </div>
              <div>
                <p className="font-display text-3xl text-gold mb-1">250+</p>
                <p className="text-xs uppercase tracking-wider text-navy-foreground/70">companii asistate</p>
              </div>
              <div>
                <p className="font-display text-3xl text-gold mb-1">100%</p>
                <p className="text-xs uppercase tracking-wider text-navy-foreground/70">raportări la termen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Afilieri / Certificari - Elegant Logo Strip */}
      <section className="bg-white py-12 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-5">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.25em] mb-8">
            Certificat și autorizat de instituțiile profesionale
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-28 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <img 
              src="/sigla-ceccar.png" 
              alt="CECCAR Logo" 
              className="h-20 md:h-28 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 mix-blend-multiply" 
            />
            <img 
              src="/ca.png" 
              alt="CAFR Logo" 
              className="h-14 md:h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 mix-blend-multiply" 
            />
            <img 
              src="/ASPAAS-logo.png" 
              alt="ASPAAS Logo" 
              className="h-10 md:h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 mix-blend-multiply" 
            />
          </div>
        </div>
      </section>

      {/* Servicii */}
      <section id="servicii" className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-16">
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground block mb-4">Servicii</span>
            <h2 className="font-display text-4xl md:text-5xl font-normal tracking-[-0.01em] text-foreground">Soluții financiare complete</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-gold/30">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <FileSpreadsheet size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-3">Contabilitate financiară</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">Evidență contabilă completă, balanțe, situații financiare anuale și raportări către ANAF, la termen și fără surprize.</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-gold/30">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <ClipboardCheck size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-3">Audit financiar</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">Audit statutar și voluntar al situațiilor financiare, în conformitate cu Standardele Internaționale de Audit.</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-gold/30">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Users size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-3">Salarizare și HR</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">Calcul salarii, state de plată, declarația 112, administrare REVISAL și dosare de personal.</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-gold/30">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <BarChart3 size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-3">Consultanță fiscală</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">Optimizare fiscală legală, analiza impactului modificărilor legislative și asistență la controale.</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-gold/30">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Building2 size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-3">Înființări și restructurări</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">Consultanță pentru înființare firme, modificări în actul constitutiv, fuziuni, divizări și lichidări.</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-gold/30">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <ShieldCheck size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-3">Due diligence</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">Analiză financiar-contabilă pre-tranzacție, evaluarea riscurilor și verificarea conformității.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Despre noi */}
      <section id="despre" className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground block mb-4">Despre noi</span>
              <h2 className="font-display text-4xl md:text-5xl font-normal tracking-[-0.01em] text-foreground mb-8 gold-rule">
                Expertiza unui profesionist dedicat.
              </h2>
              <div className="space-y-6 text-foreground/80 leading-relaxed text-lg mb-8">
                <p>
                  Sunt <strong>[Nume Placeholder]</strong>, lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                </p>
                <p>
                  Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Membru al corpului profesional CECCAR și CAFR",
                  "Expertiză în industrii diverse (IT, producție, comerț)",
                  "Comunicare fluentă în română și engleză"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 bg-gold/20 text-gold rounded-full p-1 flex-shrink-0">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-foreground/90 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl relative z-10 border border-border/50">
                <img src="/founder.jpg" alt="Ioana Popescu, Expert Contabil și Auditor Financiar" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-surface/90 backdrop-blur-md p-6 rounded-2xl shadow-soft border border-border/60 z-20">
                <p className="font-display text-2xl text-foreground">[Nume Placeholder]</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mt-1">Lorem Ipsum</p>
              </div>
              {/* Decorative block */}
              <div className="absolute -top-6 -right-6 w-3/4 h-3/4 bg-gradient-to-br from-gold/10 to-primary/5 rounded-3xl -z-10 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Proces */}
      <section id="proces" className="py-24 bg-navy text-navy-foreground">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold block mb-4">Metodologie</span>
            <h2 className="font-display text-4xl md:text-5xl font-normal tracking-[-0.01em]">Cum lucrăm împreună</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative group">
              <div className="text-gold font-display text-6xl mb-6 opacity-50 group-hover:opacity-100 transition-opacity">01</div>
              <h3 className="text-xl font-medium mb-3">Discuție inițială</h3>
              <p className="text-navy-foreground/70 text-sm leading-relaxed">
                Analizăm activitatea, volumul de documente și obiectivele companiei dumneavoastră.
              </p>
              {/* Connector line for desktop */}
              <div className="hidden lg:block absolute top-10 left-[40%] w-[80%] h-px bg-gradient-to-r from-gold/50 to-transparent"></div>
            </div>
            
            <div className="relative group">
              <div className="text-gold font-display text-6xl mb-6 opacity-50 group-hover:opacity-100 transition-opacity">02</div>
              <h3 className="text-xl font-medium mb-3">Propunere personalizată</h3>
              <p className="text-navy-foreground/70 text-sm leading-relaxed">
                Primiți un plan de servicii clar, cu responsabilități, termene și un onorariu transparent.
              </p>
              <div className="hidden lg:block absolute top-10 left-[40%] w-[80%] h-px bg-gradient-to-r from-gold/50 to-transparent"></div>
            </div>
            
            <div className="relative group">
              <div className="text-gold font-display text-6xl mb-6 opacity-50 group-hover:opacity-100 transition-opacity">03</div>
              <h3 className="text-xl font-medium mb-3">Preluare și implementare</h3>
              <p className="text-navy-foreground/70 text-sm leading-relaxed">
                Preluăm evidența existentă, verificăm soldurile și configurăm fluxul de documente.
              </p>
              <div className="hidden lg:block absolute top-10 left-[40%] w-[80%] h-px bg-gradient-to-r from-gold/50 to-transparent"></div>
            </div>
            
            <div className="relative group">
              <div className="text-gold font-display text-6xl mb-6 opacity-50 group-hover:opacity-100 transition-opacity">04</div>
              <h3 className="text-xl font-medium mb-3">Colaborare continuă</h3>
              <p className="text-navy-foreground/70 text-sm leading-relaxed">
                Raportări lunare, indicatori financiari și un consultant dedicat, disponibil permanent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimoniale */}
      <section className="py-24 bg-surface">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground block mb-4">Păreri</span>
            <h2 className="font-display text-4xl md:text-5xl font-normal tracking-[-0.01em] text-foreground">Ce spun clienții</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-3xl shadow-soft border border-border/60 relative hover:-translate-y-2 transition-all duration-300">
              <Quote className="absolute top-6 right-6 text-primary/10" size={48} />
              <div className="flex gap-1 text-gold mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-8 italic">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  NL
                </div>
                <div>
                  <p className="font-medium text-foreground">Nume Lorem</p>
                  <p className="text-xs text-muted-foreground">CEO, Ipsum SRL</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-3xl shadow-soft border border-border/60 relative hover:-translate-y-2 transition-all duration-300">
              <Quote className="absolute top-6 right-6 text-primary/10" size={48} />
              <div className="flex gap-1 text-gold mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-8 italic">
                "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  IL
                </div>
                <div>
                  <p className="font-medium text-foreground">Ipsum Lorem</p>
                  <p className="text-xs text-muted-foreground">Fondator, DolorSit</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-3xl shadow-soft border border-border/60 relative hover:-translate-y-2 transition-all duration-300">
              <Quote className="absolute top-6 right-6 text-primary/10" size={48} />
              <div className="flex gap-1 text-gold mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-8 italic">
                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore."
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  DL
                </div>
                <div>
                  <p className="font-medium text-foreground">Dolor Lorem</p>
                  <p className="text-xs text-muted-foreground">Director, Amet Inc</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-surface">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground block mb-4">Contact</span>
              <h2 className="font-display text-4xl md:text-5xl font-normal tracking-[-0.01em] text-foreground mb-6">
                Discutăm despre situația firmei dumneavoastră.
              </h2>
              <p className="text-foreground/80 text-lg mb-10 max-w-md">
                Trimiteți-ne câteva detalii despre activitate și revenim cu o propunere de colaborare în cel mult o zi lucrătoare.
              </p>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Email</p>
                  <a href="mailto:contact@contaudit.eu" className="text-xl font-medium text-primary hover:text-gold transition-colors">contact@contaudit.eu</a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Telefon</p>
                  <a href="tel:+40312345678" className="text-xl font-medium text-foreground hover:text-gold transition-colors">+40 31 234 5678</a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Adresă</p>
                  <p className="text-xl font-medium text-foreground">București, România</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-8 md:p-10 rounded-3xl shadow-soft border border-border/60">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground ml-1">Nume și prenume <span className="text-destructive">*</span></label>
                    <input 
                      type="text" 
                      id="name" 
                      required 
                      className="w-full h-12 px-5 rounded-full border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                      placeholder="Ex: Ion Popescu"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium text-foreground ml-1">Companie</label>
                    <input 
                      type="text" 
                      id="company" 
                      className="w-full h-12 px-5 rounded-full border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                      placeholder="Numele firmei"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground ml-1">Email <span className="text-destructive">*</span></label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className="w-full h-12 px-5 rounded-full border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                    placeholder="adresa@email.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground ml-1">Mesaj</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full p-5 rounded-3xl border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all resize-none"
                    placeholder="Cu ce vă putem ajuta?"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full h-14 mt-4 rounded-full bg-navy text-navy-foreground font-medium hover:bg-navy/90 hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Trimite solicitarea
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border/60 py-10 text-center">
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-baseline gap-0.5 mb-4 md:mb-0">
            <span className="font-display text-xl tracking-tight text-navy">contaudit</span>
            <span className="text-xs font-semibold text-muted-foreground">.eu</span>
          </div>
          <div className="flex flex-col md:flex-row items-center md:justify-end gap-6 w-full text-sm text-muted-foreground mt-4 md:mt-0">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p>&copy; {currentYear} Contaudit. Toate drepturile rezervate.</p>
              <p>Dezvoltat cu ❤️ de <a href="https://andrei.pana.com.ro" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors font-medium">Andrei</a></p>
            </div>
            <div className="hidden md:block w-px h-8 bg-border"></div>
            <Link to="/confidentialitate" className="hover:text-foreground transition-colors">
              Politică de Confidențialitate
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
