<script>
    export let checked = false;
    export let label = '';
    export let onChange = () => {};
</script>

<label class="flex items-center space-x-2 cursor-pointer">
    
    <input type="checkbox"
        class="form-checkbox h-5 w-5 text-green-600"
        bind:checked
        onchange={onChange} />
    <span>{label}</span>

</label>
