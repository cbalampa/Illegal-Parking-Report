import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api/userApi'
import styles from '../css/RegisterPage.module.css'

function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (password !== confirm) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)
        try {
            await registerUser({ email, password })
            navigate('/login')
        } catch (err) {
            const message = err.response?.data?.message
            setError(message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
        <div className={styles.card}>
        <h1 className={styles.title}>Parking Report Portal</h1>
        <p className={styles.subtitle}>Create a citizen account</p>

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

        <div className={styles.field}>
        <label className={styles.label}>Confirm Password</label>
        <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className={styles.input}
        placeholder="••••••••"
        required
        />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Creating account...' : 'Register'}
        </button>
        </form>

        <p className={styles.loginText}>
        Already have an account?{' '}
        <span className={styles.link} onClick={() => navigate('/login')}>
        Sign in
        </span>
        </p>
        </div>
        </div>
    )
}

export default RegisterPage
