import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createReport } from '../api/reportApi'
import AddressAutocomplete from '../components/AddressAutocomplete'
import styles from '../css/CitizenPage.module.css'

const VIOLATION_TYPES = [
    { value: 'ON_SIDEWALK', label: 'Parked on Sidewalk' },
    { value: 'DISABLED_SPACE_NO_PERMIT', label: 'Disabled Space – No Permit' },
    { value: 'BLOCKING_CROSSWALK', label: 'Blocking Crosswalk' },
    { value: 'BLOCKING_RAMP', label: 'Blocking Ramp' },
    { value: 'DOUBLE_PARKED', label: 'Double Parked' },
    { value: 'AT_BUS_STOP', label: 'At Bus Stop' },
    { value: 'BLOCKING_DRIVEWAY', label: 'Blocking Driveway' },
    { value: 'NEAR_INTERSECTION', label: 'Too Close to Intersection' },
    { value: 'LOADING_ZONE_UNAUTHORIZED', label: 'Unauthorized in Loading Zone' },
    { value: 'NO_PARKING_AREA', label: 'No Parking Area' },
    { value: 'OTHER', label: 'Other' },
]

const EMPTY_FORM = {
    licensePlate: '',
    violationType: '',
    locationAddress: '',
    locationLatitude: null,
    locationLongitude: null,
    description: ''
}

function CitizenPage() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const fileInputRef = useRef(null)

    const [photo, setPhoto] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [error, setError] = useState(null)
    const [addressError, setAddressError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resetKey, setResetKey] = useState(0)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleAddressSelect = (location) => {
        setAddressError(null)
        setForm((prev) => ({ ...prev, ...location }))
    }

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0] || null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.locationLatitude || !form.locationLongitude) {
            setAddressError('Please select an address from the dropdown suggestions.')
            return
        }

        setError(null)
        setAddressError(null)
        setSuccess(false)
        setLoading(true)

        try {
            await createReport({ ...form }, photo)
            setSuccess(true)
            setPhoto(null)
            setForm(EMPTY_FORM)
            setResetKey((prev) => prev + 1)
            if (fileInputRef.current) fileInputRef.current.value = ''
        } catch (err) {
            setError('Failed to submit report. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className={styles.page}>
        <header className={styles.header}>
        <span className={styles.headerTitle}>Parking Report Portal</span>
        <div className={styles.headerRight}>
        <span className={styles.headerEmail}>{user?.email}</span>
        <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
        </button>
        </div>
        </header>

        <main className={styles.main}>
        <div className={styles.card}>
        <h2 className={styles.title}>Submit a Parking Violation Report</h2>
        <p className={styles.subtitle}>
        Fill in the details below. All fields except photo and description are required.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
        <label className={styles.label}>License Plate</label>
        <input
        name="licensePlate"
        value={form.licensePlate}
        onChange={handleChange}
        className={styles.input}
        placeholder="e.g. ABC-1234"
        required
        />
        </div>

        <div className={styles.field}>
        <label className={styles.label}>Violation Type</label>
        <select
        name="violationType"
        value={form.violationType}
        onChange={handleChange}
        className={styles.input}
        required
        >
        <option value="">Select a violation...</option>
        {VIOLATION_TYPES.map((v) => (
            <option key={v.value} value={v.value}>
            {v.label}
            </option>
        ))}
        </select>
        </div>

        <div className={styles.field}>
        <label className={styles.label}>Address</label>
        <AddressAutocomplete
        onSelect={handleAddressSelect}
        resetKey={resetKey}
        />
        {addressError && <p className={styles.fieldError}>{addressError}</p>}
        </div>

        <div className={styles.field}>
        <label className={styles.label}>Photo Evidence (optional)</label>
        <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        />
        <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className={styles.uploadButton}
        >
        {photo ? '📎 Change Photo' : '📎 Attach Photo'}
        </button>
        {photo && (
            <p className={styles.photoName}>{photo.name}</p>
        )}
        </div>

        <div className={styles.field}>
        <label className={styles.label}>Description (optional)</label>
        <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className={styles.input}
        style={{ resize: 'vertical', minHeight: '90px' }}
        placeholder="Any additional details..."
        />
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {success && (
            <p className={styles.success}>Report submitted successfully.</p>
        )}

        <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Report'}
        </button>
        </form>
        </div>
        </main>
        </div>
    )
}

export default CitizenPage
