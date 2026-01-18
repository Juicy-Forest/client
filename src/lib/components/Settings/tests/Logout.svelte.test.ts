import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Logout from '../Logout.svelte';

describe('Logout', () => {
  const renderComponent = () =>
    render(Logout);

  it('renders logout form', () => {
    const { container } = renderComponent();
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('form has correct action', () => {
    const { container } = renderComponent();
    const form = container.querySelector('form');
    expect(form).toHaveAttribute('action', '?/logout');
  });

  it('form has POST method', () => {
    const { container } = renderComponent();
    const form = container.querySelector('form');
    expect(form).toHaveAttribute('method', 'POST');
  });

  it('renders logout button', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /Logout/ })).toBeInTheDocument();
  });

  it('button is of type submit', () => {
    const { container } = renderComponent();
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('applies correct styling to button', () => {
    const { container } = renderComponent();
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-red-500', 'text-white', 'rounded-lg');
  });

  it('button has hover effect styling', () => {
    const { container } = renderComponent();
    const button = container.querySelector('button');
    expect(button).toHaveClass('hover:bg-red-600');
  });
});
