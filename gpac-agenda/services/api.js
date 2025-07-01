// API base URL - automatically detect environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-url.com/api'  // Update this with your production URL
    : 'http://localhost:5000/api';

// Get the auth token from Supabase
const getAuthToken = () => {
    const session = JSON.parse(localStorage.getItem('supabase.auth.token'));
    return session?.access_token;
};

// Helper function to make API requests
const fetchWithAuth = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Something went wrong');
    }

    return response.json();
};

// Event API functions
export const eventAPI = {
    // Get all events
    getAllEvents: async () => {
        return fetchWithAuth('/events');
    },

    // Create a new event
    createEvent: async (eventData) => {
        return fetchWithAuth('/events', {
            method: 'POST',
            body: JSON.stringify(eventData),
        });
    },

    // Update an event
    updateEvent: async (eventId, eventData) => {
        return fetchWithAuth(`/events/${eventId}`, {
            method: 'PUT',
            body: JSON.stringify(eventData),
        });
    },

    // Delete an event
    deleteEvent: async (eventId) => {
        return fetchWithAuth(`/events/${eventId}`, {
            method: 'DELETE',
        });
    },
};
