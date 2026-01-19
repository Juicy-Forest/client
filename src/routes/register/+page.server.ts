import { fail, redirect, type Actions } from '@sveltejs/kit';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3030';

export const actions: Actions = {
    register: async ({ request, cookies, fetch }) => {
        try {
            const data = await request.formData();
            const username = data.get('username') as string;
            const email = data.get('email') as string;
            const password = data.get('password') as string;

            if (!username || !email || !password) {
                return fail(400, { error: 'All fields are required' });
            }

            // Clear any existing auth token (logout old account)
            cookies.set('auth-token', '', {
                path: '/',
                expires: new Date(0),
            });

            // Make API call to backend
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                return fail(response.status, { error: result.error || 'Registration failed' });
            }

            // Store the token from the server response (login new account)
            if (result.accessToken) {
                cookies.set('auth-token', result.accessToken, {
                    path: '/',
                    httpOnly: true,
                    secure: false, // Set to true in production with HTTPS
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            return fail(500, { error: 'Internal server error' });
        }

        // Redirect to createjoin page after successful registration and login
        throw redirect(303, '/createjoin');
    },
};
