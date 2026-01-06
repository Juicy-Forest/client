import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ChatHeader from '../ChatHeader.svelte';

describe('ChatHeader', () => {
  const mockActiveChannel = {
    id: 'ch1',
    name: 'general',
    label: 'General',
    topic: 'General discussion'
  };

  it('renders channel name with hashtag', () => {
    render(ChatHeader, { props: { activeChannel: mockActiveChannel } });

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('#general');
  });

  it('displays an active indicator dot', () => {
    const { container } = render(ChatHeader, { props: { activeChannel: mockActiveChannel } });

    const activeDot = container.querySelector('.bg-lime-500');
    expect(activeDot).toBeInTheDocument();
  });

  it('renders different channel names correctly', () => {
    const customChannel = { ...mockActiveChannel, name: 'announcements' };
    render(ChatHeader, { props: { activeChannel: customChannel } });

    expect(screen.getByText('#announcements')).toBeInTheDocument();
  });

  it('renders header element', () => {
    render(ChatHeader, { props: { activeChannel: mockActiveChannel } });

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});

