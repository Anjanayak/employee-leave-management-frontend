import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import { getErrorMessage } from '../services/api'

export default function Login() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return <div className="login-screen"><div className="login-art"><div className="login-art-content"><span className="brand-mark large">L</span><p className="eyebrow light">LEAVE MANAGEMENT PLATFORM</p><h1>People first.<br/>Work flows better.</h1><p className="art-copy">A central place to manage teams, leave requests and administrative activity.</p><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/></div></div>
    <div className="login-panel"><form className="login-form" onSubmit={submit}><span className="eyebrow">ADMINISTRATOR ACCESS</span><h2>Welcome back</h2><p className="muted">Sign in to your administration workspace.</p>
      <label>Username<input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" required /></label>
      <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required /></label>
      {error && <div className="alert">{error}</div>}
      <button className="button button-primary full" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
      <p className="login-foot">Secure administrator access</p>
    </form></div></div>
}