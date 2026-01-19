<script lang="ts">
  import { setContext } from 'svelte';
  import MessageItem from '../MessageItem.svelte';

  const { message, isSelf, isRepeated, chatService } = $props();

  setContext('chatService', chatService);
</script>

<MessageItem {message} {isSelf} {isRepeated} />

