import React from 'react';
import { skillsData } from '../data/skills';
import './SkillSelector.css';

const FireIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="skill-icon"
    >
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.246-5.318 6-6.5 4.196 9.785 5.663 10.375 2 15.5-2.678 3.747-10.457-1.808-9.5-3.5Z" />
    </svg>
);

const SkillSelector = ({ selectedSkills, onToggleSkill, searchQuery }) => {
    // Filter logic
    const filteredSections = skillsData.map(section => {
        const filteredSkills = section.skills.filter(skill =>
            skill.toLowerCase().includes((searchQuery || '').toLowerCase())
        );
        return {
            ...section,
            skills: filteredSkills
        };
    }).filter(section => section.skills.length > 0);

    return (
        <div className="skill-selector-container">
            {filteredSections.length > 0 ? (
                filteredSections.map((section) => (
                    <div key={section.category} className="skill-category">
                        <h3 className="category-title">{section.category}</h3>
                        <div className="skills-grid">
                            {section.skills.map((skill) => (
                                <button
                                    key={skill}
                                    className={`skill-chip ${selectedSkills.has(skill) ? 'selected' : ''}`}
                                    onClick={() => onToggleSkill(skill)}
                                    type="button"
                                >
                                    <FireIcon />
                                    <span>{skill}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-results">No skills found matching "{searchQuery}"</div>
            )}
        </div>
    );
};

export default SkillSelector;
