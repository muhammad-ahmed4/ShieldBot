<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let loading = false;
  let message = '';
  let error = '';
  let token = '';

  onMount(() => {
    token = $page.url.searchParams.get('token') || '';
    if (token) {
      verifyEmail();
    } else {
      error = 'No verification token provided';
    }
  });

  async function verifyEmail() {
    if (!token) return;
    
    loading = true;
    error = '';
    message = '';

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        message = data.message;
        // Show success and redirect to appropriate page
        setTimeout(() => {
          const context = $page.url.searchParams.get('context') || 'registration';
          if (context === 'password-change') {
            goto('/auth/reset-password?token=' + token);
          } else {
            goto('/login?verified=true');
          }
        }, 2000);
      } else {
        error = data.error || 'Verification failed';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
      console.error('Verification error:', err);
    } finally {
      loading = false;
    }
  }

  async function resendVerification() {
    loading = true;
    error = '';
    message = '';

    try {
      const email = prompt('Please enter your email address:');
      if (!email) {
        loading = false;
        return;
      }

      const response = await fetch('/api/auth/resend-verification', {
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
        error = data.error || 'Failed to resend verification email';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
      console.error('Resend verification error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Verify Email - ShieldAuth</title>
  <meta name="description" content="Email verification" />
</svelte:head>

<!-- Single Panel Responsive Layout with 2cm spacing -->
<div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center" style="padding: 2cm;">
  <div class="w-full max-w-md">
    <!-- Main Content without white rectangle -->
    <div class="text-center">
      <!-- Header with Icon -->
      <div class="mb-8">
        <!-- Status Icon -->
        <div class="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
          {#if loading}
            <svg class="animate-spin w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          {:else if message}
            <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          {:else if error}
            <svg class="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          {:else}
            <svg class="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          {/if}
        </div>
        
        <h1 class="text-3xl font-bold text-slate-800 dark:text-white mb-3">
          {#if loading}
            Verifying Email...
          {:else if message}
            Email Verified!
          {:else if error}
            Verification Failed
          {:else}
            Email Verification
          {/if}
        </h1>
        
        <p class="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          {#if loading}
            Please wait while we verify your email address...
          {:else if message}
            Your email has been successfully verified!
          {:else if error}
            We couldn't verify your email address.
          {:else}
            Click the verification link in your email to continue.
          {/if}
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
              <p class="text-red-700 dark:text-red-300 text-sm mt-1">
                The verification link may have expired or is invalid.
              </p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Action Buttons -->
      {#if error}
        <div class="space-y-4">
          <button
            on:click={resendVerification}
            disabled={loading}
            class="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {#if loading}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            {:else}
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Resend Verification Email
            {/if}
          </button>
          
          <button
            on:click={() => goto('/login')}
            class="w-full flex justify-center items-center py-3 px-4 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </button>
        </div>
      {/if}

      <!-- Help Text -->
      <div class="mt-8 text-center">
        <div class="flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {#if loading}
              This may take a few moments...
            {:else if message}
              You will be redirected automatically.
            {:else if error}
              Contact support if you continue to have issues.
            {:else}
              Check your email for the verification link.
            {/if}
          </span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center mt-8">
      <a href="/" class="text-2xl font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        ShieldAuth
      </a>
    </div>
  </div>
</div>