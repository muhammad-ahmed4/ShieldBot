<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Form state
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let isLoading = false;
	let error = '';
	let success = '';

	// Redirect if not authenticated
	$: if (!$page.data.user) {
		goto('/login');
	}

	// Handle form submission
	async function handleSubmit() {
		error = '';
		success = '';

		// Validation
		if (!currentPassword || !newPassword || !confirmPassword) {
			error = 'All fields are required';
			return;
		}

		if (newPassword.length < 8) {
			error = 'New password must be at least 8 characters long';
			return;
		}

		if (newPassword !== confirmPassword) {
			error = 'New passwords do not match';
			return;
		}

		if (currentPassword === newPassword) {
			error = 'New password must be different from current password';
			return;
		}

		isLoading = true;

		try {
			const response = await fetch('/api/auth/change-password', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					currentPassword,
					newPassword,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				success = data.message;
				// Clear form
				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
			} else {
				error = data.error || 'Failed to change password';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
			console.error('Password change error:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Change Password - AuthApp</title>
	<meta name="description" content="Change your account password" />
</svelte:head>

<div class="h-auto bg-slate-900 flex flex-col justify-center py-8 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<div class="text-center">
			<h2 class="text-2xl font-bold text-white">Change Password</h2>
			<p class="mt-1 text-sm text-slate-400">
				Update your account password
			</p>
		</div>
	</div>

	<div class="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
		<div class="bg-slate-800 py-4 px-4 shadow-xl sm:rounded-lg sm:px-6 border border-slate-700">
			<form on:submit|preventDefault={handleSubmit} class="space-y-3">
				<!-- Current Password -->
				<div>
					<label for="currentPassword" class="block text-sm font-medium text-slate-300">
						Current Password
					</label>
					<div class="mt-1">
						<input
							id="currentPassword"
							name="currentPassword"
							type="password"
							required
							bind:value={currentPassword}
							class="appearance-none block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 bg-slate-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
							placeholder="Enter your current password"
						/>
					</div>
				</div>

				<!-- New Password -->
				<div>
					<label for="newPassword" class="block text-sm font-medium text-slate-300">
						New Password
					</label>
					<div class="mt-1">
						<input
							id="newPassword"
							name="newPassword"
							type="password"
							required
							bind:value={newPassword}
							class="appearance-none block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 bg-slate-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
							placeholder="Enter your new password"
						/>
					</div>
					<p class="mt-1 text-xs text-slate-400">
						At least 8 characters
					</p>
				</div>

				<!-- Confirm New Password -->
				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-slate-300">
						Confirm New Password
					</label>
					<div class="mt-1">
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							required
							bind:value={confirmPassword}
							class="appearance-none block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 bg-slate-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
							placeholder="Confirm your new password"
						/>
					</div>
				</div>

				<!-- Error Message -->
				{#if error}
					<div class="rounded-md bg-red-900/20 border border-red-500/50 p-3">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm text-red-300">{error}</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Success Message -->
				{#if success}
					<div class="rounded-md bg-green-900/20 border border-green-500/50 p-3">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm text-green-300">{success}</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Submit Button -->
				<div>
					<button
						type="submit"
						disabled={isLoading}
						class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
					>
						{#if isLoading}
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Changing Password...
						{:else}
							Change Password
						{/if}
					</button>
				</div>
			</form>

			<!-- Back to Dashboard -->
			<div class="mt-3 text-center">
				<a
					href="/dashboard"
					class="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
				>
					← Back to Dashboard
				</a>
			</div>
		</div>
	</div>
</div>
