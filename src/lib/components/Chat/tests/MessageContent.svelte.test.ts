import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import MessageContent from '../MessageContent.svelte';

describe('MessageContent', () => {
  it('renders the message content', () => {
    render(MessageContent, { props: { content: 'Hello, world!' } });
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('shows edited indicator when isEdited is true', () => {
    render(MessageContent, { props: { content: 'Test message', isEdited: true } });
    expect(screen.getByText('(edited)')).toBeInTheDocument();
  });

  it('hides edited indicator when isEdited is false', () => {
    render(MessageContent, { props: { content: 'Test message', isEdited: false } });
    expect(screen.queryByText('(edited)')).not.toBeInTheDocument();
  });
});
