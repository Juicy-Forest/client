export class ChatService {
  channels: any[] = $state([]);

  activeChannelId: string = $state('');
  messages: any[] = $state([]);
  peopleTyping: any[] = $state([]);
  ws: WebSocket | undefined = $state();
  typingTimeouts: Map<string, any> = new Map(); // Add this line
  userData: any = {};

  constructor() {
    this.socketsSetup();
    $effect(() => {
      if (!this.activeChannelId && this.channels.length > 0) {
        this.activeChannelId = this.channels[0]._id;
      }
    });
  }

  get activeChannel() {
    return this.channels.find((channel) => channel._id === this.activeChannelId) ?? '';
  }

  setUserData(userData: any) {
    this.userData = userData
  };

  setActiveChannel(channelId: string) {
    this.activeChannelId = channelId;
  };

  socketsSetup() {
    this.ws = new WebSocket("ws://localhost:3033");

    this.ws.onopen = () => {
      console.log("Client: Connection established!");
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'activity') {
        this.processActivity(data);
      } else if (data.type === 'initialLoad') {
        this.processInitialLoad(data);
      } else if (data.type === 'text') {
        this.messages.push(data.payload);
      } else if (data.type === 'editMessage') {
        this.processEditedMessage(data.payload)
      }
    };

    return () => {
      this.ws?.close();
    };
  }

  async createChannel(name: string, gardenId: string) {
    const bodyObj = { name: name, gardenId: gardenId };
    const response = await fetch('http://localhost:3030/channel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyObj)
    });
    const channel = await response.json();
    this.channels.push(channel);
  }

  processInitialLoad(data: any) {
    data.messages.forEach((message: any) => this.messages.push(message.payload));
    data.channels.forEach((channel: any) => this.channels.push(channel));
  }

  processActivity(data: any) {
    if (!this.peopleTyping.find(p => p.username === data.payload.username) && this.activeChannelId === data.channelId) {
      this.peopleTyping.push(data.payload);
    }

    if (this.typingTimeouts.has(data.payload)) {
      clearTimeout(this.typingTimeouts.get(data.payload));
    }

    const timeoutId = setTimeout(() => {
      this.peopleTyping = this.peopleTyping.filter(p => p.username !== data.payload.username);
      this.typingTimeouts.delete(data.payload);
    }, 1000);

    this.typingTimeouts.set(data.payload, timeoutId);
  }

  processEditedMessage(editedMessage: any) {
    const messageIndex = this.messages.findIndex(m => m._id == editedMessage._id)
    if (messageIndex !== -1) {
      this.messages[messageIndex] = {
        ...this.messages[messageIndex],
        content: editedMessage.content,
        timestamp: editedMessage.timestamp,
      };
    }
  }

  sendMessage(content: string) {
    if (!content.trim()) return

    const load = JSON.stringify({
      type: "message",
      content: content,
      channelId: this.activeChannelId,
      channelName: this.channels.find(c => c._id === this.activeChannelId),
      avatarColor: this.userData.avatarColor,
    });

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(load);
    }
  }

  sendEditedMessage(messageId: string, newContent: string) {
    if (!newContent.trim()) return

    const load = JSON.stringify({
      type: "editMessage",
      messageId: messageId,
      newContent: newContent,
    });

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(load);
    }
  };

  sendActivity() {
    const load = JSON.stringify({
      type: "activity",
      channelId: this.activeChannelId,
      avatarColor: this.userData.avatarColor,
    });

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(load);
    }
  };
}
