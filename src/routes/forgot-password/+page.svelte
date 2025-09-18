<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Input from '$lib/components/Input.svelte';
	
	let email = $state('');
	let error = $state('');
	let success = $state('');
	let isLoading = $state(false);
	
	// Redirect if already logged in
	$effect(() => {
		if ($page.data.user) {
			goto('/');
		}
	});
	
	// Handle form submission
	function handleSubmit() {
		if (isLoading) {
			console.log('Form submission already in progress, ignoring');
			return;
		}
		
		if (!email) {
			error = 'Please enter your email address';
			return;
		}
		
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			error = 'Please enter a valid email address';
			return;
		}
		
		console.log('Forgot password form submitted with email:', email);
		isLoading = true;
		
		return async ({ result, update }: { result: any; update: any }) => {
			console.log('Forgot password form result:', result);
			
			if (result.type === 'failure') {
				error = result.data?.error || 'Failed to send reset code';
				console.log('Form submission failed:', result.data);
				isLoading = false;
			} else if (result.type === 'success') {
				console.log('Form submission successful, redirecting to verification page');
				success = 'Password reset code sent! Redirecting to verification...';
				
				// Use redirectUrl from server response if available, otherwise construct it
				const redirectUrl = result.data?.redirectUrl || `/reset-password-code?email=${encodeURIComponent(email)}`;
				
				setTimeout(() => {
					console.log('Redirecting to:', redirectUrl);
					goto(redirectUrl);
				}, 2000);
			} else {
				console.log('Unexpected result type:', result.type);
				isLoading = false;
			}
			await update();
		};
	}
</script>

<svelte:head>
	<title>Forgot Password - ShieldAuth</title>
	<meta name="description" content="Reset your password" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<Card padding="lg">
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
					Forgot Password
				</h1>
				<p class="text-slate-600 dark:text-slate-400">
					Enter your email address and we'll send you a 6-digit code to reset your password.
				</p>
			</div>

			{#if error}
				<div class="mb-6 p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg">
					<p class="text-sky-600 dark:text-sky-400 text-sm">{error}</p>
				</div>
			{/if}

			{#if success}
				<div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
					<p class="text-green-600 dark:text-green-400 text-sm">{success}</p>
				</div>
			{/if}

			<form method="POST" use:enhance={handleSubmit} class="space-y-6">
				<input type="hidden" name="email" value={email} />
				<div>
					<Input
						type="email"
						label="Email Address"
						bind:value={email}
						placeholder="Enter your email address"
						required
						disabled={isLoading}
					/>
				</div>

				<Button
					type="submit"
					fullWidth={true}
					disabled={isLoading}
				>
					{isLoading ? 'Sending Code...' : 'Send Reset Code'}
				</Button>
			</form>

			<div class="mt-6 text-center">
				<p class="text-sm text-slate-600 dark:text-slate-400">
					Remember your password?
					<a href="/login" class="text-blue-600 dark:text-blue-400 hover:underline ml-1">
						Sign in
					</a>
				</p>
			</div>
		</Card>
	</div>
</div>
