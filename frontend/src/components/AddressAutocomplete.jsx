import { useState, useEffect, useRef } from 'react'
import styles from '../css/AddressAutocomplete.module.css'

function AddressAutocomplete({ onSelect, resetKey }) {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const debounceTimer = useRef(null)
    const wrapperRef = useRef(null)

    useEffect(() => {
        setQuery('')
        setSuggestions([])
        setShowDropdown(false)
    }, [resetKey])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false)
                setSuggestions([])
            }
        }
        window.addEventListener('mousedown', handleClickOutside)
        return () => window.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleChange = (e) => {
        const value = e.target.value
        setQuery(value)

        if (debounceTimer.current) clearTimeout(debounceTimer.current)

            if (value.trim().length < 3) {
                setSuggestions([])
                setShowDropdown(false)
                return
            }

            debounceTimer.current = setTimeout(() => {
                fetchSuggestions(value)
            }, 350)
    }

    const fetchSuggestions = async (input) => {
        setLoading(true)
        try {
            const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=5&lang=en`
            const res = await fetch(url)
            const data = await res.json()

            const results = data.features.map((feature) => {
                const p = feature.properties
                const parts = [p.name, p.street, p.housenumber, p.city, p.country]
                .filter(Boolean)
                const label = parts.join(', ')
                const [longitude, latitude] = feature.geometry.coordinates

                return { label, latitude, longitude }
            })

            setSuggestions(results)
            setShowDropdown(results.length > 0)
        } catch (err) {
            console.error('Geocoding error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSelect = (suggestion) => {
        setQuery(suggestion.label)
        setSuggestions([])
        setShowDropdown(false)
        onSelect({
            locationAddress: suggestion.label,
            locationLatitude: suggestion.latitude,
            locationLongitude: suggestion.longitude
        })
    }

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
        <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        placeholder="Start typing an address..."
        className={styles.input}
        autoComplete="off"
        required
        />
        {loading && <p className={styles.hint}>Searching...</p>}
        {showDropdown && (
            <ul className={styles.dropdown}>
            {suggestions.map((s, i) => (
                <li
                key={i}
                className={styles.option}
                onMouseDown={() => handleSelect(s)}
                >
                {s.label}
                </li>
            ))}
            </ul>
        )}
        </div>
    )
}

export default AddressAutocomplete
