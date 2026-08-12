import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/confidentialitate')({
  component: PrivacyPolicy,
  head: () => ({
    meta: [
      { title: 'Politică de Confidențialitate | Contaudit' }
    ]
  })
})

function PrivacyPolicy() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-gold/20 flex flex-col">
      {/* Header Sticky */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/90 border-b border-border/70 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-0.5 group z-50">
            <span className="font-display text-2xl tracking-tight text-navy group-hover:text-gold transition-colors">contaudit</span>
            <span className="text-xs font-semibold text-muted-foreground">.eu</span>
          </Link>
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors">
            Înapoi la pagina principală
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow py-24 max-w-4xl mx-auto px-5 w-full">
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground block mb-4">Legal</span>
        <h1 className="font-display text-4xl md:text-5xl font-normal tracking-[-0.01em] text-foreground mb-12">
          Politică de Confidențialitate
        </h1>
        
        <div className="space-y-8 text-foreground/80 leading-relaxed text-base">
          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">1. Informații generale</h2>
            <p>Confidențialitatea datelor dumneavoastră cu caracter personal reprezintă una dintre preocupările principale ale Contaudit. Acest document are rolul de a vă informa cu privire la prelucrarea datelor dumneavoastră cu caracter personal, în contextul utilizării paginii de internet contaudit.eu.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">2. Categoriile de date prelucrate</h2>
            <p>Dacă sunteți vizitator al site-ului, vom prelucra datele pe care le furnizați în mod direct în contextul utilizării site-ului, cum ar fi datele pe care le furnizați în cadrul secțiunii de contact / solicitare ofertă (nume, prenume, adresa de e-mail, telefon, mesaj).</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">3. Scopurile prelucrării</h2>
            <p>Prelucrăm datele dumneavoastră exclusiv pentru:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Răspunsul la solicitările și mesajele trimise prin formularul de contact.</li>
              <li>Furnizarea serviciilor de contabilitate și audit solicitate.</li>
              <li>Îmbunătățirea experienței pe site-ul nostru.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">4. Durata prelucrării datelor</h2>
            <p>Ca principiu, vom prelucra datele dumneavoastră cu caracter personal doar cât este necesar pentru realizarea scopurilor de prelucrare menționate mai sus. Dacă vă retrageți consimțământul, vom opri prelucrarea, cu excepția cazului în care o obligație legală ne impune păstrarea lor.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">5. Drepturile dumneavoastră (GDPR)</h2>
            <p>În condițiile prevăzute de legislația în materia prelucrării datelor, beneficiați de:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Dreptul la informare și acces la date.</li>
              <li>Dreptul la rectificare și ștergerea datelor ("dreptul de a fi uitat").</li>
              <li>Dreptul la restricționarea prelucrării și portabilitatea datelor.</li>
            </ul>
            <p className="mt-2">Pentru orice întrebări suplimentare referitoare la modul în care datele cu caracter personal sunt prelucrate, vă rugăm să vă adresați la adresa de email: <strong>contact@contaudit.eu</strong></p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border/60 py-10 text-center mt-auto">
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-baseline gap-0.5 mb-4 md:mb-0">
            <span className="font-display text-xl tracking-tight text-navy">contaudit</span>
            <span className="text-xs font-semibold text-muted-foreground">.eu</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <Link to="/confidentialitate" className="hover:text-foreground transition-colors">
              Politică de Confidențialitate
            </Link>
            <span className="hidden md:inline text-border">•</span>
            <p>&copy; {currentYear} Contaudit. Toate drepturile rezervate.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
