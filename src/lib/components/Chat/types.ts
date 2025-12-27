export type Channel = {
  id: string;
  label: string;
  topic: string;
  unread?: number;
};

export type Message = {
  id: string;
  author: {
    name: string;
    role: string;
    color: string;
    avatarColor: string;
  };
  timestamp: string;
  content: string;
};








