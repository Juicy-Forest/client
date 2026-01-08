import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import RegisterPage from './+page.svelte';

// Mock the goto function
vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}));

describe('Register page', () => {
  it('should render without crashing', () => {
    const { container } = render(RegisterPage);

    expect(container).toBeTruthy();
  });

  it('should contain the main elements', () => {
    const { getByText, getByLabelText, getByRole } = render(RegisterPage);

    // Check for main heading
    expect(getByText('Juicy Forest')).toBeInTheDocument();
    expect(getByText('Create your account')).toBeInTheDocument();
    expect(getByText('Get started')).toBeInTheDocument();

    // Check for form inputs
    expect(getByLabelText('Username')).toBeInTheDocument();
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByLabelText('Confirm password')).toBeInTheDocument();

    // Check for submit button
    expect(getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();

    // Check for sign in link
    expect(getByText(/Already have an account\?/)).toBeInTheDocument();
    expect(getByText('Sign in')).toBeInTheDocument();
  });

  it('should have proper form attributes', () => {
    const { container } = render(RegisterPage);

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('method', 'POST');
    expect(form).toHaveAttribute('action', '?/register');
  });

  it('should validate required fields', () => {
    const { getByLabelText } = render(RegisterPage);

    const usernameInput = getByLabelText('Username');
    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const confirmPasswordInput = getByLabelText('Confirm password');

    expect(usernameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(confirmPasswordInput).toHaveAttribute('required');
  });
});
