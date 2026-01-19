<script lang="ts">
  import Option from '$lib/components/Settings/Option.svelte';
  import SettingsContent from '$lib/components/Settings/SettingsContent.svelte';
  import Logout from '$lib/components/Settings/Logout.svelte';
  import InventoryDeleteModal from '$lib/components/inventory/InventoryDeleteModal.svelte';

  let activeTab = $state('profile');
  let showDeleteGardenModal = $state(false);
  let pendingGardenDelete: any = $state(null);
  const { data } = $props();
  const user: any = $state(data.userData);
  const gardens = $state(data?.gardenData ?? []);
  
  const settingsOptions = [
      {
          id: 'profile',
          label: 'Profile',
          icon: 'fa-solid fa-user',
          color: 'bg-blue-100 text-blue-700'
      },
      {
          id: 'garden',
          label: 'Garden',
          icon: 'fa-solid fa-leaf',
          color: 'bg-green-100 text-green-700'
      }
  ];

  function openDeleteGardenModal(garden: any) {
      pendingGardenDelete = garden;
      showDeleteGardenModal = true;
  }

  function closeDeleteGardenModal() {
      showDeleteGardenModal = false;
      pendingGardenDelete = null;
  }

  async function confirmDeleteGarden() {
      if (!pendingGardenDelete) return;
      try {
          const form = new FormData();
          form.append('gardenId', pendingGardenDelete._id);

          const response = await fetch('?/deleteGarden', {
              method: 'POST',
              body: form
          });

          if (response.ok) {
              window.location.href = '/settings';
          }
      } catch (error) {
          console.error('Failed to delete garden:', error);
      } finally {
          closeDeleteGardenModal();
      }
  }
</script> 


<section
  class="box-border min-h-screen overflow-hidden bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12"
>
  <div
    class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]"
  >
    <!-- sidebar -->
    <aside
      class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 px-5 py-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80"
    >
      <header class="mb-6 px-2">
        <p class="text-xs font-bold uppercase tracking-widest text-stone-400">
          Settings
        </p>
        <h1 class="mt-1 text-lg font-bold tracking-tight text-stone-800">
          Dashboard
        </h1>
      </header>

      <div class="flex-1 overflow-y-auto pr-1">
        <div class="flex flex-col gap-2">
          {#each settingsOptions as option (option.id)}
            <Option {option} {activeTab} setActiveTab={(value: string) => { activeTab = value; }}/>
          {/each}
        </div>
      </div>

      <Logout />
    </aside>

    <!-- main content -->
    <article
      class="flex h-[calc(100vh-10.5rem)] flex-col rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl"
    >
      <header
        class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-white/50 px-8 py-5 backdrop-blur-sm"
      >
        <div>
          <h2 class="text-lg font-bold text-stone-800">
            {settingsOptions.find((opt) => opt.id === activeTab)?.label || 'Settings'}
          </h2>
          <p class="mt-0.5 text-sm text-stone-500">
            Manage your {settingsOptions.find((opt) => opt.id === activeTab)?.label?.toLowerCase()} preferences
          </p>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto bg-stone-50/30 px-8 py-6">
        <SettingsContent {activeTab} {user} {gardens} {openDeleteGardenModal} />
      </div>
    </article>
  </div>
</section>

{#if showDeleteGardenModal}
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-stone-900/20 backdrop-blur-sm" role="presentation" onclick={closeDeleteGardenModal} onkeydown={(e) => e.key === 'Escape' && closeDeleteGardenModal()}>
    <div class="w-full max-w-md rounded-[2rem] border border-stone-100 bg-white p-8" role="dialog" aria-modal="true" tabindex="0" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
      <InventoryDeleteModal 
        item={{ name: pendingGardenDelete?.name }}
        onCancel={closeDeleteGardenModal}
        onDelete={confirmDeleteGarden}
      />
    </div>
  </div>
{/if}
