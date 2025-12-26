export class ChatService {
  channels: any[] = $state([]);

  activeChannelId: string = $state('');
  messages: any[] = $state([]);
  peopleTyping: string[] = $state([]);
  ws: WebSocket | undefined = $state();
  typingTimeouts: Map<string, number> = new Map(); // Add this line


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
        this.processActivity(data);
      } else if (data.type === 'initialLoad') {
        this.processInitialLoad(data);
      } else if (data.type === 'text') {
        this.messages.push(data.payload);
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
    console.log(response);
  }

  processActivity(data: any) {
    if (!this.peopleTyping.includes(data.payload) && this.activeChannelId === data.channelId) {
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
  }

  sendMessage(content: string) {
    if (!content.trim()) return

    const load = JSON.stringify({
      type: "message",
      content: content,
      channelId: this.activeChannelId,
      channelName: this.channels.find(c => c._id === this.activeChannelId)
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

  processInitialLoad(data: any) {
    console.log(data);
    data.messages.forEach((message) => this.messages.push(message.payload));
    data.channels.forEach(channel => this.channels.push(channel));
  }
}
