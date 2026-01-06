import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TypingIndicator from '../TypingIndicator.svelte';

describe('TypingIndicator', () => {
  it('renders nothing when no one is typing', () => {
    const { container } = render(TypingIndicator, { props: { peopleTyping: [] } });

    expect(container.querySelector('.group')).not.toBeInTheDocument();
  });

  it('renders indicator when someone is typing', () => {
    const peopleTyping = [{ username: 'Alice', avatarColor: '#ff5733' }];
    const { container } = render(TypingIndicator, { props: { peopleTyping } });

    expect(container.querySelector('.group')).toBeInTheDocument();
  });

  it('shows avatar initials of typing user', () => {
    const peopleTyping = [{ username: 'John Doe', avatarColor: '#ff5733' }];
    render(TypingIndicator, { props: { peopleTyping } });

    expect(screen.getByTitle('John Doe')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('shows multiple typing users', () => {
    const peopleTyping = [
      { username: 'Alice Smith', avatarColor: '#ff5733' },
      { username: 'Bob Jones', avatarColor: '#33ff57' }
    ];
    render(TypingIndicator, { props: { peopleTyping } });

    expect(screen.getByTitle('Alice Smith')).toBeInTheDocument();
    expect(screen.getByTitle('Bob Jones')).toBeInTheDocument();
    expect(screen.getByText('AS')).toBeInTheDocument();
    expect(screen.getByText('BJ')).toBeInTheDocument();
  });

  it('handles single-name users', () => {
    const peopleTyping = [{ username: 'Alice', avatarColor: '#ff5733' }];
    render(TypingIndicator, { props: { peopleTyping } });

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('limits initials to 2 characters', () => {
    const peopleTyping = [{ username: 'Alice Bob Charlie', avatarColor: '#ff5733' }];
    render(TypingIndicator, { props: { peopleTyping } });

    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('converts initials to uppercase', () => {
    const peopleTyping = [{ username: 'john doe', avatarColor: '#ff5733' }];
    render(TypingIndicator, { props: { peopleTyping } });

    expect(screen.getByText('JD')).toBeInTheDocument();
  });
});

