/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { actions } from './+page.server';

// Mock the fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the redirect function
vi.mock('@sveltejs/kit', () => ({
  fail: (status: number, data: any) => ({ status, ...data }),
  redirect: (status: number, location: string) => {
    throw new Error(`REDIRECT_${status}_${location}`);
  }
}));

describe('register action', () => {
  let mockCookies: any;
  let mockRequest: any;
  let mockEvent: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCookies = {
      set: vi.fn()
    };
    mockRequest = {
      formData: vi.fn()
    };
    mockEvent = {
      request: mockRequest,
      cookies: mockCookies,
      fetch: mockFetch
    };
  });

  it('should fail with 400 if username is missing', async () => {
    mockRequest.formData.mockResolvedValue(new Map([
      ['email', 'test@example.com'],
      ['password', 'password123']
    ]));

    const result = await actions.register(mockEvent);

    expect(result).toEqual({
      status: 400,
      error: 'All fields are required'
    });
  });

  it('should fail with 400 if email is missing', async () => {
    mockRequest.formData.mockResolvedValue(new Map([
      ['username', 'testuser'],
      ['password', 'password123']
    ]));

    const result = await actions.register(mockEvent);

    expect(result).toEqual({
      status: 400,
      error: 'All fields are required'
    });
  });

  it('should fail with 400 if password is missing', async () => {
    mockRequest.formData.mockResolvedValue(new Map([
      ['username', 'testuser'],
      ['email', 'test@example.com']
    ]));

    const result = await actions.register(mockEvent);

    expect(result).toEqual({
      status: 400,
      error: 'All fields are required'
    });
  });

  it('should handle successful registration and redirect', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ accessToken: 'token123' })
    };
    mockFetch.mockResolvedValue(mockResponse);
    mockRequest.formData.mockResolvedValue(new Map([
      ['username', 'testuser'],
      ['email', 'test@example.com'],
      ['password', 'password123']
    ]));

    try {
      await actions.register(mockEvent);
      expect.fail('Should have thrown redirect');
    } catch (error: any) {
      expect(error.message).toBe('REDIRECT_303_/createjoin');
      expect(mockCookies.set).toHaveBeenCalledWith('auth-token', 'token123', {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7
      });
      expect(mockCookies.set).toHaveBeenCalledWith('auth-token', '', {
        path: '/',
        expires: new Date(0)
      });
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3030/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        }),
      });
    }
  });

  it('should handle API error response', async () => {
    const mockResponse = {
      ok: false,
      status: 409,
      json: vi.fn().mockResolvedValue({ error: 'User already exists' })
    };
    mockFetch.mockResolvedValue(mockResponse);
    mockRequest.formData.mockResolvedValue(new Map([
      ['username', 'testuser'],
      ['email', 'test@example.com'],
      ['password', 'password123']
    ]));

    const result = await actions.register(mockEvent);

    expect(result).toEqual({
      status: 409,
      error: 'User already exists'
    });
  });

  it('should handle API error without message', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({})
    };
    mockFetch.mockResolvedValue(mockResponse);
    mockRequest.formData.mockResolvedValue(new Map([
      ['username', 'testuser'],
      ['email', 'test@example.com'],
      ['password', 'password123']
    ]));

    const result = await actions.register(mockEvent);

    expect(result).toEqual({
      status: 500,
      error: 'Registration failed'
    });
  });

  it('should handle network error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    mockRequest.formData.mockResolvedValue(new Map([
      ['username', 'testuser'],
      ['email', 'test@example.com'],
      ['password', 'password123']
    ]));

    const result = await actions.register(mockEvent);

    expect(result).toEqual({
      status: 500,
      error: 'Internal server error'
    });
  });
});
