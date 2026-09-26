
import { useEffect, useState, useRef } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { LogOut, LayoutDashboard, FileText, User, Loader2, Users, UploadCloud, Download, CheckCircle, XCircle, Cloud, Activity, Clock, AlertCircle, Mail, ListTodo } from 'lucide-react'
import { useAuth } from '../auth'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, updateUser } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'documents'>(() => {
    if (typeof window !== 'undefined') {
      const tab = localStorage.getItem('contaudit_dashboard_tab') as any;
      return (tab === 'cloud' ? 'overview' : tab) || 'overview'
    }
    return 'overview'
  })

  useEffect(() => {
    localStorage.setItem('contaudit_dashboard_tab', activeTab)
  }, [activeTab])
  
  // Data states
  const [clients, setClients] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)
  
  // Upload states
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedClientForUpload, setSelectedClientForUpload] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login', replace: true })
      return
    }
    
    const token = localStorage.getItem('contaudit_token')

    // Sync user state to check if they verified their email on another device
    const syncUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const updatedUser = await res.json()
          if (updatedUser.isVerified !== user?.isVerified) {
            updateUser(updatedUser)
          }
        }
      } catch (e) {}
    }
    syncUser()

    // Fetch data based on role
    const fetchData = async () => {
      setLoadingData(true)
      try {
        if (user?.role === 'ADMIN') {
          // Fetch clients
          const res = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            setClients(data)
          }


          // Fetch activities
          const actRes = await fetch('/api/admin/activities', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (actRes.ok) {
            const data = await actRes.json()
            setActivities(data)
          }

          // Fetch requests
          const reqRes = await fetch('/api/admin/requests', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (reqRes.ok) {
            const data = await reqRes.json()
            setRequests(data)
          }
        } else {
          // Client fetching their own documents
          const res = await fetch('/api/client/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            setDocuments(data.documents || [])
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [isAuthenticated, user, navigate])

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  const handleDownload = async (docId: string, filename: string) => {
    const token = localStorage.getItem('contaudit_token')
    try {
      const res = await fetch(`/api/documents/${docId}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Eroare la descărcare')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      showToast(e.message, 'error')
    }
  }

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleUpload = async (clientId: string) => {
    if (!file || !clientId) return
    
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', file.name)
    
    const token = localStorage.getItem('contaudit_token')
    
    try {
      const res = await fetch(`/api/admin/documents/${clientId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (res.ok) {
        const newDoc = await res.json()
        setDocuments(prev => [newDoc, ...prev])
        showToast('Document încărcat cu succes!', 'success')
        setFile(null)
        setUploadModalOpen(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        const error = await res.json()
        throw new Error(error.error || 'Eroare la încărcare')
      }
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  const updateClientStatus = async (clientId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/users/${clientId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('contaudit_token')}`
        },
        body: JSON.stringify({ monthlyStatus: status })
      })
      if (res.ok) {
        setClients(clients.map(c => c.id === clientId ? { ...c, monthlyStatus: status } : c))
      }
    } catch (e) {}
  }

  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  const handleResend = async () => {
    if (!user?.email) return
    setResending(true)
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      })
      const data = await res.json()
      setResendMsg(data.message || data.error)
    } catch(e) {
      setResendMsg('Eroare la retrimitere')
    }
    setResending(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <Loader2 size={40} className="animate-spin text-gold mb-4" />
      </div>
    )
  }

  if (!user.isVerified) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <div className="bg-background/80 backdrop-blur-xl p-8 shadow-xl border border-border/50 rounded-3xl text-center max-w-md w-full">
          <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-medium text-foreground mb-4">Verificare Necesară</h2>
          <p className="text-muted-foreground mb-6">
            Contul tău nu este încă activat. Te rugăm să verifici adresa de email (<strong>{user.email}</strong>) și să dai click pe linkul primit.
          </p>
          <button 
            onClick={handleResend} 
            disabled={resending}
            className="w-full h-12 mb-4 rounded-full bg-navy text-navy-foreground font-medium hover:bg-navy/90 hover:shadow-[0_8px_20px_rgba(26,35,64,0.25)] transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {resending ? <Loader2 className="animate-spin" size={18} /> : null}
            Retrimite Email de Verificare
          </button>
          
          {resendMsg && (
            <p className="text-sm font-medium text-gold mb-4 bg-gold/10 p-2 rounded-lg">{resendMsg}</p>
          )}

          <button onClick={logout} className="text-sm text-muted-foreground hover:text-foreground underline cursor-pointer">
            Delogare
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-xl flex items-center gap-3 z-50 text-white animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span className="font-medium text-sm">{toast.msg}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border/50 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border/50">
          <Link to="/" className="flex items-baseline gap-0.5 group">
            <span className="font-display text-2xl tracking-tight text-navy group-hover:text-gold transition-colors">contaudit</span>
            <span className="text-xs font-semibold text-muted-foreground">.eu</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}>
            <LayoutDashboard size={18} />
            Privire de ansamblu
          </button>
          
          {user.role === 'ADMIN' ? (
            <>
              <button onClick={() => setActiveTab('clients')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'clients' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}>
                <Users size={18} />
                Clienți și Documente
              </button>
            </>
          ) : (
            <button onClick={() => setActiveTab('documents')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'documents' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}>
              <FileText size={18} />
              Documentele Mele
            </button>
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Deconectare
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="md:hidden bg-background border-b border-border/50 p-4 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-0.5 group">
            <span className="font-display text-xl tracking-tight text-navy group-hover:text-gold transition-colors">contaudit</span>
            <span className="text-xs font-semibold text-muted-foreground">.eu</span>
          </Link>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive cursor-pointer">
            <LogOut size={20} />
          </button>
        </header>

        <div className="p-6 md:p-10 w-full max-w-5xl mx-auto">
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="font-display text-3xl font-medium text-foreground mb-2">
                Salut, {user.name?.split(' ')[0] || 'Client'}!
              </h1>
              <p className="text-muted-foreground mb-10">
                Bine ați venit în portalul dumneavoastră securizat.
              </p>

              {user.role === 'ADMIN' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-soft cursor-pointer hover:border-gold/30 transition-all" onClick={() => setActiveTab('clients')}>
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <Users size={24} />
                      </div>
                      <h3 className="font-medium text-lg mb-1">{clients.length} Clienți</h3>
                      <p className="text-sm text-muted-foreground">Gestionează toți clienții înregistrați.</p>
                    </div>
                    
                    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-soft">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <AlertCircle size={24} />
                      </div>
                      <h3 className="font-medium text-lg mb-1">{clients.filter(c => !c.isVerified).length} Conturi Noi</h3>
                      <p className="text-sm text-muted-foreground">Clienți care nu și-au confirmat emailul.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-display text-xl font-medium mb-6 flex items-center gap-2"><Activity size={20} className="text-primary"/> Activitate Recentă</h3>
                      <div className="bg-background border border-border/60 rounded-3xl p-6 shadow-soft h-[350px] overflow-y-auto">
                        {activities.length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">Nicio activitate înregistrată încă.</p>
                        ) : (
                          <div className="space-y-6">
                            {activities.slice(0, 10).map((act: any) => (
                              <div key={act.id} className="flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                  <Clock size={14} />
                                </div>
                                <div>
                                  <p className="text-foreground text-sm font-medium">{act.user?.name || 'Sistem'}</p>
                                  <p className="text-muted-foreground text-sm">{act.details}</p>
                                  <p className="text-xs text-muted-foreground/70 mt-1">{new Date(act.createdAt).toLocaleString('ro-RO')}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-medium mb-6 flex items-center gap-2"><ListTodo size={20} className="text-primary"/> Cereri în Așteptare</h3>
                      <div className="bg-background border border-border/60 rounded-3xl p-6 shadow-soft h-[350px] overflow-y-auto">
                        {requests.filter(r => r.status === 'PENDING').length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                              <CheckCircle size={32} />
                            </div>
                            <p className="font-medium text-lg">Totul e la zi!</p>
                            <p className="text-muted-foreground text-sm">Nu există nicio cerere în așteptare.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {requests.filter(r => r.status === 'PENDING').map((req: any) => (
                              <div key={req.id} className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20">
                                <div className="flex justify-between items-start mb-2">
                                  <p className="font-medium text-foreground">{req.client?.name}</p>
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-700 px-2 py-1 rounded-full">Pending</span>
                                </div>
                                <p className="text-sm font-medium">{req.title}</p>
                                {req.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{req.description}</p>}
                                <p className="text-xs text-muted-foreground/70 mt-3">{new Date(req.createdAt).toLocaleString('ro-RO')}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* CLIENT OVERVIEW */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-2 space-y-6">
                      {/* Status Semafor */}
                      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-soft relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                          <CheckCircle size={100} />
                        </div>
                        <h3 className="font-medium text-lg mb-4 text-muted-foreground">Statusul Lunii Curente</h3>
                        <div className="flex items-center gap-4">
                          {user.monthlyStatus === 'WAITING' && (
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full bg-amber-400 animate-pulse"></div>
                              <p className="text-xl font-medium text-amber-500">Așteptăm Documentele</p>
                            </div>
                          )}
                          {user.monthlyStatus === 'PROCESSING' && (
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse"></div>
                              <p className="text-xl font-medium text-blue-500">În procesare</p>
                            </div>
                          )}
                          {(user.monthlyStatus === 'DONE' || !user.monthlyStatus) && (
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                              <p className="text-xl font-medium text-green-500">La zi / Finalizat</p>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 max-w-md">
                          {user.monthlyStatus === 'WAITING' && 'Te rugăm să ne trimiți documentele și facturile aferente lunii trecute pentru a putea începe lucrul.'}
                          {user.monthlyStatus === 'PROCESSING' && 'Am primit documentele tale. Echipa noastră lucrează la prelucrarea lor și întocmirea balanței.'}
                          {(user.monthlyStatus === 'DONE' || !user.monthlyStatus) && 'Totul este perfect! Nu ai nicio sarcină în așteptare pentru luna aceasta.'}
                        </p>
                      </div>

                      {/* Recent Documents */}
                      <div className="bg-background border border-border/60 rounded-3xl p-6 shadow-soft">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-medium text-lg flex items-center gap-2"><FileText size={18} className="text-primary"/> Ultimele Documente</h3>
                          <button onClick={() => setActiveTab('documents')} className="text-sm text-primary hover:underline cursor-pointer">Vezi toate</button>
                        </div>
                        {documents.length === 0 ? (
                          <p className="text-muted-foreground text-sm">Nu ai primit niciun document încă.</p>
                        ) : (
                          <div className="space-y-3">
                            {documents.slice(0, 3).map((doc: any) => (
                              <div key={doc.id} className="flex items-center justify-between p-3 rounded-2xl bg-surface hover:bg-surface/80 transition-colors border border-border/40">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                                    <FileText size={18} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium line-clamp-1">{doc.title}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString('ro-RO')}</p>
                                  </div>
                                </div>
                                <button onClick={() => handleDownload(doc.id, doc.title)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer" title="Descarcă">
                                  <Download size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-navy rounded-3xl p-6 text-white shadow-soft relative overflow-hidden h-full">
                        <div className="absolute -bottom-10 -right-10 opacity-10">
                          <Mail size={120} />
                        </div>
                        <h3 className="font-display text-xl font-medium mb-2">Ai o întrebare urgentă?</h3>
                        <p className="text-white/70 text-sm mb-6">Trimite-ne un mesaj direct din portal. Îți vom răspunde în cel mai scurt timp.</p>
                        <a href="mailto:office@contaudit.eu" className="w-full inline-flex items-center justify-center gap-2 h-12 bg-white text-navy font-medium rounded-xl hover:bg-white/90 transition-colors">
                          <Mail size={18} />
                          Contactează-ne
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'clients' && user.role === 'ADMIN' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-3xl font-medium text-foreground">Management Clienți</h2>
                  <p className="text-muted-foreground mt-1">Selectați un client din tabel pentru a-i încărca documente securizate.</p>
                </div>
              </div>

              {/* Client List */}
              <div className="bg-background border border-border/60 rounded-3xl overflow-hidden shadow-soft">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface/50 border-b border-border/50 text-sm text-muted-foreground">
                      <th className="p-4 font-medium">Nume Client</th>
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium">Data Înregistrării</th>
                      <th className="p-4 font-medium">Status Lună</th>
                      <th className="p-4 font-medium text-right">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingData ? (
                      <tr><td colSpan={5} className="p-8 text-center text-muted-foreground"><Loader2 className="animate-spin mx-auto" /></td></tr>
                    ) : clients.filter(c => c.role !== 'ADMIN').length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Niciun client înregistrat.</td></tr>
                    ) : (
                      clients.filter(c => c.role !== 'ADMIN').map((client) => (
                        <tr key={client.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                          <td className="p-4 font-medium text-foreground flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                              {client.name.charAt(0)}
                            </div>
                            {client.name}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{client.email}</td>
                          <td className="p-4 text-sm text-muted-foreground">{new Date(client.createdAt).toLocaleDateString('ro-RO')}</td>
                          <td className="p-4">
                            <select 
                              value={client.monthlyStatus || 'WAITING'}
                              onChange={(e) => updateClientStatus(client.id, e.target.value)}
                              className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${
                                client.monthlyStatus === 'WAITING' ? 'bg-amber-400/20 text-amber-600' :
                                client.monthlyStatus === 'PROCESSING' ? 'bg-blue-400/20 text-blue-600' :
                                'bg-green-500/20 text-green-600'
                              }`}
                            >
                              <option value="WAITING">Așteptăm Documente</option>
                              <option value="PROCESSING">În Procesare</option>
                              <option value="DONE">La Zi</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => {
                                setSelectedClientForUpload(client)
                                setUploadModalOpen(true)
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy/5 text-navy hover:bg-navy/10 font-medium text-sm transition-colors cursor-pointer"
                            >
                              <UploadCloud size={16} />
                              Încarcă
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}



          {activeTab === 'documents' && user.role !== 'ADMIN' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-3xl font-medium text-foreground">Documentele Mele</h2>
                  <p className="text-muted-foreground mt-1">Aici veți găsi rapoartele de audit și bilanțurile financiare.</p>
                </div>
              </div>

              {documents.length === 0 ? (
                <div className="bg-background border border-border/60 rounded-3xl overflow-hidden shadow-soft text-center py-16">
                  <div className="w-20 h-20 bg-muted/30 rounded-full mx-auto flex items-center justify-center text-muted-foreground mb-4">
                    <FileText size={32} />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Nu există documente noi</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Auditorul dumneavoastră va încărca rapoartele aici imediat ce sunt finalizate.
                  </p>
                </div>
              ) : (
                <div className="bg-background border border-border/60 rounded-3xl overflow-hidden shadow-soft">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface/50 border-b border-border/50 text-sm text-muted-foreground">
                        <th className="p-4 font-medium">Nume Document</th>
                        <th className="p-4 font-medium">Data Încărcării</th>
                        <th className="p-4 font-medium text-right">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                          <td className="p-4 font-medium text-foreground flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                              <FileText size={18} />
                            </div>
                            {doc.title}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString('ro-RO')}</td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleDownload(doc.id, doc.title)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy/5 text-navy hover:bg-navy/10 font-medium text-sm transition-colors cursor-pointer"
                            >
                              <Download size={16} />
                              Descarcă
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Upload Modal (Global) */}
        {uploadModalOpen && selectedClientForUpload && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-surface border border-border/60 rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
              <button 
                onClick={() => { setUploadModalOpen(false); setFile(null); }}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <XCircle size={24} />
              </button>
              
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <UploadCloud size={24} />
              </div>
              
              <h3 className="font-display text-2xl font-medium mb-2">Încărcare Document</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Pentru: <strong className="text-foreground">{selectedClientForUpload.name}</strong>
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpload(selectedClientForUpload.id);
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-3 ml-1">Selectați Fișierul</label>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    required
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-muted-foreground file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors bg-background border border-border/50 rounded-xl p-2"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={uploading}
                  className="w-full h-12 rounded-xl bg-navy text-navy-foreground font-medium hover:bg-navy/90 hover:shadow-[0_8px_20px_rgba(26,35,64,0.25)] transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                  {uploading ? 'Se încarcă securizat...' : 'Confirmă Încărcarea'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
