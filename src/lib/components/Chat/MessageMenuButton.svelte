<script lang="ts">
  let { onclick } = $props();
</script>

<button
  type="button"
  {onclick}
  class="flex h-7 w-7 items-center justify-center rounded-full text-stone-400 opacity-0 transition-all hover:bg-stone-100 hover:text-stone-600 group-hover:opacity-100"
  aria-label="Message options"
>
  <i class="fa-solid fa-ellipsis-vertical text-sm"></i>
</button>


