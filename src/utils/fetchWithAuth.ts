import { ErrorResponse } from "../types/Error";

const getToken = (): string | null => {
    return localStorage.getItem('jwt');
};

export async function fetchWithAuth(
    input: RequestInfo,
    init: RequestInit = {}
): Promise<Response> {
    const token = getToken();

    const headers = new Headers(init.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (!(init.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

        const response = await fetch(input, {
            ...init,
            headers,
        });


        
        if (response.status === 400) {
            const errorBody: ErrorResponse = await response.json();
            return Promise.reject(errorBody);
          }


        // If token is expired or invalid redirect to login
        if (response.status === 401) {
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');

            // Redirect to login
            window.location.href = '/login'; 
            return Promise.reject(new Error('Unauthorized - redirecting to login'));
        }



        return response;


}
