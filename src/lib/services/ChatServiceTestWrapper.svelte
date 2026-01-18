<script lang="ts">
  import { ChatService } from './chat.svelte';
  
  const chatService = new ChatService();
  
  export function getChatService() {
      return chatService;
  }
</script>

<div></div>

