const TOKEN_KEY = 'token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
    else {
        localStorage.removeItem(TOKEN_KEY);
    }
}

// Profile photos are stored as full Supabase URLs; with no photo (or an old file name from before the move) the default picture shows
export const photoUrl = (photo) => photo && photo.startsWith('https://') ? photo : "default_profile_pic.jpeg";

// Same as fetch(), but sends the login token, and logs the user out if the backend rejects it (expired or invalid)
export const apiFetch = async (url, options = {}) => {
    const token = getToken();
    const headers = new Headers(options.headers);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 && token) {
        setToken(null);
        localStorage.removeItem('userInfo');
        alert("Your session has expired. Please log in again.");
        window.location.assign('/');
    }

    return response;
}
