<script lang="ts">
  import ChangeButton from './ChangeButton.svelte';
  import SettingSection from './SettingSection.svelte';
  import { createFieldEnhancer } from '../../../routes/settings/settingHelpers';

  let { 
    activeTab,
    user, 
    gardens
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
  <div class="space-y-6">
    <SettingSection
      title="Change Username"
      action="?/updateUsername"
      fieldName="username"
      error={formState.username.error}
      success={formState.username.success}
      onEnhance={createFieldEnhancer({
        fieldName: 'username',
        formState,
        clearAllMessages,
        shouldReload: true,
        onSuccess: (data) => {
          user.username = data?.newUsername;
        }
      })}
    >
      {#snippet children()}
        <div class="space-y-4">
          <div>
            <label for="newUsername" class="block text-xs font-medium text-stone-600 mb-2">Current Username: {user.username}</label>
            <input
              id="newUsername"
              type="text"
              name="newUsername"
              bind:value={formState.username.value}
              class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
              placeholder="Enter new username"
            />
            <ChangeButton settingField="username" />
          </div>
        </div>
      {/snippet}
    </SettingSection>

    <SettingSection
      title="Change Email"
      action="?/updateEmail"
      fieldName="email"
      error={formState.email.error}
      success={formState.email.success}
      onEnhance={createFieldEnhancer({
        fieldName: 'email',
        formState,
        clearAllMessages,
        shouldReload: true,
        onSuccess: (data) => {
          user.email = data?.newEmail;
        }
      })}
    >
      {#snippet children()}
        <div class="space-y-4">
          <div>
            <label for="newEmail" class="block text-xs font-medium text-stone-600 mb-2">Current Email: {user.email}</label>
            <input
              id="newEmail"
              type="email"
              name="newEmail"
              bind:value={formState.email.value}
              class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
              placeholder="Enter new email"
            />
            <ChangeButton settingField="email" />
          </div>
        </div>
      {/snippet}
    </SettingSection>

    <SettingSection
      title="Change Password"
      action="?/changePassword"
      fieldName="password"
      error={formState.password.error}
      success={formState.password.success}
      onEnhance={createFieldEnhancer({
        fieldName: 'password',
        formState,
        clearAllMessages,
        shouldReload: false
      })}
    >
      {#snippet children()}
        <div class="space-y-4">
          <div>
            <label for="newPassword" class="block text-xs font-medium text-stone-600 mb-2">New Password</label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              bind:value={formState.password.value}
              class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
            <ChangeButton settingField="password" />
          </div>
        </div>
      {/snippet}
    </SettingSection>
  </div>
{:else if activeTab === 'garden'}
  <div class="space-y-6">
    <SettingSection
      title="Garden Preferences"
      action="?/updateGardenName"
      fieldName="gardenName"
      error={formState.gardenName.error}
      success={formState.gardenName.success}
      onEnhance={createFieldEnhancer({
        fieldName: 'gardenName',
        formState,
        clearAllMessages,
        shouldReload: false,
        onSuccess: (data) => {
          if (gardens[0]) {
            gardens[0].name = data?.newGardenName;
          }
        }
      })}
    >
      {#snippet children()}
        {#if gardens && gardens.length > 0}
          <div class="space-y-4">
            <div>
              <label for="gardenName" class="block text-xs font-medium text-stone-600 mb-2">Current Garden Name: {gardens[0]?.name}</label>
              <input
                id="gardenName"
                type="text"
                name="newGardenName"
                bind:value={formState.gardenName.value}
                class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                placeholder={gardens[0]?.name}
              />
              <input type="hidden" name="gardenId" value={gardens[0]?._id} />
              <ChangeButton settingField="gardenName" />
            </div>
          </div>
        {:else}
          <p class="text-stone-600">No garden found.</p>
        {/if}
      {/snippet}
    </SettingSection>

    {#if gardens && gardens.length > 0 && gardens[0]?.owner?._id === user._id}
      <div class="rounded-2xl border border-stone-200 bg-white p-6">
        <h3 class="mb-4 text-sm font-bold text-stone-800">Garden Access Code</h3>
        <p class="text-xs font-medium text-stone-600 mb-2">Share this code with others to let them join your garden:</p>
        <div class="flex items-center gap-2">
          <div class="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-mono text-stone-800">
            {gardens[0]?.joinCode || 'Loading...'}
          </div>
          <button
            type="button"
            onclick={() => {
              const code = gardens[0]?.joinCode;
              if (code) {
                navigator.clipboard.writeText(code);
              }
            }}
            class="rounded-lg bg-lime-400 px-4 py-2 text-sm font-medium text-stone-800 hover:bg-lime-500 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
    {/if}
  </div>
{/if}
