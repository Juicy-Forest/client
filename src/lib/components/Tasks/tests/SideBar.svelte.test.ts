//@ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import SideBar from '../SideBar.svelte';

describe('SideBar', () => {
  it('renders sidebar with correct content', () => {
    render(SideBar);
    
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Weekly Tasks')).toBeInTheDocument();
    expect(screen.getByText(/Manage weekly garden tasks/i)).toBeInTheDocument();
  });

  it('displays next reset information', () => {
    render(SideBar);
    
    expect(screen.getByText('NEXT RESET')).toBeInTheDocument();
    expect(screen.getByText('7 days')).toBeInTheDocument();
  });

  it('renders reset button', () => {
    render(SideBar);
    
    expect(screen.getByRole('button', { name: /Reset All Tasks/i })).toBeInTheDocument();
  });
});
