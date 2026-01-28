<script lang="ts">
  import ChangeButton from './ChangeButton.svelte';
  import SettingSection from './SettingSection.svelte';
  import GardenMembers from './GardenMembers.svelte';
  import GardenAccessCode from './GardenAccessCode.svelte';
  import GardenLockedView from './GardenLockedView.svelte';
  import { createFieldEnhancer } from '../../../routes/settings/settingHelpers';

  interface Garden {
    _id: string;
    name: string;
    owner: { _id: string; email: string };
    members: Array<{ _id: string; email: string }>;
    joinCode: string;
  }

  interface User {
    _id: string;
  }

  interface FormState {
    gardenName: { value: string; error: string; success: string };
  }

  const {
      user,
      gardens,
      formState,
      clearAllMessages,
      openDeleteGardenModal
  } = $props<{
    user: User;
    gardens: Garden[];
    formState: FormState;
    clearAllMessages: () => void;
    openDeleteGardenModal: (garden: any) => void;
  }>();
</script>

<div class="space-y-6">
  {#if gardens && gardens.length > 0}
    {#if gardens[0]?.owner?._id === user._id}
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
          <div class="space-y-4">
            <div>
              <label for="gardenName" class="block text-xs font-medium text-stone-600 mb-2">Current Garden Name: {gardens[0]?.name}</label>
              <input
                id="gardenName"
                type="text"
                name="newGardenName"
                placeholder="Enter new name for the garden"
                bind:value={formState.gardenName.value}
                class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
              <input type="hidden" name="gardenId" value={gardens[0]?._id} />
              <ChangeButton settingField="Garden name" />
            </div>
          </div>
      </SettingSection>

      <GardenMembers 
        members={gardens[0]?.members || []} 
        owner={gardens[0]?.owner}
        isOwner={true}
        gardenId={gardens[0]?._id}
        onMemberRemoved={() => {
            location.reload();
        }}
      />

      <GardenAccessCode joinCode={gardens[0]?.joinCode} />

      <div class="flex justify-end pt-4">
        <button
          onclick={() => openDeleteGardenModal(gardens[0])}
          class="rounded-lg bg-red-400 px-4 py-2 text-sm font-medium text-stone-800 hover:bg-red-500 transition-colors"
        >
          Delete Garden
        </button>
      </div>
    {:else}
      <GardenLockedView garden={gardens[0]} />
    {/if}
  {:else}
    <p class="text-stone-600">No garden found.</p>
  {/if}
</div>
