import { type Channel } from '$lib/components/Chat/types';

export class ChatService {
  channels: Channel[] = $state([
    { id: 'general', label: 'general', topic: 'All conversations are here', unread: 3 },
    { id: 'expeditions', label: 'expeditions', topic: 'Field coordination & reports' },
    { id: 'lab-notes', label: 'lab-notes', topic: 'Research documentation & drafts' },
    { id: 'supplies', label: 'supplies', topic: 'Requests & inventory updates', unread: 1 }
  ]);

  activeChannelId: string = $state('');
  messages: any[] = $state([]);
  peopleTyping: string[] = $state([]);
  ws: WebSocket | undefined = $state();
  typingTimeouts: Map<string, number> = new Map(); // Add this line


  constructor() {
    this.socketsSetup();
    $effect(() => {
      if (!this.activeChannelId && this.channels.length > 0) {
        this.activeChannelId = this.channels[0].id;
      }
    });
  }

  get activeChannel() {
    return this.channels.find((channel) => channel.id === this.activeChannelId) ?? this.channels[0];
  }

  setActiveChannel(channelId: string) {
    this.activeChannelId = channelId;
  }

  socketsSetup() {
    this.ws = new WebSocket("ws://localhost:3033");

    this.ws.onopen = () => {
      console.log("Client: Connection established!");
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'activity') {
        if(!this.peopleTyping.includes(data.payload) && this.activeChannelId === data.channelId){
          this.peopleTyping.push(data.payload);
        }

        if (this.typingTimeouts.has(data.payload)) {
          clearTimeout(this.typingTimeouts.get(data.payload));
        }
        
        const timeoutId = setTimeout(() => {
          this.peopleTyping = this.peopleTyping.filter(p => p !== data.payload);
          this.typingTimeouts.delete(data.payload);
        }, 1000);
        
        this.typingTimeouts.set(data.payload, timeoutId);
      }else {
        this.processIncomingMessages(data);
      }
    };

    return () => {
      this.ws?.close();
    };
  }

  sendMessage(content: string) {
    if (!content.trim()) return

    const load = JSON.stringify({
      type: "message",
      content: content,
      channelId: this.activeChannelId
    });

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(load);
    }
  }

  sendActivity() {
    const load = JSON.stringify({
      type: "activity",
      channelId: this.activeChannelId,
    });

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(load);
    }
  };

  processIncomingMessages(data: any) {
    if (!Array.isArray(data)) {
      // Single message
      this.messages.push(data.payload);
    } else {
      data.forEach((message) => this.messages.push(message.payload));
    }
  }
}
