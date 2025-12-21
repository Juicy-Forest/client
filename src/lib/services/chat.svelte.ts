import { type Channel, type Message } from '$lib/components/Chat/types';

export class ChatService {
  channels: Channel[] = $state([
    { id: 'general', label: 'general', topic: 'Announcements & hangouts', unread: 3 },
    { id: 'expeditions', label: 'expeditions', topic: 'Field coordination & reports' },
    { id: 'lab-notes', label: 'lab-notes', topic: 'Research documentation & drafts' },
    { id: 'supplies', label: 'supplies', topic: 'Requests & inventory updates', unread: 1 }
  ]);

  messages: Record<string, Message[]> = $state({});
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
    return this.messages[this.activeChannelId] ?? [];
  }

  get activeMembers() {
    return Array.from(
      this.activeMessages.reduce((map, message) => {
        if (!map.has(message.author.name)) {
          map.set(message.author.name, {
            name: message.author.name,
            avatarColor: message.author.avatarColor,
            initials: message.author.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
          });
        }
        return map;
      }, new Map<string, { name: string; avatarColor: string; initials: string }>()).values()
    );
  }

  setActiveChannel(channelId: string) {
    this.activeChannelId = channelId;
  }

  sendMessage(ws: WebSocket | undefined, content:string) {
    if (!content.trim()) return

    const load = JSON.stringify({
      type: "message",
      message: content,
      channelId: this.activeChannelId
    });

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(load);
    }
  }
  
  getInitialMessages(ws: WebSocket | undefined){
    const load = JSON.stringify({
      type: "initialMessages",
      channelId: this.activeChannelId
    })

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(load);
    }
  }

  sendMessageAI(content: string) {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      author: {
        name: 'You',
        role: 'Team Member',
        color: 'text-stone-800',
        avatarColor: 'bg-stone-200 text-stone-600'
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: content
    };

    if (!this.messages[this.activeChannelId]) {
      this.messages[this.activeChannelId] = [];
    }

    this.messages[this.activeChannelId] = [...this.messages[this.activeChannelId], newMessage];
  }

  createChannel(name: string, topic: string): boolean {
    if (!name.trim()) return false;

    const id = name.toLowerCase().replace(/\s+/g, '-');
    if (this.channels.some((c) => c.id === id)) {
      alert('Channel already exists!');
      return false;
    }
    
    const newChannel: Channel = {
      id,
      label: name,
      topic: topic || 'New channel',
    };
    
    this.channels = [...this.channels, newChannel];
    this.messages[id] = [];
    this.setActiveChannel(id);
    return true;
  }
}



