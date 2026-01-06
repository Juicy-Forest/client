import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Avatar from '../Avatar.svelte';

describe('Avatar', () => {
  const mockAuthor = {
    username: 'John Doe',
    avatarColor: '#ff5733'
  };

  it('renders initials from username', () => {
    render(Avatar, { props: { author: mockAuthor, isRepeated: false } });

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders single initial for single name', () => {
    const singleNameAuthor = { username: 'Alice', avatarColor: '#ff5733' };
    render(Avatar, { props: { author: singleNameAuthor, isRepeated: false } });

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('limits initials to 2 characters for long names', () => {
    const longNameAuthor = { username: 'Alice Bob Charlie', avatarColor: '#ff5733' };
    render(Avatar, { props: { author: longNameAuthor, isRepeated: false } });

    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('converts initials to uppercase', () => {
    const lowercaseAuthor = { username: 'john doe', avatarColor: '#ff5733' };
    render(Avatar, { props: { author: lowercaseAuthor, isRepeated: false } });

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('hides avatar when isRepeated is true', () => {
    render(Avatar, { props: { author: mockAuthor, isRepeated: true } });

    expect(screen.queryByText('JD')).not.toBeInTheDocument();
  });

  it('shows avatar when isRepeated is false', () => {
    render(Avatar, { props: { author: mockAuthor, isRepeated: false } });

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders fallback when username is missing', () => {
    const noUsernameAuthor = { username: '', avatarColor: '#ff5733' };
    render(Avatar, { props: { author: noUsernameAuthor, isRepeated: false } });

    expect(screen.getByText('I')).toBeInTheDocument();
  });
});

