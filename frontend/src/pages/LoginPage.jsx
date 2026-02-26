import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../api/userApi'
import styles from '../css/LoginPage.module.css'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const response = await loginUser({ email, password })
            const userData = response.data
            login(userData)

            if (userData.role === 'ADMIN') {
                navigate('/admin')
            } else {
                navigate('/citizen')
            }
        } catch (err) {
            setError('Invalid email or password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
        <div className={styles.card}>
        <h1 className={styles.title}>Parking Report Portal</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
        placeholder="you@example.com"
        required
        />
        </div>

        <div className={styles.field}>
        <label className={styles.label}>Password</label>
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
        placeholder="••••••••"
        required
        />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
        </button>
        </form>

        <p className={styles.registerText}>
        Don't have an account?{' '}
        <span className={styles.link} onClick={() => navigate('/register')}>
        Register
        </span>
        </p>
        </div>
        </div>
    )
}

export default LoginPage
