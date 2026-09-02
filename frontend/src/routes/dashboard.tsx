
import { useEffect, useState, useRef } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { LogOut, LayoutDashboard, FileText, User, Loader2, Users, UploadCloud, Download, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../auth'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'documents'>('overview')
  
  // Data states
  const [clients, setClients] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)
  
  // Upload states
  const [selectedClient, setSelectedClient] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login', replace: true })
      return
    }
    
    // Fetch data based on role
    const fetchData = async () => {
      setLoadingData(true)
      const token = localStorage.getItem('contaudit_token')
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !selectedClient) return
    
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', file.name)
    
    const token = localStorage.getItem('contaudit_token')
    
    try {
      const res = await fetch(`/api/admin/documents/${selectedClient}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (res.ok) {
        showToast('Document încărcat cu succes!', 'success')
        setFile(null)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <Loader2 size={40} className="animate-spin text-gold mb-4" />
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
            <button onClick={() => setActiveTab('clients')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'clients' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}>
              <Users size={18} />
              Clienți și Documente
            </button>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.role === 'ADMIN' ? (
                  <>
                    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-soft cursor-pointer hover:border-gold/30 transition-all" onClick={() => setActiveTab('clients')}>
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <Users size={24} />
                      </div>
                      <h3 className="font-medium text-lg mb-1">{clients.length} Clienți</h3>
                      <p className="text-sm text-muted-foreground">Gestionează toți clienții înregistrați.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-soft cursor-pointer hover:border-gold/30 transition-all" onClick={() => setActiveTab('documents')}>
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <FileText size={24} />
                      </div>
                      <h3 className="font-medium text-lg mb-1">{documents.length} Documente</h3>
                      <p className="text-sm text-muted-foreground">Raportări și documente financiare.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'clients' && user.role === 'ADMIN' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-3xl font-medium text-foreground">Management Clienți</h2>
                  <p className="text-muted-foreground mt-1">Selectați un client pentru a încărca documente securizate.</p>
                </div>
              </div>

              {/* Upload Form */}
              <div className="bg-background border border-border/60 rounded-3xl p-6 shadow-soft mb-8">
                <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                  <UploadCloud size={20} className="text-primary" />
                  Încărcare Document Nou
                </h3>
                <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-muted-foreground mb-2 ml-1">Selectați Clientul</label>
                    <select 
                      required
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                    >
                      <option value="" disabled>Alegeți un client...</option>
                      {clients.filter(c => c.role !== 'ADMIN').map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-muted-foreground mb-2 ml-1">Fișier (PDF, Excel)</label>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      required
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-muted-foreground file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={uploading}
                    className="w-full md:w-auto h-11 px-8 rounded-xl bg-navy text-navy-foreground font-medium hover:bg-navy/90 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                    {uploading ? 'Se încarcă...' : 'Încărcare'}
                  </button>
                </form>
              </div>

              {/* Client List */}
              <div className="bg-background border border-border/60 rounded-3xl overflow-hidden shadow-soft">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface/50 border-b border-border/50 text-sm text-muted-foreground">
                      <th className="p-4 font-medium">Nume Client</th>
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium">Data Înregistrării</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingData ? (
                      <tr><td colSpan={3} className="p-8 text-center text-muted-foreground"><Loader2 className="animate-spin mx-auto" /></td></tr>
                    ) : clients.filter(c => c.role !== 'ADMIN').length === 0 ? (
                      <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">Niciun client înregistrat.</td></tr>
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
      </main>
    </div>
  )
}
