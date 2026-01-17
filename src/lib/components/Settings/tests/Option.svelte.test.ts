import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Option from '../Option.svelte';

describe('Option', () => {
  let mockSetActiveTab: ReturnType<typeof vi.fn>;
  const mockOption = {
    id: 'profile',
    label: 'Profile',
    icon: 'fa-solid fa-user',
    color: 'bg-blue-100 text-blue-700'
  };

  beforeEach(() => {
    mockSetActiveTab = vi.fn();
  });

  const renderOption = (activeTab = 'profile') =>
    render(Option, { 
      props: { 
        option: mockOption, 
        activeTab, 
        setActiveTab: mockSetActiveTab 
      } 
    });

  it('renders option label', () => {
    renderOption();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('applies active styling when tab is active', () => {
    const { container } = renderOption('profile');
    const button = container.querySelector('button');
    expect(button).toHaveClass('border-lime-300', 'bg-lime-50/80');
  });

  it('applies inactive styling when tab is not active', () => {
    const { container } = renderOption('garden');
    const button = container.querySelector('button');
    expect(button).toHaveClass('border-stone-200', 'bg-white/50');
  });

  it('triggers setActiveTab when clicked', async () => {
    const user = userEvent.setup();
    renderOption();

    await user.click(screen.getByRole('button'));

    expect(mockSetActiveTab).toHaveBeenCalledWith('profile');
  });

  it('displays icon element', () => {
    const { container } = renderOption();
    const icon = container.querySelector('i');
    expect(icon).toHaveClass('fa-solid', 'fa-user');
  });
});
