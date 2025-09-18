<script lang="ts">
  import { goto } from '$app/navigation';

  let email = '';
  let loading = false;
  let message = '';
  let error = '';

  async function handleSubmit() {
    if (!email) {
      error = 'Please enter your email address';
      return;
    }

    loading = true;
    error = '';
    message = '';

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        message = data.message;
      } else {
        error = data.error || 'Failed to send reset email';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
      console.error('Forgot password error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Forgot Password - ShieldAuth</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
    <div class="text-center">
      <div class="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
        <svg class="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
        </svg>
      </div>
      
      <h1 class="text-3xl font-bold text-slate-800 dark:text-white mb-3">
        Forgot Password?
      </h1>
      
      <p class="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
        Enter your email address and we'll send you a link to reset your password.
      </p>
    </div>

    {#if message}
      <div class="mt-8 mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div class="flex">
          <svg class="h-5 w-5 text-green-400 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div class="ml-3">
            <p class="text-sm text-green-700 dark:text-green-200">{message}</p>
          </div>
        </div>
      </div>
    {:else}
      <form on:submit|preventDefault={handleSubmit} class="space-y-4 mt-8">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            placeholder="Enter your email address"
            required
            disabled={loading}
            class="block w-full pl-4 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
          />
        </div>

        {#if error}
          <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="ml-3">
                <p class="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        {/if}

        <button
          type="submit"
          disabled={loading || !email}
          class="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {#if loading}
            <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          {:else}
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Reset Link
          {/if}
        </button>
      </form>
    {/if}

    <div class="mt-8 text-center">
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Remember your password?
        <a href="/login" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
          Sign in
        </a>
      </p>
    </div>
    </div>
  </div>
</div>
