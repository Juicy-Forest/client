import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/svelte";
import ChatServiceTestWrapper from "./ChatServiceTestWrapper.svelte";

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

vi.stubGlobal("WebSocket", MockWebSocket);

describe("ChatService", () => {
  let chatService: any;
  let cleanup: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    const result = render(ChatServiceTestWrapper);
    chatService = result.component.getChatService();
    cleanup = result.unmount;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    cleanup?.();
  });

  describe("channel management", () => {
    it("sets active channel", () => {
      chatService.setActiveChannel("channel123");
      expect(chatService.activeChannelId).toBe("channel123");
    });

    it("returns active channel object", () => {
      const channel = { _id: "ch1", name: "general" };
      chatService.channels.push(channel);
      chatService.activeChannelId = "ch1";

      expect(chatService.activeChannel).toEqual(channel);
    });

    it("loads channels from initial data", () => {
      chatService.processInitialLoad({
        messages: [],
        channels: [
          { _id: "ch1", name: "general" },
          { _id: "ch2", name: "random" },
        ],
      });

      expect(chatService.channels).toHaveLength(2);
    });
  });

  describe("messaging", () => {
    beforeEach(() => {
      chatService.activeChannelId = "ch1";
      chatService.channels.push({ _id: "ch1", name: "general" });
      chatService.userData = { avatarColor: "#ff0000" };
    });

    it("sends message through WebSocket", () => {
      chatService.sendMessage("Hello world");

      expect(chatService.ws?.send).toHaveBeenCalledWith(
        expect.stringContaining('"content":"Hello world"'),
      );
    });

    it("does not send empty messages", () => {
      chatService.sendMessage("");
      chatService.sendMessage("   ");

      expect(chatService.ws?.send).not.toHaveBeenCalled();
    });

    it("receives and stores incoming messages", () => {
      const message = {
        _id: "m1",
        content: "Hello",
        author: { username: "Alice" },
      };

      (chatService.ws as unknown as MockWebSocket).simulateMessage({
        type: "text",
        payload: message,
      });

      expect(chatService.messages).toContainEqual(message);
    });
  });

  describe("editing messages", () => {
    it("sends edit through WebSocket", () => {
      chatService.sendEditedMessage("m1", "Updated content");

      expect(chatService.ws?.send).toHaveBeenCalledWith(
        expect.stringContaining('"newContent":"Updated content"'),
      );
    });

    it("updates message content when edit received", () => {
      chatService.messages.push({ _id: "m1", content: "Original" });

      chatService.processEditedMessage({
        _id: "m1",
        content: "Updated",
        timestamp: "2024-01-02",
      });

      expect(chatService.messages[0].content).toBe("Updated");
    });
  });

  describe("deleting messages", () => {
    it("sends delete through WebSocket", () => {
      chatService.deleteMessage("m1");

      expect(chatService.ws?.send).toHaveBeenCalledWith(
        expect.stringContaining('"messageId":"m1"'),
      );
    });

    it("removes message when delete received", () => {
      chatService.messages.push({ _id: "m1", content: "To delete" });
      chatService.messages.push({ _id: "m2", content: "Keep" });

      chatService.processDeletedMessage({ _id: "m1" });

      expect(chatService.messages).toHaveLength(1);
      expect(chatService.messages[0]._id).toBe("m2");
    });
  });

  describe("typing indicators", () => {
    beforeEach(() => {
      chatService.activeChannelId = "ch1";
    });

    it("tracks typing users", () => {
      chatService.processActivity({
        payload: { username: "Alice", avatarColor: "#ff0000" },
        channelId: "ch1",
      });

      expect(chatService.peopleTyping).toHaveLength(1);
      expect(chatService.peopleTyping[0].username).toBe("Alice");
    });

    it("removes typing indicator after timeout", () => {
      chatService.processActivity({
        payload: { username: "Alice", avatarColor: "#ff0000" },
        channelId: "ch1",
      });

      vi.advanceTimersByTime(1000);

      expect(chatService.peopleTyping).toHaveLength(0);
    });

    it("ignores typing from different channels", () => {
      chatService.processActivity({
        payload: { username: "Alice", avatarColor: "#ff0000" },
        channelId: "ch2",
      });

      expect(chatService.peopleTyping).toHaveLength(0);
    });
  });
});
