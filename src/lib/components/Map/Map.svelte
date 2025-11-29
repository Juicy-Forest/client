<script lang="ts">
  import { onMount } from 'svelte';
  import ItemDetails from './ItemDetails.svelte';

  export let selectedIcon: string | null = null;
  export let isEditMode = false; 

  let container: HTMLDivElement | null = null;
  let rect = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };

  let preview: { x: number; y: number; visible: boolean } = { x: -1000, y: -1000, visible: false };
  let placed: Array<{ icon: string; x: number; y: number; id: number }> = [];
  let selectedItem: { icon: string; x: number; y: number; id: number } | null = null;

  let zoom = 1;
  const minZoom = 0.3;
  const maxZoom = 5;

  let emojiMap: Record<string, string> = {
    water: '💧',
    plant: '🌱',
    plants: '🌿',
    bush: '🌾',
    tree: '🌳'
  };

  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartOffsetX = 0;
  let dragStartOffsetY = 0;

  function updateRect() {
    if (container) rect = container.getBoundingClientRect();
  }

  onMount(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  });

  function handleMouseMove(e: MouseEvent) {
    if (isDragging) {
      offsetX = dragStartOffsetX + (e.clientX - dragStartX);
      offsetY = dragStartOffsetY + (e.clientY - dragStartY);
      return;
    }

    if (!isEditMode) return; 
    updateRect();
    preview.visible = true;
    // Calculate position in unscaled coordinate space
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    preview.x = (x - offsetX) / zoom;
    preview.y = (y - offsetY) / zoom;
  }

  function handleMouseLeave() {
    preview.visible = false;
    isDragging = false;
  }

  function placeAt(x: number, y: number) {
    if (!selectedIcon) return;
    const item = { icon: selectedIcon, x, y, id: Date.now() };
    placed = [...placed, item];
  }

  function handleMouseDown(e: MouseEvent) {
    if (isEditMode) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartOffsetX = offsetX;
    dragStartOffsetY = offsetY;
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleClick(e: MouseEvent) {
    if (isDragging) return; 
    
    updateRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Convert to unscaled coordinate space
    const mapX = (x - offsetX) / zoom;
    const mapY = (y - offsetY) / zoom;

    // Check if clicking on an existing item (hit radius of 30px)
    if (!isEditMode) {
      const hitRadius = 30;
      const clickedItem = placed.find(item => 
        Math.abs(item.x - mapX) < hitRadius && Math.abs(item.y - mapY) < hitRadius
      );
      if (clickedItem) {
        selectedItem = clickedItem;
        return;
      }
    }

    // Place new item in edit mode
    if (isEditMode) {
      placeAt(mapX, mapY);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!selectedIcon) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      placeAt(preview.x, preview.y);
    }
  }

  function handleWheel(e: WheelEvent) {
    if (isEditMode) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    zoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta));
    
    if (zoom === minZoom) {
      offsetX = 0;
      offsetY = 0;
    }
  }
</script>

<div
  bind:this={container}
  class="rectangle"
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}
  on:mousedown={handleMouseDown}
  on:mouseup={handleMouseUp}
  on:click={handleClick}
  on:keydown={handleKeyDown}
  on:wheel={handleWheel}
  role="button"
  tabindex="0"
  style="transform: translate({offsetX}px, {offsetY}px) scale({zoom}); transform-origin: center top;"
>
  {#each placed as p (p.id)}
    <span class="placed-emoji" style="left: {p.x}px; top: {p.y}px;" aria-hidden="true">{emojiMap[p.icon] || p.icon}</span>
  {/each}

  {#if preview.visible && selectedIcon}
    <span class="preview-emoji" style="left: {preview.x}px; top: {preview.y}px;" aria-hidden="true">{emojiMap[selectedIcon] || selectedIcon}</span>
  {/if}


</div>

<ItemDetails bind:item={selectedItem} {emojiMap} />

<style>
  .rectangle {
    width: 1400px;
    height: 700px;
    background-image: url('https://www.spier.co.za/wp-content/uploads/2025/01/Spier-Food-Garden-aerial-06_EY-1-2.jpg');
    background-size: cover;
    background-position: center;
    border: 3px solid #b45309;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    user-select: none;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    transition: transform 150ms ease-out;
    cursor: pointer;
  }

  .rectangle:active {
    cursor: grabbing;
  }

  .placed-emoji {
    position: absolute;
    transform: translate(-50%, -50%);
    pointer-events: none;
    font-size: 48px;
    line-height: 1;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #b45309;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .preview-emoji {
    position: absolute;
    transform: translate(-50%, -50%);
    pointer-events: none;
    font-size: 56px;
    line-height: 1;
    opacity: 0.85;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 50%;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #d97706;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
</style>