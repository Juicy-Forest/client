<script lang="ts">
  import { onMount } from 'svelte';

  let ws: WebSocket | undefined = $state();
  let draftMessage = $state("");
  let messages: any[] = $state([]);
  const { data } = $props();
  const userData = data.userData;
  onMount(() => {
    ws = new WebSocket("ws://localhost:3033");

    ws.onopen = () => {
      console.log("Client: Connection established!");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data).payload;
      messages.push(data);
    };

    return () => {
      ws?.close();
    };
  });

  function sendMessage() {
    const load = JSON.stringify({
      message: draftMessage,
    });

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(load);
      draftMessage = "";
    }
  }

  function submissionHandler(e: Event) {
    e.preventDefault();
    sendMessage();
  }
</script>

<section
  class="box-border min-h-screen bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12"
>
  <form onsubmit={submissionHandler}>
    <input type="text" bind:value={draftMessage} />
    <button type="submit">Send</button>
  </form>
  {#if messages.length === 0}
    <p>No messages yet.</p>
  {:else}
    {#each messages as message}
      <p class="{userData._id === message.author._id ? "text-blue-500" : "text-orange-500"}">{message.author.username}: {message.content}</p>
    {/each}
  {/if}
</section>
