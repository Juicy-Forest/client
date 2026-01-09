import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import MessageItemTestWrapper from './MessageItemTestWrapper.svelte';

describe('MessageItem', () => {
  const mockMessage = {
    _id: 'm1',
    content: 'Hello, world!',
    timestamp: '2024-01-15T10:30:00Z',
    author: {
      _id: 'user1',
      username: 'John Doe',
      avatarColor: '#ff5733',
      color: 'text-stone-800'
    },
    edited: false
  };

  const mockChatService = {
    sendEditedMessage: vi.fn(),
    deleteMessage: vi.fn(),
    userData: { _id: 'user1' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderMessage = (messageOverrides = {}, options = { isSelf: false, isRepeated: false }) =>
    render(MessageItemTestWrapper, {
      props: {
        message: { ...mockMessage, ...messageOverrides },
        isSelf: options.isSelf,
        isRepeated: options.isRepeated,
        chatService: mockChatService
      }
    });

  describe('rendering', () => {
    it('renders message content and author', () => {
      renderMessage();

      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('hides author header for repeated messages', () => {
      renderMessage({}, { isSelf: false, isRepeated: true });

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('shows edited indicator for edited messages', () => {
      renderMessage({ edited: true });
      expect(screen.getByText('(edited)')).toBeInTheDocument();
    });
  });

  describe('message menu', () => {
    it('shows menu button only for own messages', () => {
      renderMessage({}, { isSelf: true, isRepeated: false });
      expect(screen.getByRole('button', { name: /message options/i })).toBeInTheDocument();
    });

    it('hides menu button for other users messages', () => {
      renderMessage({}, { isSelf: false, isRepeated: false });
      expect(screen.queryByRole('button', { name: /message options/i })).not.toBeInTheDocument();
    });
  });

  describe('editing', () => {
    it('calls sendEditedMessage when editing and saving', async () => {
      const user = userEvent.setup();
      renderMessage({}, { isSelf: true, isRepeated: false });

      await user.click(screen.getByRole('button', { name: /message options/i }));
      await user.click(screen.getByText('Edit'));

      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'Updated message');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(mockChatService.sendEditedMessage).toHaveBeenCalledWith('m1', 'Updated message');
    });

    it('cancels edit without saving', async () => {
      const user = userEvent.setup();
      renderMessage({}, { isSelf: true, isRepeated: false });

      await user.click(screen.getByRole('button', { name: /message options/i }));
      await user.click(screen.getByText('Edit'));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(mockChatService.sendEditedMessage).not.toHaveBeenCalled();
      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    });
  });

  describe('deleting', () => {
    it('calls deleteMessage when confirmed', async () => {
      const user = userEvent.setup();
      renderMessage({}, { isSelf: true, isRepeated: false });

      await user.click(screen.getByRole('button', { name: /message options/i }));
      await user.click(screen.getByText('Unsend'));
      
      const buttons = screen.getAllByText('Unsend');
      await user.click(buttons[buttons.length - 1]); // Confirm button

      expect(mockChatService.deleteMessage).toHaveBeenCalledWith('m1');
    });

    it('cancels delete without calling deleteMessage', async () => {
      const user = userEvent.setup();
      renderMessage({}, { isSelf: true, isRepeated: false });

      await user.click(screen.getByRole('button', { name: /message options/i }));
      await user.click(screen.getByText('Unsend'));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(mockChatService.deleteMessage).not.toHaveBeenCalled();
    });
  });
});
