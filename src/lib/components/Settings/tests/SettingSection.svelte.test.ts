import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import SettingSection from '../SettingSection.svelte';

describe('SettingSection', () => {
  let mockOnEnhance: () => unknown;

  beforeEach(() => {
    mockOnEnhance = vi.fn();
  });

  const renderSection = (error = '', success = '') =>
    render(SettingSection, {
      props: {
        title: 'Change Username',
        action: '?/updateUsername',
        fieldName: 'username',
        error,
        success,
        onEnhance: mockOnEnhance
      }
    });

  it('renders section title', () => {
    renderSection();
    expect(screen.getByText('Change Username')).toBeInTheDocument();
  });

  it('creates form with correct action and method', () => {
    const { container } = renderSection();
    const form = container.querySelector('form');
    expect(form).toHaveAttribute('action', '?/updateUsername');
    expect(form).toHaveAttribute('method', 'POST');
  });

  it('displays error message when provided', () => {
    renderSection('Username is already taken', '');
    expect(screen.getByText('Username is already taken')).toBeInTheDocument();
  });

  it('displays success message when provided', () => {
    renderSection('', 'Username changed successfully!');
    expect(screen.getByText('Username changed successfully!')).toBeInTheDocument();
  });

  it('displays error when both provided (error takes priority)', () => {
    renderSection('Error message', 'Success message');
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('displays neither error nor success when both empty', () => {
    renderSection('', '');
    expect(screen.queryByText(/Error|Success/)).not.toBeInTheDocument();
  });

  it('applies correct styling classes to container', () => {
    const { container } = renderSection();
    const wrapper = container.querySelector('div');
    expect(wrapper).toHaveClass('rounded-2xl', 'border', 'border-stone-200', 'bg-white');
  });

  it('renders with correct text color for error', () => {
    renderSection('Error message', '');
    const errorElement = screen.getByText('Error message');
    expect(errorElement).toHaveClass('text-red-600');
  });

  it('renders with correct text color for success', () => {
    renderSection('', 'Success message');
    const successElement = screen.getByText('Success message');
    expect(successElement).toHaveClass('text-green-600');
  });
});
