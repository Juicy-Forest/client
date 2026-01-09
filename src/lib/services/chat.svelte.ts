export class ChatService {
  channels: any[] = $state([]);

  activeChannelId: string = $state('');
  messages: any[] = $state([]);
  peopleTyping: any[] = $state([]);
  ws: WebSocket | undefined = $state();
  typingTimeouts: Map<string, any> = new Map(); // Add this line
  userData: any = {};
  currentGarden: any = '';
  showToast: boolean = $state(false);
  toastMessage: { title: string; message: string } = $state({ title: '', message: '' }); 

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

  setCurrentGarden(currentGarden: any) {
    this.currentGarden= currentGarden 
  };

  setActiveChannel(channelId: string) {
    this.activeChannelId = channelId;
  };

  socketsSetup() {
    this.ws = new WebSocket("ws://localhost:3033");

    this.ws.onopen = () => {
      console.log(this.currentGarden)
      console.log("Client: Connection established!");
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'getMessages', gardenId: this.currentGarden}));
      }
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
      } else if (data.type === 'deleteMessage') {
        this.processDeletedMessage(data.payload);
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
    
    this.displayToast("Channel created successfully", `#${name} is now available`);
  }

  displayToast(title: string, message: string) {
    this.toastMessage = { title, message };
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  processInitialLoad(data: any) {
    data.messages.forEach((message: any) => this.messages.push(message.payload));
    data.channels.forEach((channel: any) => this.channels.push(channel));
  }

  processActivity(data: any) {
    const username = data.payload.username;

    if (!this.peopleTyping.find(p => p.username === username) && this.activeChannelId === data.channelId) {
      this.peopleTyping.push(data.payload);
    }

    if (this.typingTimeouts.has(username)) {
      clearTimeout(this.typingTimeouts.get(username));
    }

    const timeoutId = setTimeout(() => {
      this.peopleTyping = this.peopleTyping.filter(p => p.username !== username);
      this.typingTimeouts.delete(username);
    }, 1000);

    this.typingTimeouts.set(username, timeoutId);
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

  processDeletedMessage(deletedMessage: any) {
    const messageIndex = this.messages.findIndex(m => m._id == deletedMessage._id)
    if (messageIndex !== -1) {
      this.messages.splice(messageIndex, 1);
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
      gardenId: this.currentGarden
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

  deleteMessage(messageId: string) {
    if (!messageId) {
      return;
    }

    const load = JSON.stringify({
      type: "deleteMessage",
      messageId: messageId,
    });

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(load);
    }
  }

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
