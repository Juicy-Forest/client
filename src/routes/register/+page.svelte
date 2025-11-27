<script lang="ts">
    let firstName = '';
    let lastName = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let error = '';

    function submit() {
        error = '';
        if (password !== confirmPassword) {
            error = 'Passwords do not match';
            return;
        }

        // placeholder: wire this up to your registration logic
        console.log('register', { firstName, lastName, email, password });
    }
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
            <p class="text-gray-500 mt-2">Create your account</p>
        </div>

        <form on:submit|preventDefault={submit} class="bg-white rounded-xl shadow-lg p-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-800 mb-2">First name</label>
                    <input type="text" bind:value={firstName} placeholder="John" class="w-full bg-gray-100 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-800 mb-2">Last name</label>
                    <input type="text" bind:value={lastName} placeholder="Doe" class="w-full bg-gray-100 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
                </div>
            </div>

            <div class="mb-5">
                <label class="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                <input type="email" bind:value={email} placeholder="your.email@example.com" class="w-full bg-gray-100 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
            </div>

            <div class="mb-5">
                <label class="block text-sm font-semibold text-gray-800 mb-2">Password</label>
                <input type="password" bind:value={password} placeholder="••••••••" class="w-full bg-gray-100 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
            </div>

            <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-800 mb-2">Confirm password</label>
                <input type="password" bind:value={confirmPassword} placeholder="••••••••" class="w-full bg-gray-100 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
            </div>

            {#if error}
                <p class="text-red-600 text-sm mb-4">{error}</p>
            {/if}

            <button type="submit" class="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:opacity-95">Sign Up</button>

            <p class="text-center text-gray-500 mt-6">Already have an account? <a href="/login" class="text-emerald-600 font-semibold">Sign in</a></p>
        </form>
    </div>
</main>
