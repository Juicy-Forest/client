<script lang="ts">
  export let item: { icon: string; x: number; y: number; id: number } | null = null;
  export let emojiMap: Record<string, string>;

  const itemNames: Record<string, string> = {
    water: 'Water Source',
    plant: 'Young Plant',
    plants: 'Plant Group',
    bush: 'Bush',
    tree: 'Tree'
  };

  const itemDescriptions: Record<string, string> = {
    water: 'Essential water source for irrigation',
    plant: 'Single young seedling ready to grow',
    plants: 'Group of plants in the garden area',
    bush: 'Mature bush providing coverage',
    tree: 'Large tree offering shade and fruit'
  };

  function close() {
    item = null;
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      close();
    }
  }

  function handleBackdropKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close();
    }
  }
</script>

{#if item}
  <div 
    class="modal-backdrop" 
    on:click={handleBackdropClick}
    on:keydown={handleBackdropKeyDown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="modal-content">
      <button class="close-btn" on:click={close} aria-label="Close details">
        ✕
      </button>
      <div class="item-display">
        <span class="item-emoji">{emojiMap[item.icon] || item.icon}</span>
        <h2 class="item-name">{itemNames[item.icon] || item.icon}</h2>
      </div>
      <p class="item-description">
        {itemDescriptions[item.icon] || 'Item information'}
      </p>
      <div class="item-stats">
        <div class="stat">
          <span class="stat-label">Position</span>
          <span class="stat-value">{Math.round(item.x)}, {Math.round(item.y)}</span>
        </div>
        <div class="stat">
          <span class="stat-label">ID</span>
          <span class="stat-value">{item.id}</span>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 16px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
    border: 2px solid #b45309;
  }

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #92400e;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 150ms ease;
  }

  .close-btn:hover {
    background: #fef3c7;
  }

  .item-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .item-emoji {
    font-size: 64px;
    line-height: 1;
  }

  .item-name {
    font-size: 24px;
    font-weight: bold;
    color: #92400e;
    margin: 0;
  }

  .item-description {
    color: #92400e;
    text-align: center;
    margin: 0 0 20px 0;
    line-height: 1.5;
    font-size: 14px;
  }

  .item-stats {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 16px;
    border-top: 2px solid #fef3c7;
  }

  .stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-label {
    color: #b45309;
    font-weight: 600;
    font-size: 13px;
  }

  .stat-value {
    color: #92400e;
    font-family: monospace;
    font-size: 13px;
  }
</style>
