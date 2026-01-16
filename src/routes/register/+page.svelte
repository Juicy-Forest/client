<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';

    let username = $state('');
    let email = $state('');
    let password = $state('');
    let confirmPassword = $state('');
    let error = $state('');

    function submit() {
        error = '';
        if (password !== confirmPassword) {
            error = 'Passwords do not match';
            return;
        }
    }
</script>

<main class="min-h-screen flex items-center justify-center bg-[#fdfcf8] px-4">
    <div class="w-full max-w-lg">
        <div class="flex flex-col items-center mb-8">
            <div class="bg-lime-600 rounded-2xl w-20 h-20 flex items-center justify-center shadow-lg">
                <i class="fa-solid fa-seedling text-white text-4xl"></i>
            </div>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-stone-800">Juicy Forest</h1>
            <p class="text-stone-500 mt-2 text-sm">Create your account</p>
        </div>

        <form method="POST" action="?/register" use:enhance={() => {
            submit();
            return async ({ update, result }) => {
                if (result.type === 'failure') {
                    error = result.data?.error as string;
                }
                update();
            };
        }} class="bg-white/80 backdrop-blur-xl rounded-2xl border border-stone-200/60 shadow-xl shadow-stone-200/20 p-8">
            <h2 class="text-xl font-bold text-stone-800 mb-6">Get started</h2>
            
            <div class="mb-5">
                <label for="username" class="block text-sm font-semibold text-stone-700 mb-2">Username</label>
                <input id="username" type="text" name="username" bind:value={username} placeholder="johndoe" class="w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20" required />
            </div>

            <div class="mb-5">
                <label for="email" class="block text-sm font-semibold text-stone-700 mb-2">Email</label>
                <input id="email" type="email" name="email" bind:value={email} placeholder="your.email@example.com" class="w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20" required />
            </div>

            <div class="mb-5">
                <label for="password" class="block text-sm font-semibold text-stone-700 mb-2">Password</label>
                <input id="password" type="password" name="password" bind:value={password} placeholder="••••••••" class="w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20" required />
            </div>

            <div class="mb-6">
                <label for="confirmPassword" class="block text-sm font-semibold text-stone-700 mb-2">Confirm password</label>
                <input id="confirmPassword" type="password" bind:value={confirmPassword} placeholder="••••••••" class="w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20" required />
            </div>

            {#if error}
                <div class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">
                    <i class="fa-solid fa-circle-exclamation mr-1.5"></i>
                    {error}
                </div>
            {/if}

            <button type="submit" class="w-full bg-lime-600 text-white py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all hover:bg-lime-700 hover:shadow-md">Sign Up</button>

            <p class="text-center text-stone-500 text-sm mt-6">Already have an account? <button type="button" onclick={() => goto('/login')} class="text-lime-600 font-semibold bg-transparent border-none cursor-pointer hover:text-lime-700 transition-colors">Sign in</button></p>
        </form>
    </div>
</main>
