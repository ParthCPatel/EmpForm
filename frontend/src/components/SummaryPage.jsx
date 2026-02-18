import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitApplication } from '../services/api';
import './SummaryPage.css';
import SuccessModal from './SuccessModal';
import CustomDropdown from './CustomDropdown';

const SummaryPage = ({ personalInfo, selectedSkills, preferences }) => {
    const navigate = useNavigate();
    const [proficiencies, setProficiencies] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const proficiencyLevels = [
        'Beginner',
        'Intermediate',
        'Advanced',
        'Expert',
        'Specialists'
    ];

    const handleProficiencyChange = (skill, level) => {
        setProficiencies(prev => ({
            ...prev,
            [skill]: level
        }));
    };

    const skillsArray = Array.from(selectedSkills);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        // Validation: Check if all skills have a proficiency selected
        const missingProficiencies = skillsArray.filter(skill => !proficiencies[skill]);

        if (missingProficiencies.length > 0) {
            setSubmitError(`Please select a proficiency level for: ${missingProficiencies.join(', ')}`);
            setIsSubmitting(false);
            return;
        }

        // Prepare data payload matches Pydantic model
        const payload = {
            personalInfo: personalInfo,
            preferences: preferences,
            selectedSkills: skillsArray,
            proficiencies: proficiencies
        };

        try {
            await submitApplication(payload);
            setShowSuccess(true);
        } catch (error) {
            setSubmitError(error.message);
            setIsSubmitting(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        setIsSubmitting(false);
        navigate('/');
        window.location.reload();
    };

    return (
        <div className="summary-container">
            <SuccessModal
                isOpen={showSuccess}
                onClose={handleSuccessClose}
                title="Application Submitted!"
                message="Your application has been successfully submitted to our database. We will be in touch soon."
            />

            <div className="summary-header">
                <h2 className="page-title">Application Summary</h2>
                <button className="back-btn" onClick={() => navigate('/')} disabled={isSubmitting}>
                    &larr; Back to Form
                </button>
            </div>

            <div className="summary-section">
                <h3 className="section-title">Personal Information</h3>
                <div className="personal-info-grid">
                    <div className="info-item">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{personalInfo.name || '-'}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{personalInfo.email || '-'}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Mobile:</span>
                        <span className="info-value">{personalInfo.mobile || '-'}</span>
                    </div>
                </div>
            </div>

            <div className="summary-section">
                <h3 className="section-title">Selected Technologies & Proficiency</h3>
                {skillsArray.length === 0 ? (
                    <p className="no-skills">No technologies selected.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="tech-table">
                            <thead>
                                <tr>
                                    <th>Technology</th>
                                    <th>Proficiency Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skillsArray.map(skill => (
                                    <tr key={skill}>
                                        <td className="tech-name">{skill}</td>
                                        <td>
                                            <CustomDropdown
                                                options={proficiencyLevels}
                                                value={proficiencies[skill] || ''}
                                                onChange={(value) => {
                                                    handleProficiencyChange(skill, value);
                                                    if (submitError) setSubmitError(null);
                                                }}
                                                placeholder="Select Level"
                                                error={submitError && !proficiencies[skill]}
                                                disabled={isSubmitting}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {submitError && <div className="error-message" style={{ color: '#ef4444', marginBottom: '16px', fontWeight: '500' }}>{submitError}</div>}

            <div className="action-bar">
                <button
                    className="next-btn"
                    onClick={handleSubmit}
                    disabled={isSubmitting || skillsArray.length === 0}
                >
                    {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                </button>
            </div>
        </div>
    );
};

export default SummaryPage;
