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
	
	// Get current user's email
	$effect(() => {
		if ($page.data.user?.email) {
			email = $page.data.user.email;
		}
	});
	
	// Redirect if not logged in
	$effect(() => {
		if (!$page.data.user) {
			goto('/login');
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
		
		console.log('Change password form submitted with email:', email);
		isLoading = true;
		
		return async ({ result, update }: { result: any; update: any }) => {
			console.log('Change password form result:', result);
			
			if (result.type === 'failure') {
				error = result.data?.error || 'Failed to send verification code';
				console.log('Form submission failed:', result.data);
				isLoading = false;
			} else if (result.type === 'success') {
				console.log('Form submission successful, redirecting to verification page');
				success = 'Verification code sent! Redirecting to verification...';
				
				// Use redirectUrl from server response if available, otherwise construct it
				const redirectUrl = result.data?.redirectUrl || `/change-password-code?email=${encodeURIComponent(email)}`;
				
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
	<title>Change Password - ShieldAuth</title>
	<meta name="description" content="Change your password" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<Card padding="lg">
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
					Change Password
				</h1>
				<p class="text-slate-600 dark:text-slate-400">
					We'll send a 6-digit verification code to your email address to confirm the password change.
				</p>
			</div>

			{#if error}
				<div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
					<p class="text-red-600 dark:text-red-400 text-sm">{error}</p>
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
					{isLoading ? 'Sending Code...' : 'Send Verification Code'}
				</Button>
			</form>

			<div class="mt-6 text-center">
				<p class="text-sm text-slate-600 dark:text-slate-400">
					<a href="/" class="text-blue-600 dark:text-blue-400 hover:underline">
						← Back to Home
					</a>
				</p>
			</div>
		</Card>
	</div>
</div>
