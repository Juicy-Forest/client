import { fail, redirect, type Actions } from '@sveltejs/kit';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3030';

export const actions: Actions = {
    changePassword: async ({ request, cookies, fetch }) => {
        const data = await request.formData();
        const newPassword = data.get('newPassword') as string;
        const token = cookies.get('auth-token');
    
        if (!token) {
            return fail(401, { error: 'Not authenticated' });
        }

        if (!newPassword) {
            return fail(400, { error: "'New password' field is required" });
        }
    
        try {
            const response = await fetch(`${API_BASE_URL}/users/changePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-authorization': token,
                },
                body: JSON.stringify({ newPassword }),
            });
      
            const contentType = response.headers.get('content-type');
            let result;
      
            if (contentType?.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.error('API returned non-JSON response:', text);
                return fail(500, { error: 'Server error: Invalid response format' });
            }
      
            if (!response.ok) {
                return fail(response.status, { error: result.error || 'Password change failed' });
            }
      
            return { success: true, message: 'Password changed successfully!' };
        } catch (error) {
            console.error('Password change error:', error);
            return fail(500, { error: 'Internal server error' });
        }
    },

    logout: async ({ cookies }) => {
        cookies.delete('auth-token', { path: '/' });
        throw redirect(303, '/login');
    },

    updateUsername: async ({ request, cookies, fetch }) => {
        const data = await request.formData();
        const newUsername = data.get('newUsername') as string;
        const token = cookies.get('auth-token');
    
        if (!token) {
            return fail(401, { error: 'Not authenticated' });
        }

        if (!newUsername) {
            return fail(400, { error: "'New username' field is required" });
        }
    
        try {
            const response = await fetch(`${API_BASE_URL}/users/changeUsername`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-authorization': token,
                },
                body: JSON.stringify({ newUsername }),
            });
      
            const contentType = response.headers.get('content-type');
            let result;
      
            if (contentType?.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.error('API returned non-JSON response:', text);
                return fail(500, { error: 'Server error: Invalid response format' });
            }
      
            if (result.accessToken) {
                cookies.set('auth-token', result.accessToken, {
                    path: '/',
                    httpOnly: true,
                    secure: false, // Set to true in production with HTTPS
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                });
            }

            if (!response.ok) {
                return fail(response.status, { error: result.error || 'Username change failed' });
            }

            return { success: true, message: 'Username changed successfully!'};
        } catch (error) {
            console.error('Username change error:', error);
            return fail(500, { error: 'Internal server error' });
        }
    },

    updateEmail: async ({ request, cookies, fetch }) => {
        const data = await request.formData();
        const newEmail = data.get('newEmail') as string;
        const token = cookies.get('auth-token');
    
        if (!token) {
            return fail(401, { error: 'Not authenticated' });
        }

        if (!newEmail) {
            return fail(400, { error: "'New email' field is required" });
        }
    
        try {
            const response = await fetch(`${API_BASE_URL}/users/changeEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-authorization': token,
                },
                body: JSON.stringify({ newEmail }),
            });
      
            const contentType = response.headers.get('content-type');
            let result;
      
            if (contentType?.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.error('API returned non-JSON response:', text);
                return fail(500, { error: 'Server error: Invalid response format' });
            }
      
            if (!response.ok) {
                return fail(response.status, { error: result.error || 'Email change failed' });
            }

            return { success: true, message: 'Email changed successfully!' };
        } catch (error) {
            console.error('Email change error:', error);
            return fail(500, { error: 'Internal server error' });
        }
    },

    updateGardenName: async ({ request, cookies, fetch }) => {
        const data = await request.formData();
        const newGardenName = data.get('newGardenName') as string;
        const gardenId = data.get('gardenId') as string;
        const token = cookies.get('auth-token');
    
        if (!token) {
            return fail(401, { error: 'Not authenticated' });
        }

        if (!newGardenName) {
            return fail(400, { error: "'Garden name' field is required" });
        }
    
        if (!gardenId) {
            return fail(400, { error: 'Garden ID is required' });
        }
    
        try {
            const response = await fetch(`${API_BASE_URL}/garden/${gardenId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-authorization': token,
                },
                body: JSON.stringify({ name: newGardenName }),
            });
      
            const contentType = response.headers.get('content-type');
            let result;
      
            if (contentType?.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.error('API returned non-JSON response:', text);
                return fail(500, { error: 'Server error: Invalid response format' });
            }
      
            if (!response.ok) {
                let errorMessage = result.message || result.error || 'Garden name change failed';
        
                if (response.status === 403) {
                    errorMessage = 'Only the garden owner can change the garden name';
                } else if (response.status === 404) {
                    errorMessage = 'Garden not found';
                }
        
                return fail(response.status, { error: errorMessage });
            }

            return { success: true, message: 'Garden name changed successfully!', newGardenName };
        } catch (error) {
            console.error('Garden name change error:', error);
            return fail(500, { error: 'Internal server error' });
        }
    },

    removeMember: async ({ request, cookies, fetch }) => {
        const data = await request.formData();
        const gardenId = data.get('gardenId') as string;
        const memberId = data.get('memberId') as string;
        const token = cookies.get('auth-token');

        if (!token) {
            return fail(401, { error: 'Not authenticated' });
        }

        if (!gardenId || !memberId) {
            return fail(400, { error: 'Garden ID and Member ID are required' });
        }

        try {
            const response = await fetch(`${API_BASE_URL}/garden/${gardenId}/removeMember`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-authorization': token,
                },
                body: JSON.stringify({ memberId }),
            });

            const contentType = response.headers.get('content-type');
            let result;

            if (contentType?.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.error('API returned non-JSON response:', text);
                return fail(500, { error: 'Server error: Invalid response format' });
            }

            if (!response.ok) {
                let errorMessage = result.error || 'Failed to remove member';
                if (response.status === 403) {
                    errorMessage = 'Only the garden owner can remove members';
                } else if (response.status === 404) {
                    errorMessage = 'Garden or member not found';
                }

                return fail(response.status, { error: errorMessage });
            }

            return { success: true, message: 'Member removed successfully!' };
        } catch (error) {
            console.error('Remove member error:', error);
            return fail(500, { error: 'Internal server error' });
        }
    },

    deleteGarden: async ({ request, cookies, fetch }) => {
        const data = await request.formData();
        const gardenId = data.get('gardenId') as string;
        const token = cookies.get('auth-token');

        if (!token) {
            return fail(401, { error: 'Not authenticated' });
        }

        if (!gardenId) {
            return fail(400, { error: 'Garden ID is required' });
        }

        try {
            const response = await fetch(`${API_BASE_URL}/garden/${gardenId}`, {
                method: 'DELETE',
                headers: {
                    'x-authorization': token,
                },
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                let result;

                if (contentType?.includes('application/json')) {
                    result = await response.json();
                } else {
                    const text = await response.text();
                    console.error('API returned non-JSON response:', text);
                    return fail(500, { error: 'Server error: Invalid response format' });
                }

                let errorMessage = result.error || 'Failed to delete garden';
                if (response.status === 403) {
                    errorMessage = 'Only the garden owner can delete the garden';
                } else if (response.status === 404) {
                    errorMessage = 'Garden not found';
                }

                return fail(response.status, { error: errorMessage });
            }

            return { success: true, message: 'Garden deleted successfully!' };
        } catch (error) {
            console.error('Delete garden error:', error);
            return fail(500, { error: 'Internal server error' });
        }
    }
};
