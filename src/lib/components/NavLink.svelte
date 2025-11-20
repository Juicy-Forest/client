<script lang="ts">
  import { goto } from '$app/navigation'
  let { route, text, icon } = $props()

</script>

<li>
  <button onclick={() => goto(route)} class="flex flex-col cursor-pointer py-4 text-sm rounded-full hover:text-blue-500 hover:-translate-y-0.5 transition">
      <i class={icon}></i>
      {text}
  </button>
</li>

