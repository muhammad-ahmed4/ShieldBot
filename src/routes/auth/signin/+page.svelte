<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	onMount(() => {
		// Redirect to custom login page immediately
		const callbackUrl = $page.url.searchParams.get('callbackUrl') || '/';
		goto(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, { replaceState: true });
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
	<div class="text-center">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Redirecting to sign in...</h2>
		<p class="text-gray-600 dark:text-gray-400">Please wait while we redirect you to our sign-in page.</p>
	</div>
</div>
