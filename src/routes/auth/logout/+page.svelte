<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	onMount(async () => {
		try {
			// Call the logout endpoint
			const response = await fetch('/auth/signout', {
				method: 'POST',
			});
			
			if (response.ok) {
				// Redirect to home page after successful logout
				goto('/');
			} else {
				// If logout fails, still redirect to home
				goto('/');
			}
		} catch (error) {
			// If there's an error, redirect to home
			goto('/');
		}
	});
</script>

<svelte:head>
	<title>Logging out - AuthApp</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full text-center space-y-8">
		<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
			<div class="animate-spin w-12 h-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full mx-auto mb-6"></div>
			<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">
				Signing you out...
			</h2>
			<p class="text-slate-600 dark:text-slate-400">
				Please wait while we securely log you out of your account.
			</p>
		</div>
	</div>
</div>
