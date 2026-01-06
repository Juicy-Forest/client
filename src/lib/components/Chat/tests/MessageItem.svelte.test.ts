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
    it('renders message content', () => {
      renderMessage();

      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    });

    it('renders author username', () => {
      renderMessage();

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders avatar with initials', () => {
      renderMessage();

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders formatted timestamp', () => {
      renderMessage();

      // The timestamp should be formatted as time
      const timeElements = screen.getAllByText(/\d{1,2}:\d{2}/);
      expect(timeElements.length).toBeGreaterThan(0);
    });

    it('hides header for repeated messages', () => {
      renderMessage({}, { isSelf: false, isRepeated: true });

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('shows edited indicator for edited messages', () => {
      renderMessage({ edited: true });

      expect(screen.getByText('(edited)')).toBeInTheDocument();
    });

    it('does not show edited indicator for unedited messages', () => {
      renderMessage({ edited: false });

      expect(screen.queryByText('(edited)')).not.toBeInTheDocument();
    });
  });

  describe('self message interactions', () => {
    it('shows menu button for own messages', () => {
      renderMessage({}, { isSelf: true, isRepeated: false });

      expect(screen.getByRole('button', { name: /message options/i })).toBeInTheDocument();
    });

    it('does not show menu button for other users messages', () => {
      renderMessage({}, { isSelf: false, isRepeated: false });

      expect(screen.queryByRole('button', { name: /message options/i })).not.toBeInTheDocument();
    });

    it('opens menu on menu button click', async () => {
      const user = userEvent.setup();
      renderMessage({}, { isSelf: true, isRepeated: false });

      await user.click(screen.getByRole('button', { name: /message options/i }));

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Unsend')).toBeInTheDocument();
    });
  });

  describe('editing', () => {
    it('opens edit form when edit is clicked', async () => {
      const user = userEvent.setup();
      renderMessage({}, { isSelf: true, isRepeated: false });

      await user.click(screen.getByRole('button', { name: /message options/i }));
      await user.click(screen.getByText('Edit'));

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('calls sendEditedMessage on save', async () => {
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

    it('closes edit form on cancel', async () => {
      const user = userEvent.setup();
      renderMessage({}, { isSelf: true, isRepeated: false });

      await user.click(screen.getByRole('button', { name: /message options/i }));
      await user.click(screen.getByText('Edit'));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    });
  });

  describe('deleting', () => {
    it('opens unsend modal when unsend is clicked', async () => {
      const user = userEvent.setup();
      renderMessage({}, { isSelf: true, isRepeated: false });

      await user.click(screen.getByRole('button', { name: /message options/i }));
      await user.click(screen.getByText('Unsend'));

      expect(screen.getByText(/unsend this message/i)).toBeInTheDocument();
    });

    it('calls deleteMessage on confirm', async () => {
      const user = userEvent.setup();
      renderMessage({}, { isSelf: true, isRepeated: false });

      await user.click(screen.getByRole('button', { name: /message options/i }));
      await user.click(screen.getByText('Unsend'));
      
      // Find and click the confirm Unsend button in the modal
      const buttons = screen.getAllByText('Unsend');
      const confirmBtn = buttons[buttons.length - 1]; // The modal confirm button
      await user.click(confirmBtn);

      expect(mockChatService.deleteMessage).toHaveBeenCalledWith('m1');
    });

    it('closes modal on cancel without deleting', async () => {
      const user = userEvent.setup();
      renderMessage({}, { isSelf: true, isRepeated: false });

      await user.click(screen.getByRole('button', { name: /message options/i }));
      await user.click(screen.getByText('Unsend'));
      
      // Find and click the cancel button in the modal
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(mockChatService.deleteMessage).not.toHaveBeenCalled();
      expect(screen.queryByText(/unsend this message/i)).not.toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies self message styling when isSelf is true', () => {
      const { container } = renderMessage({}, { isSelf: true, isRepeated: false });

      const article = container.querySelector('article');
      expect(article).toHaveClass('flex-row-reverse');
    });

    it('applies repeated message styling when isRepeated is true', () => {
      const { container } = renderMessage({}, { isSelf: false, isRepeated: true });

      const article = container.querySelector('article');
      expect(article).toHaveClass('mt-1');
      expect(article).not.toHaveClass('mt-5');
    });
  });
});

