import React, { useState } from 'react';
import './SummaryPage.css'; // Reusing summary page styles for consistency

const AdminPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginAndExport = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://empform-2h9m.onrender.com/api';
            const response = await fetch(`${API_URL}/export`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid credentials');
                }
                throw new Error('Export failed');
            }

            // Handle blob download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'applicants_export.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Optional: clear password after success
            setPassword('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="summary-container" style={{ maxWidth: '400px', marginTop: '100px' }}>
            <div className="summary-header" style={{ justifyContent: 'center' }}>
                <h2 className="page-title">Admin Export</h2>
            </div>

            <div className="summary-section" style={{ padding: '32px' }}>
                <form onSubmit={handleLoginAndExport} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input" // Using existing class from FormSection.css if available, else standard style
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    {error && <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</div>}

                    <button
                        type="submit"
                        className="next-btn"
                        disabled={isLoading}
                        style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                    >
                        {isLoading ? 'Downloading...' : 'Login & Download CSV'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminPage;
