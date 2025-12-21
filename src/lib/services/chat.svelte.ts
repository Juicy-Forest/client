import { type Channel } from '$lib/components/Chat/types';

export class ChatService {
  channels: Channel[] = $state([
    { id: 'general', label: 'general', topic: 'Announcements & hangouts', unread: 3 },
    { id: 'expeditions', label: 'expeditions', topic: 'Field coordination & reports' },
    { id: 'lab-notes', label: 'lab-notes', topic: 'Research documentation & drafts' },
    { id: 'supplies', label: 'supplies', topic: 'Requests & inventory updates', unread: 1 }
  ]);

  messages: any[] = $state([]);
  activeChannelId: string = $state('');

  constructor() {
    $effect(() => {
      if (!this.activeChannelId && this.channels.length > 0) {
        this.activeChannelId = this.channels[0].id;
      }
    });
  }

  get activeChannel() {
    return this.channels.find((channel) => channel.id === this.activeChannelId) ?? this.channels[0];
  }

  get activeMessages() {
    return this.messages;
  }

  setActiveChannel(channelId: string) {
    this.activeChannelId = channelId;
  }

  sendMessage(ws: WebSocket | undefined, content:string) {
    if (!content.trim()) return

    const load = JSON.stringify({
      type: "message",
      content: content,
      channelId: this.activeChannelId
    });

    console.log(load);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(load);
    }
  }

  processIncomingMessages(data: any) {
    if (!Array.isArray(data)) {
      // Single message
      this.messages.push(data.payload);
    } else {
      data.forEach((message) => this.messages.push(message.payload));
    }
  }
}



