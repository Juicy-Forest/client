<script lang="ts">
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';

    let email = '';
    let password = '';
    let error = '';
    let success = '';
</script>

<main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 px-4">
    <div class="w-full max-w-lg">
        <div class="flex flex-col items-center mb-6">
            <div class="bg-emerald-600 rounded-full w-20 h-20 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 text-white" fill="none" stroke="white" stroke-width="1.5">
                    <path d="M12 20v-6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 9c1.5-2 4-3 5-3s3.5 1 5 3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 13c1.5 2 4 3 5 3s3.5-1 5-3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h1 class="mt-4 text-2xl font-medium text-gray-800">Juicy Forest</h1>
            <p class="text-gray-500 mt-2">Manage your garden with ease</p>
        </div>

        <form method="POST" action="?/login" use:enhance={() => {
            return async ({ update, result }) => {
                if (result.type === 'success') {
                    success = result.data?.message as string;
                    setTimeout(() => goto('/'), 2000);
                } else if (result.type === 'failure') {
                    error = result.data?.error as string;
                }
                update();
            };
        }} class="bg-white rounded-xl shadow-lg p-8">
            <div class="mb-5">
                <label for="email" class="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                <input id="email" type="email" name="email" bind:value={email} placeholder="your.email@example.com" class="w-full bg-gray-100 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
            </div>

            <div class="mb-6">
                <label for="password" class="block text-sm font-semibold text-gray-800 mb-2">Password</label>
                <input id="password" type="password" name="password" bind:value={password} placeholder="••••••••" class="w-full bg-gray-100 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
            </div>

            {#if error}
                <p class="text-red-600 text-sm mb-4">{error}</p>
            {/if}

            {#if success}
                <p class="text-green-600 text-sm mb-4">{success}</p>
            {/if}

            <button type="submit" class="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:opacity-95">Sign In</button>

            <p class="text-center text-gray-500 mt-6">Don't have an account? <button type="button" on:click={() => goto('/register')} class="text-emerald-600 font-semibold bg-transparent border-none cursor-pointer hover:underline">Sign up</button></p>
        </form>
    </div>
</main>
