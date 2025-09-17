<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let token = '';
  let password = '';
  let confirmPassword = '';
  let loading = false;
  let message = '';
  let error = '';

  onMount(() => {
    token = $page.url.searchParams.get('token') || '';
    if (!token) {
      error = 'No reset token provided';
    }
  });

  async function handleSubmit() {
    if (!token) {
      error = 'No reset token provided';
      return;
    }

    if (!password || !confirmPassword) {
      error = 'Please fill in all fields';
      return;
    }

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    if (password.length < 8) {
      error = 'Password must be at least 8 characters long';
      return;
    }

    loading = true;
    error = '';
    message = '';

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (data.success) {
        message = data.message;
        setTimeout(() => {
          goto('/login?reset=true');
        }, 3000);
      } else {
        error = data.error || 'Password reset failed';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
      console.error('Password reset error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Reset Password - ShieldAuth</title>
  <meta name="description" content="Reset your password" />
</svelte:head>

<!-- Single Panel Responsive Layout -->
<div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <!-- Main Card -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
      <!-- Header with Icon -->
      <div class="text-center mb-8">
        <!-- Key Icon -->
        <div class="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
          {#if message}
            <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          {:else}
            <svg class="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"></path>
            </svg>
          {/if}
        </div>
        
        <h1 class="text-3xl font-bold text-slate-800 dark:text-white mb-3">
          {message ? 'Password Reset Successfully!' : 'Reset Your Password'}
        </h1>
        
        <p class="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          {message 
            ? 'Your password has been updated successfully.' 
            : 'Enter your new password below.'}
        </p>
      </div>

      <!-- Success Message -->
      {#if message}
        <div class="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p class="text-green-800 dark:text-green-200 font-medium">{message}</p>
              <p class="text-green-700 dark:text-green-300 text-sm mt-1">Redirecting to login page...</p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Error Message -->
      {#if error}
        <div class="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <div>
              <p class="text-red-800 dark:text-red-200 font-medium">{error}</p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Form -->
      {#if !message && !error}
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <!-- New Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              New Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                bind:value={password}
                placeholder="Enter your new password"
                required
                disabled={loading}
                class="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Confirm New Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                id="confirmPassword"
                type="password"
                bind:value={confirmPassword}
                placeholder="Confirm your new password"
                required
                disabled={loading}
                class="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            class="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {#if loading}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting...
            {:else}
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"></path>
              </svg>
              Reset Password
            {/if}
          </button>
        </form>
      {/if}

      <!-- Action Buttons for Error State -->
      {#if error && !message}
        <div class="space-y-4">
          <button
            on:click={() => goto('/auth/forgot-password')}
            class="w-full flex justify-center items-center py-3 px-4 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Request New Reset Link
          </button>
        </div>
      {/if}

      <!-- Footer Links -->
      <div class="mt-8 text-center">
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Remember your password?
          <a href="/login" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors ml-1">
            Back to Login
          </a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center mt-6">
      <a href="/" class="text-2xl font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        ShieldAuth
      </a>
    </div>
  </div>
</div>