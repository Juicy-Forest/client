import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import LoginPage from './+page.svelte';

describe('Login page', () => {
  it('should render without crashing', () => {
    const { container } = render(LoginPage);

    expect(container).toBeTruthy();
  });

  it('should contain the main elements', () => {
    const { getByText, getByLabelText, getByRole } = render(LoginPage);

    // Check for main heading
    expect(getByText('Juicy Forest')).toBeInTheDocument();
    expect(getByText('Manage your garden with ease')).toBeInTheDocument();
    expect(getByText('Welcome back')).toBeInTheDocument();

    // Check for form inputs
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();

    // Check for submit button
    expect(getByRole('button', { name: 'Sign In' })).toBeInTheDocument();

    // Check for sign up link
    expect(getByText(/Don't have an account\?/)).toBeInTheDocument();
    expect(getByText('Sign up')).toBeInTheDocument();
  });

  it('should have proper form attributes', () => {
    const { container } = render(LoginPage);

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('method', 'POST');
    expect(form).toHaveAttribute('action', '?/login');
  });
});
