<script lang="ts">
  import ChatHeader from "$lib/components/Chat/ChatHeader.svelte";
  import ChatInput from "$lib/components/Chat/ChatInput.svelte";
  import ChatMessages from "$lib/components/Chat/ChatMessages.svelte";
  import ChatSidebar from "$lib/components/Chat/ChatSidebar.svelte";
  import { ChatService } from "$lib/services/chat.svelte.js";

  const chat = new ChatService();

  const { data } = $props();
  const userData = data.userData;
  let filteredMessages: any[] = $derived(chat.messages.filter(message => message.channelName === chat.activeChannelId));
  $inspect(filteredMessages);
  let people = $derived(chat.peopleTyping);

</script>

<section
  class="box-border bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12"
>
  <div
    class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]"
  >
    <ChatSidebar
      channels={chat.channels}
      activeChannelId={chat.activeChannelId}
      onSelectChannel={(id) => chat.setActiveChannel(id)}
    />
    <div
      class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl"
    >
      <ChatHeader activeChannel={chat.activeChannel} />
      <div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30">
        <ChatMessages 
          messages={filteredMessages} 
          userId={userData._id}
          peopleTyping={people}
          activeChannelId={chat.activeChannelId}
        />
        <ChatInput
          activeChannelLabel={chat.activeChannel.label}
          onSendMessage={(content: any) => chat.sendMessage(content)}
          chat={chat}
        />
      </div>
    </div>
  </div>
</section>
