import React from 'react';
import './FormSection.css';

const BasicInfo = ({ data, onChange }) => {
    const [errors, setErrors] = React.useState({});

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validateMobile = (mobile) => {
        return String(mobile).match(/^\d{10}$/);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        onChange(id, value);

        // Real-time validation
        if (id === 'email') {
            if (value && !validateEmail(value)) {
                setErrors(prev => ({ ...prev, email: 'Invalid email address' }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.email;
                    return newErrors;
                });
            }
        }

        if (id === 'mobile') {
            if (value && !validateMobile(value)) {
                setErrors(prev => ({ ...prev, mobile: 'Mobile number must be 10 digits' }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.mobile;
                    return newErrors;
                });
            }
        }
    };

    return (
        <div className="form-section">
            <div className="section-header">
                <div className="section-indicator"></div>
                <h3>Basic Information</h3>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="name" className="required">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={handleChange}
                        placeholder="Full name"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="required">Email</label>
                    <div className="input-with-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <input
                            type="email"
                            id="email"
                            value={data.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            className={`form-input ${errors.email ? 'input-error' : ''}`}
                        />
                    </div>
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="mobile" className="required">Mobile Number</label>
                    <div className="input-with-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.12 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <input
                            type="tel"
                            id="mobile"
                            value={data.mobile}
                            onChange={handleChange}
                            placeholder="1234567890"
                            className={`form-input ${errors.mobile ? 'input-error' : ''}`}
                            maxLength="10"
                        />
                    </div>
                    {errors.mobile && <span className="error-text">{errors.mobile}</span>}
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;
