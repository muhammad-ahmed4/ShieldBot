<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let context = 'registration';
  let email = '';
  let userId = '';
  let name = '';
  let loading = false;
  let message = '';
  let error = '';
  let emailSent = false;

  onMount(() => {
    // Get URL parameters
    context = $page.url.searchParams.get('context') || 'registration';
    email = $page.url.searchParams.get('email') || '';
    userId = $page.url.searchParams.get('userId') || '';
    name = $page.url.searchParams.get('name') || '';
    emailSent = $page.url.searchParams.get('sent') === 'true';
    
    if (emailSent) {
      message = context === 'password-change' 
        ? 'Password reset email sent successfully!'
        : 'Verification email sent successfully!';
    }
  });

  async function sendVerificationEmail() {
    if (!email) {
      error = 'Email address not found';
      return;
    }

    loading = true;
    error = '';
    message = '';

    try {
      // Use different endpoints based on context
      const endpoint = context === 'password-change' 
        ? '/api/auth/forgot-password' 
        : '/api/auth/send-verification';

      const requestBody = context === 'password-change' 
        ? { email }  // forgot-password only needs email
        : { userId, email, name, context };  // send-verification needs more data

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        message = data.message;
        emailSent = true;
      } else {
        error = data.error || 'Failed to send email';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
      console.error('Send email error:', err);
    } finally {
      loading = false;
    }
  }

  function goBack() {
    if (context === 'password-change') {
      goto('/');
    } else {
      goto('/register');
    }
  }
</script>

<svelte:head>
  <title>Check Your Email - ShieldAuth</title>
  <meta name="description" content="Please check your email to continue" />
</svelte:head>

<!-- Single Panel Responsive Layout -->
<div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <!-- Main Card -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
      <!-- Header with Icon -->
      <div class="text-center mb-8">
        <!-- Email Icon -->
        <div class="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
          <svg class="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        
        <h1 class="text-3xl font-bold text-slate-800 dark:text-white mb-3">
          {#if emailSent}
            Check Your Email
          {:else}
            Account Created Successfully!
          {/if}
        </h1>
        
        <p class="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          {#if emailSent}
            We've sent a verification link to your email address.
          {:else}
            Your account has been created! To complete your registration, please verify your email address.
          {/if}
        </p>
      </div>

      <!-- Email Display -->
      {#if email}
        <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <div>
              <p class="text-sm font-medium text-blue-800 dark:text-blue-200">
                {#if emailSent}
                  Email sent to:
                {:else}
                  Account created for:
                {/if}
              </p>
              <p class="text-sm text-blue-700 dark:text-blue-300 break-all">{email}</p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Success Message -->
      {#if message}
        <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p class="text-sm text-green-800 dark:text-green-200">{message}</p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Error Message -->
      {#if error}
        <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <div>
              <p class="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Action Buttons -->
      <div class="space-y-4">
        {#if !emailSent}
          <!-- Send Verification Email Button -->
          <button
            on:click={sendVerificationEmail}
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
              Get an email to verify
            {/if}
          </button>
        {/if}
        
        <!-- Back Button -->
        <button
          on:click={goBack}
          class="w-full flex justify-center items-center py-3 px-4 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Sign Up
        </button>
      </div>

      <!-- Help Text -->
      <div class="mt-8 text-center">
        <div class="flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {#if emailSent}
              Didn't receive the email? Check your spam folder or try again.
            {:else}
              Click the button above to receive your verification email.
            {/if}
          </span>
        </div>
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