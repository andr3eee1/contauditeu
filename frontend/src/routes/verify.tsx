import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/verify')({
  component: VerifyEmail,
})

function VerifyEmail() {
  const search: { token?: string } = Route.useSearch()
  const token = search.token
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Se verifică adresa de email...')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Link invalid. Lipsește codul de verificare.')
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`)
        const data = await res.json()
        
        if (res.ok) {
          setStatus('success')
          setMessage(data.message || 'Contul tău a fost activat cu succes!')
        } else {
          setStatus('error')
          setMessage(data.error || 'Acest link este invalid sau a expirat.')
        }
      } catch (err) {
        setStatus('error')
        setMessage('A apărut o eroare la conexiunea cu serverul.')
      }
    }
    
    verify()
  }, [token])

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="text-2xl font-display font-medium text-navy text-center block mb-8">
          CONTAUDIT
        </Link>
        <div className="bg-background/80 backdrop-blur-xl py-8 px-4 shadow-xl border border-border/50 rounded-3xl sm:px-10 text-center">
          
          {status === 'loading' && (
            <div className="w-16 h-16 bg-navy/5 text-navy rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 size={32} className="animate-spin" />
            </div>
          )}
          
          {status === 'success' && (
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
          )}
          
          {status === 'error' && (
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} />
            </div>
          )}
          
          <h2 className="text-2xl font-medium text-foreground mb-4">
            {status === 'loading' ? 'Verificare...' : status === 'success' ? 'Cont Activat!' : 'Eroare'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {message}
          </p>
          
          {status !== 'loading' && (
            <Link to="/login" className="w-full inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy/90 transition-all">
              Mergi la Autentificare
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
