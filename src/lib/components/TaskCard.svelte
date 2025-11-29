<script>

  export let color; 
  export let initials;
  export let title;
  export let assigned;
  export let completed;
  export let total;
</script>

<div class="flex items-center space-x-4">

  <div class="rounded-full flex items-center justify-center w-14 h-14 text-white text-xl font-semibold {color}">
    {initials}
  </div>
  
  <div class="flex flex-col">
    <div class="text-lg font-semibold">{title}</div>
    <div class="text-gray-500">Assigned to {assigned}</div>
    <div class="text-gray-500 mt-1">{completed} of {total} tasks completed ({Math.round((completed/total)*100)}%)</div>
  </div>
</div>
