<script lang="ts">
  import { page } from '$app/stores';
  import ChatHeader from '$lib/components/Chat/ChatHeader.svelte';
  import ChatInput from '$lib/components/Chat/ChatInput.svelte';
  import ChatMessages from '$lib/components/Chat/ChatMessages.svelte';
  import ChatSidebar from '$lib/components/Chat/ChatSidebar.svelte';
  import Toast from '$lib/components/UI/Toast.svelte';
  import { ChatService } from '$lib/services/chat.svelte.js';
  import { getContext, setContext } from 'svelte';

  const chat = new ChatService();
  setContext('chatService', chat);
  // const currentGarden = getContext("currentGarden");

  const { data } = $props();
  // const gardenData = data.gardenData[0];
  const userData = data.userData;
  chat.setUserData(userData);
  chat.setCurrentGarden($page.url.searchParams.get('gardenId'));
</script>

<section
  class="box-border bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12"
>
  <div
    class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]"
  >
    <ChatSidebar gardenId={chat.currentGarden} />
    <div
      class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl"
    >
      <ChatHeader activeChannel={chat.activeChannel} />
      <div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30">
        <ChatMessages/>
        {#if chat.channels.length > 0}
          <ChatInput />
        {/if}
      </div>
    </div>
  </div>
</section>

<Toast 
  bind:show={chat.showToast}
  title={chat.toastMessage.title}
  message={chat.toastMessage.message}
  type="success"
/>
