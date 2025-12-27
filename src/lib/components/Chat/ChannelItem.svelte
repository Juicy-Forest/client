<script lang="ts">
  const { channel, isActive, clickHandler } = $props();
</script>

<li>
  <button
    class={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
      isActive
        ? 'bg-lime-100/50 text-lime-900 shadow-sm ring-1 ring-lime-200/50'
        : 'text-stone-500 hover:bg-stone-100/50 hover:text-stone-700'
    }`}
    onclick={() => clickHandler()}
  >
    <div class="flex flex-col text-left">
      <span
        class={`font-semibold ${isActive ? 'text-lime-950' : 'text-stone-700 group-hover:text-stone-900'}`}
      >
        #{channel.name}
      </span>
    </div>
  </button>
</li>



