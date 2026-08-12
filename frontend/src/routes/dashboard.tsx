import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { LogOut, LayoutDashboard, FileText, User, Loader2, Users } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  
  useEffect(() => {
    // Basic auth check
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (!token || !storedUser) {
      navigate({ to: '/login' })
      return
    }
    
    try {
      setUser(JSON.parse(storedUser))
    } catch (e) {
      navigate({ to: '/login' })
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate({ to: '/login' })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <Loader2 size={40} className="animate-spin text-gold mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Se încarcă spațiul de lucru...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border/50 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border/50">
          <Link to="/" className="flex items-baseline gap-0.5 group">
            <span className="font-display text-2xl tracking-tight text-navy group-hover:text-gold transition-colors">contaudit</span>
            <span className="text-xs font-semibold text-muted-foreground">.eu</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium transition-colors">
            <LayoutDashboard size={18} />
            Privire de ansamblu
          </a>
          {user.role === 'ADMIN' ? (
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted/50 rounded-xl font-medium transition-colors">
              <Users size={18} />
              Clienți și Cereri
            </a>
          ) : (
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted/50 rounded-xl font-medium transition-colors">
              <FileText size={18} />
              Documente
            </a>
          )}
        </nav>
        
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-navy text-navy-foreground flex items-center justify-center font-bold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Deconectare
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-background border-b border-border/50 p-4 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-0.5 group">
            <span className="font-display text-xl tracking-tight text-navy group-hover:text-gold transition-colors">contaudit</span>
            <span className="text-xs font-semibold text-muted-foreground">.eu</span>
          </Link>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut size={20} />
          </button>
        </header>

        <div className="flex-1 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-display text-3xl font-medium text-foreground mb-2">
              Salut, {user.name?.split(' ')[0] || 'Client'}!
            </h1>
            <p className="text-muted-foreground mb-10">
              Bine ați venit în portalul dumneavoastră. Aici veți găsi toate informațiile importante.
            </p>

            {/* Blank State Concept */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {user.role === 'ADMIN' ? (
                <>
                  <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-soft">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Users size={24} />
                    </div>
                    <h3 className="font-medium text-lg mb-1">Clienți Activi</h3>
                    <p className="text-sm text-muted-foreground">Gestionează toți clienții înregistrați.</p>
                  </div>
                  <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-soft">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mb-4">
                      <FileText size={24} />
                    </div>
                    <h3 className="font-medium text-lg mb-1">Cereri Noi</h3>
                    <p className="text-sm text-muted-foreground">Răspunde la solicitările clienților.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-soft">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <FileText size={24} />
                    </div>
                    <h3 className="font-medium text-lg mb-1">0 Documente</h3>
                    <p className="text-sm text-muted-foreground">Nu există documente noi de revizuit.</p>
                  </div>
                  <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-soft">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mb-4">
                      <User size={24} />
                    </div>
                    <h3 className="font-medium text-lg mb-1">Status Cont</h3>
                    <p className="text-sm text-muted-foreground">Cont activ. Toate datele sunt la zi.</p>
                  </div>
                </>
              )}
            </div>

            <div className="bg-card border border-border/60 rounded-3xl p-10 text-center shadow-soft">
              <div className="w-20 h-20 bg-muted/30 rounded-full mx-auto flex items-center justify-center text-muted-foreground mb-4">
                <LayoutDashboard size={32} />
              </div>
              <h2 className="text-xl font-medium mb-2">{user.role === 'ADMIN' ? 'Zona de Administrare' : 'Zona de Lucru'}</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {user.role === 'ADMIN' 
                  ? 'Acest panou vă va permite să gestionați conturile clienților, să încărcați documente și să răspundeți la cereri. Modulul este în construcție.'
                  : 'Acest dashboard va conține în viitor cererile, bilanțurile, și rapoartele contabile. Sistemul este în construcție.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
