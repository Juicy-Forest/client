import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import MessageContent from '../MessageContent.svelte';

describe('MessageContent', () => {
  it('renders the message content', () => {
    render(MessageContent, { props: { content: 'Hello, world!' } });

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('does not show edited indicator by default', () => {
    render(MessageContent, { props: { content: 'Test message' } });

    expect(screen.queryByText('(edited)')).not.toBeInTheDocument();
  });

  it('does not show edited indicator when isEdited is false', () => {
    render(MessageContent, { props: { content: 'Test message', isEdited: false } });

    expect(screen.queryByText('(edited)')).not.toBeInTheDocument();
  });

  it('shows edited indicator when isEdited is true', () => {
    render(MessageContent, { props: { content: 'Test message', isEdited: true } });

    expect(screen.getByText('(edited)')).toBeInTheDocument();
  });

  it('renders content with special characters', () => {
    render(MessageContent, { props: { content: 'Hello <script>alert("xss")</script>' } });

    expect(screen.getByText('Hello <script>alert("xss")</script>')).toBeInTheDocument();
  });

  it('renders long content correctly', () => {
    const longContent = 'This is a very long message '.repeat(50);
    render(MessageContent, { props: { content: longContent } });

    // Use a function matcher for long text with potential whitespace differences
    expect(screen.getByText((content) => content.includes('This is a very long message'))).toBeInTheDocument();
  });

  it('renders empty content', () => {
    const { container } = render(MessageContent, { props: { content: '' } });

    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph?.textContent).toBe('');
  });
});

