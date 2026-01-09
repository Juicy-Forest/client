<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  
  let { route, text, icon, orientation, onClick } = $props()
  
  let isActive = $derived($page.url.pathname === route.split('?')[0])
</script>

<button 
  onclick={() => {goto(route); onClick()}} 
  class={`group flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
    isActive 
      ? 'bg-lime-100 text-lime-700' 
      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
  }`}
>
  <i class={`${icon} text-sm`}></i>
  <span class="hidden lg:inline">{text}</span>
</button>
