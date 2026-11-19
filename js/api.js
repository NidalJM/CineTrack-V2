const BASE_URL = 'https://6afaf1bf730c1d152f32cff8.mockapi.io/api/v1';

export async function request(path, options = {}) {
    try {
        const res = await fetch(BASE_URL + path, {
            headers: { "Content-Type": "application/json" },
            ...options,
        });
    
        if (!res.ok)    {
            throw new Error(`Erreur API: ${res.status}`);
        }

        return await res.json();
    }   catch   (error) {
        console.error("API Request failed:", error);
        throw error;
    }
}

export const getContents = ()   => request("/CineApi");

export const getContentById = (id)  =>  request(`/CineApi/${id}`)

export const createContent = (data) =>
    request("/CineApi", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const updateContent = (id, data) =>
    request(`/CineApi/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const deleteContent = (id) =>    
    request (`/CineApi/${id}`, {
        method: "DELETE",
    });

export const getComments = ()   => request("/comments");

export const createComment = (data) => 
    request("/comments",    {
        method: "POST",
        body: JSON.stringify(data),  
    });