import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './CustomDropdown.css';

const CustomDropdown = ({
    options,
    value,
    onChange,
    placeholder = "Select Level",
    error = false,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ left: 0, top: 0, width: 0 });
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);

    // Close dropdown when clicking outside or scrolling
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            if (isOpen) setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleScroll);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [isOpen]);

    const handleSelect = (option) => {
        if (!disabled) {
            onChange(option);
            setIsOpen(false);
        }
    };

    const toggleOpen = () => {
        if (!disabled) {
            if (!isOpen && dropdownRef.current) {
                const rect = dropdownRef.current.getBoundingClientRect();
                setCoords({
                    left: rect.left + window.scrollX,
                    top: rect.bottom + window.scrollY + 6,
                    width: rect.width
                });
            }
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className={`custom-dropdown ${disabled ? 'disabled' : ''} ${error ? 'error' : ''}`} ref={dropdownRef}>
            <div className={`dropdown-trigger ${isOpen ? 'open' : ''}`} onClick={toggleOpen}>
                <span className={`trigger-text ${!value ? 'placeholder' : ''}`}>
                    {value || placeholder}
                </span>
                <span className="trigger-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </span>
            </div>

            {isOpen && ReactDOM.createPortal(
                <div
                    className="dropdown-menu"
                    ref={menuRef}
                    style={{
                        position: 'absolute',
                        left: coords.left,
                        top: coords.top,
                        width: coords.width,
                        zIndex: 9999 // Ensure it's on top of everything
                    }}
                >
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`dropdown-item ${value === option ? 'selected' : ''}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                            {value === option && (
                                <span className="check-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </span>
                            )}
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
};

export default CustomDropdown;
