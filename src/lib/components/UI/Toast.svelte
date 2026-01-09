<script lang="ts">
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  interface Props {
    show: boolean;
    title: string;
    message: string;
    type?: 'success' | 'info' | 'warning' | 'error';
  }

  let { show = $bindable(false), title, message, type = 'success' }: Props = $props();

  const typeConfig = {
    success: {
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      titleColor: 'text-emerald-900',
      messageColor: 'text-emerald-600',
      icon: 'fa-check'
    },
    info: {
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      titleColor: 'text-sky-900',
      messageColor: 'text-sky-600',
      icon: 'fa-info'
    },
    warning: {
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-900',
      messageColor: 'text-amber-600',
      icon: 'fa-exclamation'
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      messageColor: 'text-red-600',
      icon: 'fa-xmark'
    }
  };

  const config = $derived(typeConfig[type]);
</script>

{#if show}
  <div 
    class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
    transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
  >
    <div class={`flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-lg backdrop-blur-xl ${config.bgColor} ${config.borderColor}`}>
      <div class={`flex h-8 w-8 items-center justify-center rounded-full ${config.iconBg} ${config.iconColor}`}>
        <i class={`fa-solid ${config.icon} text-sm`}></i>
      </div>
      <div>
        <p class={`text-sm font-semibold ${config.titleColor}`}>{title}</p>
        <p class={`text-xs ${config.messageColor}`}>{message}</p>
      </div>
    </div>
  </div>
{/if}

