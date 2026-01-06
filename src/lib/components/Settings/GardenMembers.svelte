<script lang="ts">
  interface Member {
    _id: string;
    email: string;
  }

  interface Owner {
    _id: string;
    email: string;
  }

  let {
    members,
    owner,
    isOwner = false,
    gardenId,
    onMemberRemoved
  } = $props<{
    members: Member[];
    owner: Owner;
    isOwner?: boolean;
    gardenId?: string;
    onMemberRemoved?: () => void;
  }>();

  let removingMemberId: string | null = $state(null);

  async function removeMember(memberId: string) {
    removingMemberId = memberId;
    try {
      const form = new FormData();
      form.append('gardenId', gardenId || '');
      form.append('memberId', memberId);

      const response = await fetch('?/removeMember', {
        method: 'POST',
        body: form
      });

      if (response.ok) {
        onMemberRemoved?.();
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
    } finally {
      removingMemberId = null;
    }
  }
</script>

<div class="rounded-2xl border border-stone-200 bg-white p-6">
  <h3 class="mb-4 text-sm font-bold text-stone-800">Garden Members</h3>
  <p class="text-xs font-medium text-stone-600 mb-4">Members in this garden ({members?.length || 0}):</p>
  <div class="space-y-2">
    {#if members && members.length > 0}
      {#each members as member (member._id)}
        <div class="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-full bg-lime-200 flex items-center justify-center text-xs font-bold text-stone-700">
              {member.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p class="text-sm font-medium text-stone-800">{member.email}</p>
              {#if member._id === owner?._id}
                <p class="text-xs text-lime-600 font-semibold">Owner</p>
              {/if}
            </div>
          </div>
          {#if isOwner && member._id !== owner?._id}
            <button
              onclick={() => removeMember(member._id)}
              disabled={removingMemberId === member._id}
              class="px-3 py-1 rounded-lg bg-red-100 text-red-600 text-xs font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {removingMemberId === member._id ? 'Removing...' : 'Remove'}
            </button>
          {/if}
        </div>
      {/each}
    {:else}
      <p class="text-xs text-stone-500">No members yet.</p>
    {/if}
  </div>
</div>
