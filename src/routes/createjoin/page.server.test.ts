/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load, actions } from './+page.server';

// Mock the fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the fail function
vi.mock('@sveltejs/kit', () => ({
  fail: (status: number, data: any) => ({ status, ...data })
}));

describe('createjoin load function', () => {
  let mockCookies: any;
  let mockEvent: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCookies = {
      get: vi.fn()
    };
    mockEvent = {
      cookies: mockCookies,
      fetch: mockFetch
    };
  });

  it('should return empty joinedGardens when no token', async () => {
    mockCookies.get.mockReturnValue(undefined);

    const result = await load(mockEvent);

    expect(result).toEqual({ joinedGardens: [] });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should fetch joined gardens when token exists', async () => {
    const mockGardens = [{ id: '1', name: 'Garden 1' }];
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockGardens)
    };
    mockFetch.mockResolvedValue(mockResponse);
    mockCookies.get.mockReturnValue('token123');

    const result = await load(mockEvent);

    expect(result).toEqual({ joinedGardens: mockGardens });
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3030/garden/user', {
      headers: {
        'x-authorization': 'token123'
      }
    });
  });

  it('should return empty joinedGardens when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    mockCookies.get.mockReturnValue('token123');

    const result = await load(mockEvent);

    expect(result).toEqual({ joinedGardens: [] });
  });

  it('should return empty joinedGardens when response not ok', async () => {
    const mockResponse = {
      ok: false
    };
    mockFetch.mockResolvedValue(mockResponse);
    mockCookies.get.mockReturnValue('token123');

    const result = await load(mockEvent);

    expect(result).toEqual({ joinedGardens: [] });
  });
});

describe('create action', () => {
  let mockCookies: any;
  let mockRequest: any;
  let mockEvent: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCookies = {
      get: vi.fn()
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

  it('should fail with 400 if name is missing', async () => {
    mockRequest.formData.mockResolvedValue(new Map([['location', 'Location']]));

    const result = await actions.create(mockEvent);

    expect(result).toEqual({
      status: 400,
      error: 'Name and location are required'
    });
  });

  it('should fail with 400 if location is missing', async () => {
    mockRequest.formData.mockResolvedValue(new Map([['name', 'Garden Name']]));

    const result = await actions.create(mockEvent);

    expect(result).toEqual({
      status: 400,
      error: 'Name and location are required'
    });
  });

  it('should fail with 401 if not authenticated', async () => {
    mockRequest.formData.mockResolvedValue(new Map([
      ['name', 'Garden Name'],
      ['location', 'Location']
    ]));
    mockCookies.get.mockReturnValue(undefined);

    const result = await actions.create(mockEvent);

    expect(result).toEqual({
      status: 401,
      error: 'Not authenticated'
    });
  });

  it('should handle successful garden creation', async () => {
    const mockGarden = { id: '1', name: 'Garden Name' };
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockGarden)
    };
    mockFetch.mockResolvedValue(mockResponse);
    mockRequest.formData.mockResolvedValue(new Map([
      ['name', 'Garden Name'],
      ['location', 'Location']
    ]));
    mockCookies.get.mockReturnValue('token123');

    const result = await actions.create(mockEvent);

    expect(result).toEqual({
      success: true,
      message: 'Food garden "Garden Name" created successfully!',
      garden: mockGarden
    });
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3030/garden', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': 'token123'
      },
      body: JSON.stringify({
        name: 'Garden Name',
        location: 'Location'
      })
    });
  });

  it('should handle API error response', async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({})
    };
    mockFetch.mockResolvedValue(mockResponse);
    mockRequest.formData.mockResolvedValue(new Map([
      ['name', 'Garden Name'],
      ['location', 'Location']
    ]));
    mockCookies.get.mockReturnValue('token123');

    const result = await actions.create(mockEvent);

    expect(result).toEqual({
      status: 400,
      error: 'The name already exists'
    });
  });

  it('should handle network error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    mockRequest.formData.mockResolvedValue(new Map([
      ['name', 'Garden Name'],
      ['location', 'Location']
    ]));
    mockCookies.get.mockReturnValue('token123');

    const result = await actions.create(mockEvent);

    expect(result).toEqual({
      status: 500,
      error: 'Internal server error'
    });
  });
});

describe('join action', () => {
  let mockCookies: any;
  let mockRequest: any;
  let mockEvent: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCookies = {
      get: vi.fn()
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

  it('should fail with 400 if joinCode is missing', async () => {
    mockRequest.formData.mockResolvedValue(new Map());

    const result = await actions.join(mockEvent);

    expect(result).toEqual({
      status: 400,
      error: 'Join code is required'
    });
  });

  it('should fail with 401 if not authenticated', async () => {
    mockRequest.formData.mockResolvedValue(new Map([['joinCode', 'ABC123']]));
    mockCookies.get.mockReturnValue(undefined);

    const result = await actions.join(mockEvent);

    expect(result).toEqual({
      status: 401,
      error: 'Not authenticated'
    });
  });

  it('should handle successful garden join', async () => {
    const mockGarden = { id: '1', name: 'Garden Name' };
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockGarden)
    };
    mockFetch.mockResolvedValue(mockResponse);
    mockRequest.formData.mockResolvedValue(new Map([['joinCode', 'abc123']]));
    mockCookies.get.mockReturnValue('token123');

    const result = await actions.join(mockEvent);

    expect(result).toEqual({
      success: true,
      message: 'Successfully joined "Garden Name" garden!',
      garden: mockGarden
    });
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3030/garden/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': 'token123'
      },
      body: JSON.stringify({
        joinCode: 'ABC123'
      })
    });
  });

  it('should handle API error response', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      json: vi.fn().mockResolvedValue({ message: 'Invalid join code' })
    };
    mockFetch.mockResolvedValue(mockResponse);
    mockRequest.formData.mockResolvedValue(new Map([['joinCode', 'ABC123']]));
    mockCookies.get.mockReturnValue('token123');

    const result = await actions.join(mockEvent);

    expect(result).toEqual({
      status: 404,
      error: 'Invalid join code'
    });
  });

  it('should handle API error without message', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({})
    };
    mockFetch.mockResolvedValue(mockResponse);
    mockRequest.formData.mockResolvedValue(new Map([['joinCode', 'ABC123']]));
    mockCookies.get.mockReturnValue('token123');

    const result = await actions.join(mockEvent);

    expect(result).toEqual({
      status: 500,
      error: 'Failed to join garden'
    });
  });

  it('should handle network error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    mockRequest.formData.mockResolvedValue(new Map([['joinCode', 'ABC123']]));
    mockCookies.get.mockReturnValue('token123');

    const result = await actions.join(mockEvent);

    expect(result).toEqual({
      status: 500,
      error: 'Internal server error'
    });
  });
});
