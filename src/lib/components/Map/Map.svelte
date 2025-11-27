<script lang="ts">
  import { onMount } from 'svelte';

  export let selectedIcon: string | null = null; 

  let container: HTMLDivElement | null = null;
  let rect = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };

  let preview: { x: number; y: number; visible: boolean } = { x: -1000, y: -1000, visible: false };
  let placed: Array<{ icon: string; x: number; y: number; id: number }> = [];

  function updateRect() {
    if (container) rect = container.getBoundingClientRect();
  }

  onMount(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  });

  function handleMouseMove(e: MouseEvent) {
    updateRect();
    preview.visible = true;
    preview.x = e.clientX - rect.left;
    preview.y = e.clientY - rect.top;
  }

  function handleMouseLeave() {
    preview.visible = false;
  }

  function placeAt(x: number, y: number) {
    if (!selectedIcon) return;
    const item = { icon: selectedIcon, x, y, id: Date.now() };
    placed = [...placed, item];
  }

  function handleClick(e: MouseEvent) {
    updateRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    placeAt(x, y);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!selectedIcon) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      placeAt(preview.x, preview.y);
    }
  }
</script>

<div
  bind:this={container}
  class="rectangle"
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}
  on:click={handleClick}
  on:keydown={handleKeyDown}
  role="button"
  tabindex="0"
>
  {#each placed as p (p.id)}
    <i class={p.icon + ' placed'} style="left: {p.x}px; top: {p.y}px;" aria-hidden="true"></i>
  {/each}

  {#if preview.visible && selectedIcon}
    <i class={selectedIcon + ' preview'} style="left: {preview.x}px; top: {preview.y}px;" aria-hidden="true"></i>
  {/if}

</div>

<style>
  .rectangle {
    width: 1000px;
    height: 500px;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 3px solid #b45309;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    user-select: none;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  .rectangle i {
    position: absolute;
    transform: translate(-50%, -50%);
    pointer-events: none; 
    color: #92400e;
  }

  .rectangle i.preview {
    opacity: 0.6;
    font-size: 40px;
    color: rgba(146, 64, 14, 0.5);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .rectangle i.placed {
    font-size: 32px;
    color: #b45309;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
</style>