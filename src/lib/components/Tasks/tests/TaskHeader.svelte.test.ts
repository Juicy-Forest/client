import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Header from '../TaskHeader.svelte';

describe('Header', () => {
  it('renders header with correct title and subtitle', () => {
    render(Header);
    
    expect(screen.getByText(/All Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Garden 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Overview of all active and completed tasks/i)).toBeInTheDocument();
  });
});
