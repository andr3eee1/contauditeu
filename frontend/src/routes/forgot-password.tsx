import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPassword,
})

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'A apărut o eroare')
      }
      
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="text-2xl font-display font-medium text-navy text-center block mb-8">
            CONTAUDIT
          </Link>
          <div className="bg-background/80 backdrop-blur-xl py-8 px-4 shadow-xl border border-border/50 rounded-3xl sm:px-10 text-center">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-medium text-foreground mb-4">Verifică-ți Email-ul</h2>
            <p className="text-muted-foreground mb-8">
              Dacă adresa <strong>{email}</strong> există în baza noastră de date, vei primi un email cu instrucțiunile pentru resetarea parolei.
            </p>
            <Link to="/login" className="w-full h-12 rounded-full bg-navy text-navy-foreground font-medium hover:bg-navy/90 hover:shadow-[0_8px_20px_rgba(26,35,64,0.25)] transition-all hover:-translate-y-0.5 flex items-center justify-center cursor-pointer">
              Înapoi la Autentificare
            </Link>
          </div>
        </div>
      </div>
    )
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
          <h1 className="mt-8 font-display text-3xl font-medium">Resetare Parolă</h1>
          <p className="text-muted-foreground mt-2">Introdu adresa de email pentru a primi linkul de resetare.</p>
        </div>

        <div className="bg-background/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-surface/50 border border-border rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all text-sm"
                  placeholder="nume@exemplu.ro"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !email}
              className="w-full h-12 mt-4 rounded-full bg-navy text-navy-foreground font-medium hover:bg-navy/90 hover:shadow-[0_8px_20px_rgba(26,35,64,0.25)] transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : null}
              Trimite Link
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} />
              Înapoi
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
