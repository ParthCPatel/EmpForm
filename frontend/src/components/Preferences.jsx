import React from 'react';
import './FormSection.css';

const Preferences = ({ data, onChange }) => {
    const skills = ['Excellent', 'Good', 'Average', 'Poor'];

    const [error, setError] = React.useState('');

    const handleChange = (field, value) => {
        onChange(field, value);

        if (field === 'timeFrom') {
            if (data.timeTo && value >= data.timeTo) {
                setError('Available From must be earlier than Available To');
            } else {
                setError('');
            }
        } else if (field === 'timeTo') {
            if (data.timeFrom && value <= data.timeFrom) {
                setError('Available To must be later than Available From');
            } else {
                setError('');
            }
        } else if (field === 'nightShift' && !value) {
            setError('');
        }
    };

    return (
        <div className="form-section">
            <div className="section-header">
                <div className="section-indicator"></div>
                <h3>Preferences & Availability</h3>
            </div>

            <div className="form-row preferences-row">
                <div className="form-group">
                    <label className="label-with-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Communication Skill
                    </label>
                    <div className="segmented-control">
                        {skills.map(skill => (
                            <button
                                key={skill}
                                type="button"
                                className={`segment-btn ${data.communication === skill ? 'active' : ''}`}
                                onClick={() => handleChange('communication', skill)}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="label-with-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                        Avl. for Night Meeting
                    </label>
                    <div className="toggle-wrapper" onClick={() => handleChange('nightShift', !data.nightShift)}>
                        <div className={`toggle-switch ${data.nightShift ? 'on' : 'off'}`}>
                            <div className="toggle-handle"></div>
                        </div>
                        <span className="toggle-label">{data.nightShift ? 'Yes' : 'No'}</span>
                    </div>
                </div>

                <div className="form-group">
                    <label className="label-with-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Timing
                    </label>
                    <div className="time-range">
                        <div className="time-box-group">
                            <span className="time-box-label">Available From</span>
                            <div className={`time-box ${!data.nightShift ? 'time-box-disabled' : ''} ${error ? 'time-box-error' : ''}`}>
                                <input
                                    type="time"
                                    className="time-box-input"
                                    value={data.timeFrom}
                                    onChange={(e) => handleChange('timeFrom', e.target.value)}
                                    disabled={!data.nightShift}
                                />
                                <svg className="time-box-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                        </div>
                        <div className="time-box-group">
                            <span className="time-box-label">Available To</span>
                            <div className={`time-box ${!data.nightShift ? 'time-box-disabled' : ''} ${error ? 'time-box-error' : ''}`}>
                                <input
                                    type="time"
                                    className="time-box-input"
                                    value={data.timeTo}
                                    onChange={(e) => handleChange('timeTo', e.target.value)}
                                    disabled={!data.nightShift}
                                />
                                <svg className="time-box-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {error && <div className="error-message-time">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default Preferences;
