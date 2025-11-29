<script lang="ts">
  import { onMount } from 'svelte';
  import ItemDetails from './ItemDetails.svelte';

  export let selectedIcon: string | null = null;
  export let isEditMode = false; 

  let container: HTMLDivElement | null = null;
  let rect = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };

  let preview: { x: number; y: number; visible: boolean } = { x: -1000, y: -1000, visible: false };
  let placed: Array<{ icon: string; x: number; y: number; id: number; condition: 'good' | 'fair' | 'poor' }> = [];
  let selectedItem: { icon: string; x: number; y: number; id: number; condition: 'good' | 'fair' | 'poor' } | null = null;

  function getRandomCondition(): 'good' | 'fair' | 'poor' {
    const conditions = ['good', 'fair', 'poor'] as const;
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  function getConditionColor(condition: 'good' | 'fair' | 'poor'): string {
    const colors: Record<'good' | 'fair' | 'poor', string> = {
      good: '#22c55e',
      fair: '#f59e0b',
      poor: '#ef4444'
    };
    return colors[condition];
  }

  let emojiMap: Record<string, string> = {
    water: '💧',
    plant: '🌱',
    plants: '🌿',
    bush: '🌾',
    tree: '🌳'
  };

  function updateRect() {
    if (container) rect = container.getBoundingClientRect();
  }

  onMount(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  });

  function handleMouseMove(e: MouseEvent) {
    if (!isEditMode) return; 
    updateRect();
    preview.visible = true;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    preview.x = x;
    preview.y = y;
  }

  function handleMouseLeave() {
    preview.visible = false;
  }

  function placeAt(x: number, y: number) {
    if (!selectedIcon) return;
    // Store as percentage to handle resizing
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    const item = { icon: selectedIcon, x: xPct, y: yPct, id: Date.now(), condition: getRandomCondition() };
    placed = [...placed, item];
  }

  function handleClick(e: MouseEvent) {
    updateRect();
    const mapX = e.clientX - rect.left;
    const mapY = e.clientY - rect.top;

    // Check if clicking on an existing item (hit radius of 30px)
    if (!isEditMode) {
      const hitRadius = 30;
      const clickedItem = placed.find(item => {
        const itemX = (item.x / 100) * rect.width;
        const itemY = (item.y / 100) * rect.height;
        return Math.abs(itemX - mapX) < hitRadius && Math.abs(itemY - mapY) < hitRadius;
      });
      
      if (clickedItem) {
        selectedItem = clickedItem;
        return;
      }
    }

    // place new item in edit mode
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
    <span class="placed-emoji" style="left: {p.x}%; top: {p.y}%; border-color: {getConditionColor(p.condition)};" aria-hidden="true">{emojiMap[p.icon] || p.icon}</span>
  {/each}

  {#if preview.visible && selectedIcon}
    <span class="preview-emoji" style="left: {preview.x}px; top: {preview.y}px;" aria-hidden="true">{emojiMap[selectedIcon] || selectedIcon}</span>
  {/if}


</div>    


<ItemDetails bind:item={selectedItem} {emojiMap} />

<style>
  .rectangle {
    width: 100%;
    height: 100%;
    background-image: url('https://www.spier.co.za/wp-content/uploads/2025/01/Spier-Food-Garden-aerial-06_EY-1-2.jpg');
    background-size: cover;
    background-position: center;
    border: none;
    position: relative;
    overflow: hidden;
    user-select: none;
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