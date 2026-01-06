<script lang="ts">
  import { setContext } from 'svelte';
  import MessageItem from '../MessageItem.svelte';

  let { message, isSelf, isRepeated, chatService } = $props();

  setContext('chatService', chatService);
</script>

<MessageItem {message} {isSelf} {isRepeated} />

