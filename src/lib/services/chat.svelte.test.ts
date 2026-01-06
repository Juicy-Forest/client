import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import ChatServiceTestWrapper from './ChatServiceTestWrapper.svelte';

// Mock WebSocket
class MockWebSocket {
  static OPEN = 1;
  static CLOSED = 3;
  
  readyState = MockWebSocket.OPEN;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  send = vi.fn();
  close = vi.fn();

  constructor(_url: string) {
    setTimeout(() => this.onopen?.(), 0);
  }

  simulateMessage(data: any) {
    this.onmessage?.({ data: JSON.stringify(data) });
  }
}

vi.stubGlobal('WebSocket', MockWebSocket);

describe('ChatService', () => {
  let chatService: any;
  let cleanup: () => void;

  const renderChatService = () => {
    const result = render(ChatServiceTestWrapper);
    chatService = result.component.getChatService();
    cleanup = result.unmount;
    return result;
  };

  beforeEach(() => {
    vi.useFakeTimers();
    renderChatService();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    cleanup?.();
  });

  describe('initialization', () => {
    it('creates a WebSocket connection', () => {
      expect(chatService.ws).toBeDefined();
    });

    it('initializes with empty channels and messages', () => {
      expect(chatService.channels).toEqual([]);
      expect(chatService.messages).toEqual([]);
      expect(chatService.peopleTyping).toEqual([]);
    });
  });

  describe('setUserData', () => {
    it('stores user data', () => {
      const userData = { _id: 'user1', username: 'TestUser', avatarColor: '#ff0000' };
      chatService.setUserData(userData);
      expect(chatService.userData).toEqual(userData);
    });
  });

  describe('setActiveChannel', () => {
    it('sets the active channel ID', () => {
      chatService.setActiveChannel('channel123');
      expect(chatService.activeChannelId).toBe('channel123');
    });
  });

  describe('activeChannel getter', () => {
    it('returns the active channel object', async () => {
      const channel = { _id: 'ch1', name: 'general' };
      chatService.channels.push(channel);
      chatService.activeChannelId = 'ch1';
      await tick();
      
      expect(chatService.activeChannel).toEqual(channel);
    });

    it('returns empty string when no active channel', () => {
      expect(chatService.activeChannel).toBe('');
    });
  });

  describe('processInitialLoad', () => {
    it('loads messages and channels from initial data', () => {
      const data = {
        messages: [
          { payload: { _id: 'm1', content: 'Hello' } },
          { payload: { _id: 'm2', content: 'World' } }
        ],
        channels: [
          { _id: 'ch1', name: 'general' },
          { _id: 'ch2', name: 'random' }
        ]
      };

      chatService.processInitialLoad(data);

      expect(chatService.messages).toHaveLength(2);
      expect(chatService.messages[0]).toEqual({ _id: 'm1', content: 'Hello' });
      expect(chatService.channels).toHaveLength(2);
      expect(chatService.channels[0].name).toBe('general');
    });
  });

  describe('processActivity', () => {
    beforeEach(() => {
      chatService.activeChannelId = 'ch1';
    });

    it('adds typing user to peopleTyping', () => {
      const data = {
        payload: { username: 'Alice', avatarColor: '#ff0000' },
        channelId: 'ch1'
      };

      chatService.processActivity(data);

      expect(chatService.peopleTyping).toHaveLength(1);
      expect(chatService.peopleTyping[0].username).toBe('Alice');
    });

    it('does not add duplicate typing users', () => {
      const data = {
        payload: { username: 'Alice', avatarColor: '#ff0000' },
        channelId: 'ch1'
      };

      chatService.processActivity(data);
      chatService.processActivity(data);

      expect(chatService.peopleTyping).toHaveLength(1);
    });

    it('ignores typing from different channels', () => {
      const data = {
        payload: { username: 'Alice', avatarColor: '#ff0000' },
        channelId: 'ch2'
      };

      chatService.processActivity(data);

      expect(chatService.peopleTyping).toHaveLength(0);
    });

    it('removes user from typing after timeout', () => {
      const data = {
        payload: { username: 'Alice', avatarColor: '#ff0000' },
        channelId: 'ch1'
      };

      chatService.processActivity(data);
      expect(chatService.peopleTyping).toHaveLength(1);

      vi.advanceTimersByTime(1000);

      expect(chatService.peopleTyping).toHaveLength(0);
    });

    it('resets timeout when same user types again', () => {
      const data = {
        payload: { username: 'Alice', avatarColor: '#ff0000' },
        channelId: 'ch1'
      };

      chatService.processActivity(data);
      vi.advanceTimersByTime(500);
      chatService.processActivity(data);
      vi.advanceTimersByTime(500);

      // Should still be typing (timeout reset)
      expect(chatService.peopleTyping).toHaveLength(1);

      vi.advanceTimersByTime(500);
      expect(chatService.peopleTyping).toHaveLength(0);
    });
  });

  describe('processEditedMessage', () => {
    it('updates an existing message content', () => {
      chatService.messages.push({ _id: 'm1', content: 'Original', timestamp: '2024-01-01' });

      chatService.processEditedMessage({
        _id: 'm1',
        content: 'Updated',
        timestamp: '2024-01-02'
      });

      expect(chatService.messages[0].content).toBe('Updated');
      expect(chatService.messages[0].timestamp).toBe('2024-01-02');
    });

    it('does nothing if message not found', () => {
      chatService.messages.push({ _id: 'm1', content: 'Original' });

      chatService.processEditedMessage({ _id: 'm999', content: 'Updated' });

      expect(chatService.messages[0].content).toBe('Original');
    });
  });

  describe('processDeletedMessage', () => {
    it('removes a message from the list', () => {
      chatService.messages.push({ _id: 'm1', content: 'Message 1' });
      chatService.messages.push({ _id: 'm2', content: 'Message 2' });

      chatService.processDeletedMessage({ _id: 'm1' });

      expect(chatService.messages).toHaveLength(1);
      expect(chatService.messages[0]._id).toBe('m2');
    });

    it('does nothing if message not found', () => {
      chatService.messages.push({ _id: 'm1', content: 'Message 1' });

      chatService.processDeletedMessage({ _id: 'm999' });

      expect(chatService.messages).toHaveLength(1);
    });
  });

  describe('sendMessage', () => {
    beforeEach(() => {
      chatService.activeChannelId = 'ch1';
      chatService.channels.push({ _id: 'ch1', name: 'general' });
      chatService.userData = { avatarColor: '#ff0000' };
    });

    it('sends message through WebSocket', () => {
      chatService.sendMessage('Hello world');

      expect(chatService.ws?.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"message"')
      );
      expect(chatService.ws?.send).toHaveBeenCalledWith(
        expect.stringContaining('"content":"Hello world"')
      );
    });

    it('does not send empty messages', () => {
      chatService.sendMessage('');
      chatService.sendMessage('   ');

      expect(chatService.ws?.send).not.toHaveBeenCalled();
    });

    it('does not send when WebSocket is closed', () => {
      (chatService.ws as unknown as MockWebSocket).readyState = MockWebSocket.CLOSED;

      chatService.sendMessage('Hello');

      expect(chatService.ws?.send).not.toHaveBeenCalled();
    });
  });

  describe('sendEditedMessage', () => {
    it('sends edited message through WebSocket', () => {
      chatService.sendEditedMessage('m1', 'Updated content');

      expect(chatService.ws?.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"editMessage"')
      );
      expect(chatService.ws?.send).toHaveBeenCalledWith(
        expect.stringContaining('"messageId":"m1"')
      );
      expect(chatService.ws?.send).toHaveBeenCalledWith(
        expect.stringContaining('"newContent":"Updated content"')
      );
    });

    it('does not send empty content', () => {
      chatService.sendEditedMessage('m1', '');
      chatService.sendEditedMessage('m1', '   ');

      expect(chatService.ws?.send).not.toHaveBeenCalled();
    });
  });

  describe('deleteMessage', () => {
    it('sends delete request through WebSocket', () => {
      chatService.deleteMessage('m1');

      expect(chatService.ws?.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"deleteMessage"')
      );
      expect(chatService.ws?.send).toHaveBeenCalledWith(
        expect.stringContaining('"messageId":"m1"')
      );
    });

    it('does not send when messageId is empty', () => {
      chatService.deleteMessage('');

      expect(chatService.ws?.send).not.toHaveBeenCalled();
    });
  });

  describe('sendActivity', () => {
    beforeEach(() => {
      chatService.activeChannelId = 'ch1';
      chatService.userData = { avatarColor: '#ff0000' };
    });

    it('sends typing activity through WebSocket', () => {
      chatService.sendActivity();

      expect(chatService.ws?.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"activity"')
      );
      expect(chatService.ws?.send).toHaveBeenCalledWith(
        expect.stringContaining('"channelId":"ch1"')
      );
    });
  });

  describe('WebSocket message handling', () => {
    it('processes incoming text messages', () => {
      const message = { _id: 'm1', content: 'Hello', author: { username: 'Alice' } };
      
      (chatService.ws as unknown as MockWebSocket).simulateMessage({
        type: 'text',
        payload: message
      });

      expect(chatService.messages).toContainEqual(message);
    });

    it('processes incoming edit messages', () => {
      chatService.messages.push({ _id: 'm1', content: 'Original' });

      (chatService.ws as unknown as MockWebSocket).simulateMessage({
        type: 'editMessage',
        payload: { _id: 'm1', content: 'Edited', timestamp: '2024-01-02' }
      });

      expect(chatService.messages[0].content).toBe('Edited');
    });

    it('processes incoming delete messages', () => {
      chatService.messages.push({ _id: 'm1', content: 'To delete' });

      (chatService.ws as unknown as MockWebSocket).simulateMessage({
        type: 'deleteMessage',
        payload: { _id: 'm1' }
      });

      expect(chatService.messages).toHaveLength(0);
    });
  });
});
