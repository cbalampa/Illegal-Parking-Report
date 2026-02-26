import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllReports, updateReportStatus } from '../api/reportApi'
import styles from '../css/AdminPage.module.css'

const STATUS_OPTIONS = ['PENDING', 'IN_PROGRESS', 'FULFILLED', 'DECLINED']

const STATUS_COLORS = {
    PENDING: '#f59e0b',
    IN_PROGRESS: '#2563eb',
    FULFILLED: '#16a34a',
    DECLINED: '#dc2626'
}

const SORTABLE_COLUMNS = [
    { field: 'reportId', label: 'ID' },
    { field: 'licensePlate', label: 'Plate' },
    { field: 'violationType', label: 'Violation' },
    { field: 'locationAddress', label: 'Address' },
    { field: 'status', label: 'Status' },
    { field: 'createdAt', label: 'Submitted' },
]

function AdminPage() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sortField, setSortField] = useState('createdAt')
    const [sortDirection, setSortDirection] = useState('desc')
    const [statusFilter, setStatusFilter] = useState('ALL')

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getAllReports()
            setReports(response.data)
        } catch (err) {
            setError('Failed to load reports.')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (reportId, newStatus) => {
        try {
            const response = await updateReportStatus(reportId, newStatus)
            setReports(reports.map(r =>
            r.reportId === reportId ? response.data : r
            ))
        } catch (err) {
            alert('Failed to update status.')
        }
    }

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const filteredReports = reports.filter(r =>
    statusFilter === 'ALL' ? true : r.status === statusFilter
    )

    const sortedReports = [...filteredReports].sort((a, b) => {
        let aVal = a[sortField]
        let bVal = b[sortField]

        if (typeof aVal === 'string') aVal = aVal.toLowerCase()
            if (typeof bVal === 'string') bVal = bVal.toLowerCase()

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
                    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
                        return 0
    })

    const SortIndicator = ({ field }) => {
        if (sortField !== field) return <span className={styles.sortInactive}>↕</span>
            return <span>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
    }

    return (
        <div className={styles.page}>
        <header className={styles.header}>
        <span className={styles.headerTitle}>Parking Report Portal — Admin</span>
        <div className={styles.headerRight}>
        <span className={styles.headerEmail}>{user?.email}</span>
        <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
        </button>
        </div>
        </header>

        <main className={styles.main}>
        <div className={styles.toolbar}>
        <h2 className={styles.title}>Parking Violation Reports</h2>
        <div className={styles.toolbarRight}>
        <label className={styles.filterLabel}>Filter by status:</label>
        <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className={styles.filterSelect}
        >
        <option value="ALL">All</option>
        {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
        ))}
        </select>
        <button onClick={fetchReports} className={styles.refreshButton}>
        Refresh
        </button>
        </div>
        </div>

        {loading && <p className={styles.info}>Loading reports...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && sortedReports.length === 0 && (
            <p className={styles.info}>No reports found.</p>
        )}

        {!loading && !error && sortedReports.length > 0 && (
            <div className={styles.tableWrapper}>
            <table className={styles.table}>
            <thead>
            <tr>
            {SORTABLE_COLUMNS.map(col => (
                <th
                key={col.field}
                className={styles.th}
                onClick={() => handleSort(col.field)}
                >
                {col.label}
                <SortIndicator field={col.field} />
                </th>
            ))}
            <th className={styles.thNoSort}>Photo</th>
            <th className={styles.thNoSort}>Vehicle Info</th>
            <th className={styles.thNoSort}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {sortedReports.map(report => (
                <tr key={report.reportId} className={styles.tr}>
                <td className={styles.td}>#{report.reportId}</td>
                <td className={styles.td}>{report.licensePlate}</td>
                <td className={styles.td}>{report.violationType.replace(/_/g, ' ')}</td>
                <td className={styles.td}>{report.locationAddress}</td>
                <td className={styles.td}>
                <span
                className={styles.badge}
                style={{ backgroundColor: STATUS_COLORS[report.status] }}
                >
                {report.status}
                </span>
                </td>
                <td className={styles.td}>
                {new Date(report.createdAt).toLocaleDateString('el-GR')}
                </td>
                <td className={styles.td}>
                {report.photo_url ? (
                    <a
                    href={report.photo_url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.photoLink}
                    >
                    View Photo
                    </a>
                ) : (
                    <span className={styles.muted}>None</span>
                )}
                </td>
                <td className={styles.td}>
                {report.vehicleInfo ? (
                    <span>
                    {report.vehicleInfo.ownerName}<br />
                    <span className={styles.vehicleSub}>
                    {report.vehicleInfo.vehicleColor}{' '}
                    {report.vehicleInfo.vehicleManufacturer}{' '}
                    {report.vehicleInfo.vehicleModel}
                    </span>
                    </span>
                ) : (
                    <span className={styles.muted}>Not registered</span>
                )}
                </td>
                <td className={styles.td}>
                <select
                value={report.status}
                onChange={(e) => handleStatusChange(report.reportId, e.target.value)}
                className={styles.actionSelect}
                >
                {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
                </select>
                </td>
                </tr>
            ))}
            </tbody>
            </table>
            </div>
        )}
        </main>
        </div>
    )
}

export default AdminPage
