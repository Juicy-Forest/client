<script lang="ts">
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import Avatar from "./Avatar.svelte";

  let { message, isSelf, isRepeated } = $props();
  $inspect(message);

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
</script>

<article
  class={`group flex gap-5 ${isSelf ? "flex-row-reverse" : ""} ${isRepeated ? "mt-1" : "mt-5"}`}
  in:fly={{ y: 20, duration: 300, easing: cubicOut }}
>
  <!-- Avatar - Hidden for repeated messages but keeps spacing -->
  <Avatar author={message.author.username} {isRepeated} />

  <div class={`flex max-w-[85%] flex-1 flex-col ${isSelf ? "items-end" : ""}`}>
    {#if !isRepeated}
      <header
        class={`flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm ${isSelf ? "flex-row-reverse" : ""}`}
      >
        <p class={`font-bold ${message.author.color}`}>
          {message.author.username}
        </p>
        <span class="text-xs text-stone-400"
          >{formatTime(message.timestamp)}</span
        >
      </header>
    {/if}

    <div
      class={`inline-block rounded-2xl border px-6 py-3.5 text-[15px] w-fit max-w-1/3 break-all text-wrap leading-relaxed shadow-sm
        ${isRepeated ? "mt-0.5" : "mt-2"}
        ${
          isSelf
            ? `border-lime-200 bg-lime-50 text-stone-800 ring-1 ring-lime-900/5 ${isRepeated ? "rounded-r-md" : "rounded-tr-sm"}`
            : `border-stone-100 bg-white text-stone-700 ring-1 ring-stone-900/5 ${isRepeated ? "rounded-l-md" : "rounded-tl-sm"}`
        }`}
    >
      {message.content}
    </div>
  </div>
</article>
