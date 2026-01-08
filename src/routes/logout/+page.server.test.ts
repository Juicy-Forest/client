/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { actions } from './+page.server';

// Mock the redirect function
vi.mock('@sveltejs/kit', () => ({
  redirect: (status: number, location: string) => {
    throw new Error(`REDIRECT_${status}_${location}`);
  }
}));

describe('logout action', () => {
  let mockCookies: any;
  let mockEvent: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCookies = {
      set: vi.fn()
    };
    mockEvent = {
      cookies: mockCookies
    };
  });

  it('should clear auth token cookie and redirect to login', async () => {
    try {
      await actions.default(mockEvent);
      expect.fail('Should have thrown redirect');
    } catch (error: any) {
      expect(error.message).toBe('REDIRECT_302_/login');
      expect(mockCookies.set).toHaveBeenCalledWith('auth-token', '', {
        path: '/',
        expires: new Date(0)
      });
    }
  });
});
