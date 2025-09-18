<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Input from '$lib/components/Input.svelte';
	
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let success = $state('');
	let isLoading = $state(false);
	
	// Get email and code from URL params
	const email = $page.url.searchParams.get('email') || '';
	const code = $page.url.searchParams.get('code') || '';
	
	// Redirect if no email or code
	$effect(() => {
		if (!email || !code) {
			goto('/change-password');
		}
	});
	
	// Client-side password validation
	$effect(() => {
		if (password && confirmPassword && password !== confirmPassword) {
			error = 'Passwords do not match';
		} else if (password && password.length < 8) {
			error = 'Password must be at least 8 characters long';
		} else {
			error = '';
		}
	});
	
	// Handle form submission
	function handleSubmit() {
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
		
		return async ({ result, update }: { result: any; update: any }) => {
			if (result.type === 'failure') {
				error = result.data?.error || 'Failed to change password';
			} else if (result.type === 'success') {
				success = 'Password changed successfully! All sessions have been invalidated. Redirecting to login...';
				setTimeout(() => {
					goto('/login');
				}, 3000);
			}
			await update();
		};
	}
</script>

<svelte:head>
	<title>New Password - ShieldAuth</title>
	<meta name="description" content="Set your new password" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<Card padding="lg">
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
					New Password
				</h1>
				<p class="text-slate-600 dark:text-slate-400">
					Enter your new password for <strong>{email}</strong>
				</p>
			</div>

			{#if error}
<<<<<<< HEAD
				<div class="mb-6 p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg">
					<p class="text-sky-600 dark:text-sky-400 text-sm">{error}</p>
=======
				<div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
					<p class="text-red-600 dark:text-red-400 text-sm">{error}</p>
>>>>>>> 4ab6d2b01e60bcee7535a1a381e212be16fa1049
				</div>
			{/if}

			{#if success}
				<div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
					<p class="text-green-600 dark:text-green-400 text-sm">{success}</p>
				</div>
			{/if}

			<form method="POST" use:enhance={handleSubmit} class="space-y-6">
				<input type="hidden" name="email" value={email} />
				<input type="hidden" name="code" value={code} />
				<input type="hidden" name="password" value={password} />
				<input type="hidden" name="confirmPassword" value={confirmPassword} />
				
				<div>
					<Input
						type="password"
						label="New Password"
						bind:value={password}
						placeholder="Enter your new password"
						required
						disabled={isLoading}
					/>
				</div>

				<div>
					<Input
						type="password"
						label="Confirm New Password"
						bind:value={confirmPassword}
						placeholder="Confirm your new password"
						required
						disabled={isLoading}
					/>
				</div>

				<Button
					type="submit"
					fullWidth={true}
					disabled={isLoading || !!error}
				>
					{isLoading ? 'Changing Password...' : 'Change Password'}
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
