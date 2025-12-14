<script lang="ts">
  import { ChatService } from '$lib/services/chat.svelte';
  import ChatSidebar from '$lib/components/Chat/ChatSidebar.svelte';
  import ChatHeader from '$lib/components/Chat/ChatHeader.svelte';
  import ChatMessages from '$lib/components/Chat/ChatMessages.svelte';
  import ChatInput from '$lib/components/Chat/ChatInput.svelte';
  import CreateChannelModal from '$lib/components/Chat/CreateChannelModal.svelte';

  const chat = new ChatService();
  
  let showCreateModal = $state(false);

  function handleCreateChannel(name: string, topic: string) {
    if (chat.createChannel(name, topic)) {
      showCreateModal = false;
    }
  }
</script>

<section class="box-border min-h-screen bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12">
  <div class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
    
    <!-- Sidebar -->
    <ChatSidebar 
      channels={chat.channels}
      activeChannelId={chat.activeChannelId}
      onSelectChannel={(id) => chat.setActiveChannel(id)}
      onOpenCreateModal={() => showCreateModal = true}
    />

    <!-- Chat Area -->
    <div class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl">
      
      <!-- Header -->
      <ChatHeader 
        activeChannel={chat.activeChannel}
        activeMembers={chat.activeMembers}
      />

      <!-- Messages -->
      <div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30">
        <ChatMessages activeMessages={chat.activeMessages} />

        <!-- Input -->
        <ChatInput 
          activeChannelLabel={chat.activeChannel.label}
          onSendMessage={(content) => chat.sendMessage(content)}
        />
      </div>
    </div>
  </div>

  <!-- Create Channel Modal -->
  <CreateChannelModal
    isOpen={showCreateModal}
    onClose={() => showCreateModal = false}
    onCreate={handleCreateChannel}
  />
</section>
