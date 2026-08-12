import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Lock, Mail, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Autentificare eșuată')
      }
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      navigate({ to: '/dashboard' })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-navy/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-baseline gap-0.5 group">
            <span className="font-display text-3xl tracking-tight text-navy group-hover:text-gold transition-colors">contaudit</span>
            <span className="text-sm font-semibold text-muted-foreground">.eu</span>
          </Link>
          <h1 className="mt-8 font-display text-3xl font-medium">Portal Clienți</h1>
          <p className="text-muted-foreground mt-2">Conectați-vă pentru a accesa documentele</p>
        </div>

        <div className="bg-background/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 pl-11 pr-5 rounded-full border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                  placeholder="adresa@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-foreground">Parolă</label>
                <a href="#" className="text-xs text-primary hover:text-gold transition-colors">Ați uitat parola?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 pl-11 pr-5 rounded-full border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 mt-4 rounded-full bg-navy text-navy-foreground font-medium hover:bg-navy/90 hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Se conectează...
                </>
              ) : (
                <>
                  Autentificare
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Nu aveți cont încă?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-gold transition-colors">
              Înregistrați-vă
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
