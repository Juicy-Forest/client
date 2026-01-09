<script lang="ts">
  import ProfileSettings from './ProfileSettings.svelte';
  import GardenSettings from './GardenSettings.svelte';

  let { 
    activeTab,
    user, 
    gardens,
    openDeleteGardenModal
  } = $props();

  let formState = $state({
    username: { value: '', error: '', success: '' },
    email: { value: '', error: '', success: '' },
    password: { value: '', error: '', success: '' },
    gardenName: { value: '', error: '', success: '' }
  });
  
  const clearAllMessages = () => {
    (Object.keys(formState) as Array<keyof typeof formState>).forEach((key) => {
      formState[key].error = '';
      formState[key].success = '';
    });
  };

</script>

{#if activeTab === 'profile'}
  <ProfileSettings {user} {formState} {clearAllMessages} />
{:else if activeTab === 'garden'}
  <GardenSettings {user} {gardens} {formState} {clearAllMessages} {openDeleteGardenModal} />
{/if}
