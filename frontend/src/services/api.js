const API_URL = 'http://localhost:8000/api';

export const submitApplication = async (data) => {
    try {
        const response = await fetch(`${API_URL}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to submit application');
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting application:', error);
        throw error;
    }
};
