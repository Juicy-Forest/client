import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import ChannelItem from '../ChannelItem.svelte';

describe('ChannelItem', () => {
  let mockClickHandler: ReturnType<typeof vi.fn>;
  const mockChannel = { _id: 'ch1', name: 'general' };

  beforeEach(() => {
    mockClickHandler = vi.fn();
  });

  const renderChannel = (channel = mockChannel, isActive = false) =>
    render(ChannelItem, { props: { channel, isActive, clickHandler: mockClickHandler } });

  it('renders channel name with hashtag', () => {
    renderChannel();

    expect(screen.getByText('#general')).toBeInTheDocument();
  });

  it('renders as a button', () => {
    renderChannel();

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('triggers clickHandler when clicked', async () => {
    const user = userEvent.setup();
    renderChannel();

    await user.click(screen.getByRole('button'));

    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });

  it('applies active styles when isActive is true', () => {
    renderChannel(mockChannel, true);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-lime-100/50');
    expect(button).toHaveClass('text-lime-900');
  });

  it('applies inactive styles when isActive is false', () => {
    renderChannel(mockChannel, false);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-stone-500');
    expect(button).not.toHaveClass('bg-lime-100/50');
  });

  it('displays different channel names correctly', () => {
    const customChannel = { _id: 'ch2', name: 'announcements' };
    renderChannel(customChannel);

    expect(screen.getByText('#announcements')).toBeInTheDocument();
  });
});

