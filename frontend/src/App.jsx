import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import SkillSelector from './components/SkillSelector';
import BasicInfo from './components/BasicInfo';
import Preferences from './components/Preferences';
import SummaryPage from './components/SummaryPage';
import AdminPage from './components/AdminPage';
import logo from './assets/logo.jpg';
import ErrorModal from './components/ErrorModal';
import './App.css';

// FormPage Component
const FormPage = ({
  personalInfo, setPersonalInfo,
  preferences, setPreferences,
  selectedSkills, toggleSkill,
  searchQuery, setSearchQuery
}) => {
  const navigate = useNavigate();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferencesChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="main-content">
      <header className="app-header">
        <img src={logo} alt="App Logo" className="app-logo" />
        <div className="header-badge">
          {/* <span>🚀</span> */}
          <span>Programmer Registration</span>
        </div>
        <h1 className="page-title">
          Join Our <span className="title-highlight">Developer Network</span>
        </h1>
        <p className="page-subtitle">Tell us about yourself and your technical expertise</p>
        <div className="step-indicator">
          <div className="step active">
            <div className="step-circle active">1</div>
            <span className="step-label active">Basic Info &amp; Skills</span>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <div className="step-circle">2</div>
            <span className="step-label">Experience</span>
          </div>
        </div>
      </header>

      <BasicInfo data={personalInfo} onChange={handlePersonalInfoChange} />
      <Preferences data={preferences} onChange={handlePreferencesChange} />

      <div className="skills-section-wrapper">
        <div className="section-header-simple">
          <h3>Technical Skills</h3>
        </div>

        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search skills..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <SkillSelector selectedSkills={selectedSkills} onToggleSkill={toggleSkill} searchQuery={searchQuery} />
      </div>

      <div className="action-bar">
        <button
          onClick={() => {
            if (!personalInfo.name || !personalInfo.email || !personalInfo.mobile) {
              setErrorMsg("Please fill in all Basic Information (Name, Email, Mobile).");
              setIsErrorOpen(true);
              return;
            }
            if (selectedSkills.size === 0) {
              setErrorMsg("Please select at least one technical skill.");
              setIsErrorOpen(true);
              return;
            }
            navigate('/summary');
          }}
          className="next-btn"
        >
          Next &rarr;
        </button>
      </div>


      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        message={errorMsg}
      />
    </div >
  );
};

// Main App Component
function App() {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  const [preferences, setPreferences] = useState({
    communication: 'Average',
    nightShift: false,
    timeFrom: '',
    timeTo: ''
  });

  const [selectedSkills, setSelectedSkills] = useState(new Set());

  const [searchQuery, setSearchQuery] = useState('');

  const toggleSkill = (skill) => {
    const newSelected = new Set(selectedSkills);
    if (newSelected.has(skill)) {
      newSelected.delete(skill);
    } else {
      newSelected.add(skill);
    }
    setSelectedSkills(newSelected);
  };

  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <FormPage
              personalInfo={personalInfo} setPersonalInfo={setPersonalInfo}
              preferences={preferences} setPreferences={setPreferences}
              selectedSkills={selectedSkills} toggleSkill={toggleSkill}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            />
          } />
          <Route path="/summary" element={
            <div className="main-content">
              <SummaryPage
                personalInfo={personalInfo}
                preferences={preferences}
                selectedSkills={selectedSkills}
              />
            </div>
          } />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
