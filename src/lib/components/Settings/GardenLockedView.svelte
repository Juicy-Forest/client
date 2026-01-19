<script lang="ts">
  interface Garden {
    _id: string;
    name: string;
    owner: { _id: string; email: string };
    members: Array<{ _id: string; email: string }>;
  }

  const {
      garden
  } = $props<{
    garden: Garden;
  }>();
</script>

<div class="rounded-2xl border border-stone-200 bg-stone-100/50 p-6 opacity-60">
  <div class="flex items-start gap-3 mb-4">
    <div class="text-sm text-stone-600 mt-0.5">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
      </svg>
    </div>
    <div>
      <h3 class="text-sm font-bold text-stone-700">Garden Preferences</h3>
      <p class="text-xs text-stone-600 mt-1">Only the garden owner can modify these settings.</p>
    </div>
  </div>
  <div class="space-y-4">
    <div>
      <label for="gardenNameReadonly" class="block text-xs font-medium text-stone-600 mb-2">Current Garden Name: {garden?.name}</label>
      <input
        id="gardenNameReadonly"
        type="text"
        value={garden?.name}
        disabled
        class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm bg-stone-50 text-stone-500 cursor-not-allowed"
      />
    </div>
  </div>
</div>

<div class="rounded-2xl border border-stone-200 bg-stone-100/50 p-6 opacity-60">
  <div class="flex items-start gap-3 mb-4">
    <div class="text-sm text-stone-600 mt-0.5">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
      </svg>
    </div>
    <div>
      <h3 class="text-sm font-bold text-stone-700">Garden Access Code</h3>
      <p class="text-xs text-stone-600 mt-1">Only the garden owner can share the access code.</p>
    </div>
  </div>
  <div class="flex items-center gap-2">
    <div class="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-mono text-stone-400">
      ••••••••••••••••
    </div>
    <button
      type="button"
      disabled
      class="rounded-lg bg-stone-300 px-4 py-2 text-sm font-medium text-stone-500 cursor-not-allowed"
    >
      Copy
    </button>
  </div>
</div>

<div class="rounded-2xl border border-stone-200 bg-white p-6">
  <h3 class="mb-4 text-sm font-bold text-stone-800">Garden Members</h3>
  <p class="text-xs font-medium text-stone-600 mb-4">Members in this garden ({garden?.members?.length || 0}):</p>
  <div class="space-y-2">
    {#if garden?.members && garden.members.length > 0}
      {#each garden.members as member (member._id)}
        <div class="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-full bg-lime-200 flex items-center justify-center text-xs font-bold text-stone-700">
              {member.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p class="text-sm font-medium text-stone-800">{member.email}</p>
              {#if member._id === garden?.owner?._id}
                <p class="text-xs text-lime-600 font-semibold">Owner</p>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <p class="text-xs text-stone-500">No members yet.</p>
    {/if}
  </div></div>
