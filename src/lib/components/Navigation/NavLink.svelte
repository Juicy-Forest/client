<script lang="ts">
  import { goto } from '$app/navigation'
  let { route, text, icon, orientation, onClick } = $props()
</script>

<button onclick={() => {goto(route); onClick()}} class={`flex flex-col text-neutral-600 cursor-pointer py-4 text-sm rounded-full hover:text-green-500 hover:-translate-y-0.5 transition ${orientation == "Vertical" ? "flex-col" : "flex-row gap-4 items-center text-2xl"}` }>
    <i class={icon}></i>
    {text}
</button>
