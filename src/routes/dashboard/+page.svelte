<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { signOut } from '@auth/sveltekit/client';
	import { invalidateAll } from '$app/navigation';
	
	// Redirect if not authenticated
	$: if (!$page.data.user) {
		goto('/login');
	}
	
	let stats = {
		lastLogin: new Date().toLocaleDateString(),
		accountAge: '0 days',
		loginCount: 1
	};
	
	// Handle logout using Auth.js
	async function handleLogout() {
		try {
			// Use Auth.js signOut function
			await signOut({ redirectTo: '/' });
			
			// Invalidate all page data to refresh user state
			await invalidateAll();
		} catch (error) {
			console.error('Logout error:', error);
			// Fallback: force page reload if Auth.js logout fails
			window.location.href = '/';
		}
	}
	
	onMount(() => {
		// Calculate account age
		if ($page.data.user?.createdAt) {
			const created = new Date($page.data.user.createdAt);
			const now = new Date();
			const diffTime = Math.abs(now.getTime() - created.getTime());
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			stats.accountAge = `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
		}
	});
</script>

<svelte:head>
	<title>Dashboard - AuthApp</title>
	<meta name="description" content="Your personal dashboard" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Welcome Header -->
	<div class="mb-8">
		<div class="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
			<div class="flex items-center space-x-4">
				{#if $page.data.user?.image}
					<img src={$page.data.user.image} alt="Profile" class="w-16 h-16 rounded-full" />
				{:else}
					<div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
						{$page.data.user?.email?.charAt(0).toUpperCase()}
					</div>
				{/if}
				<div>
					<h1 class="text-3xl font-bold text-white">
						Welcome back, <span class="text-emerald-500">{$page.data.user?.name || $page.data.user?.email}</span>!
					</h1>
					<p class="text-slate-400 mt-1">
						Member since {$page.data.user?.createdAt ? new Date($page.data.user.createdAt).toLocaleDateString() : 'recently'}
					</p>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
		<div class="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center">
						<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-slate-400">Account Age</p>
					<p class="text-2xl font-semibold text-white">{stats.accountAge}</p>
				</div>
			</div>
		</div>
		
		<div class="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-indigo-900/30 rounded-lg flex items-center justify-center">
						<svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-slate-400">Last Login</p>
					<p class="text-2xl font-semibold text-white">{stats.lastLogin}</p>
				</div>
			</div>
		</div>
		
		<div class="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-green-900/30 rounded-lg flex items-center justify-center">
						<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-slate-400">Login Count</p>
					<p class="text-2xl font-semibold text-white">{stats.loginCount}</p>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Quick Actions -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
			<h3 class="text-lg font-semibold text-white mb-4">Quick Actions</h3>
			<div class="space-y-3">
				<a
					href="/profile"
					class="flex items-center p-3 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors"
				>
					<svg class="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
					<span class="text-slate-300">Edit Profile</span>
				</a>
				
				<!-- Only show Change Password for users with passwords (not OAuth users) -->
				{#if $page.data.user?.password}
					<a
						href="/change-password"
						class="flex items-center p-3 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors"
					>
						<svg class="w-5 h-5 text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
						</svg>
						<span class="text-slate-300">Change Password</span>
					</a>
				{/if}
				
				<button
					onclick={handleLogout}
					class="flex items-center w-full p-3 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors text-left"
				>
					<svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
					<span class="text-slate-300">Sign Out</span>
				</button>
			</div>
		</div>
		
		<div class="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
			<h3 class="text-lg font-semibold text-white mb-4">Account Security</h3>
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<span class="text-slate-400">Two-Factor Authentication</span>
					<span class="text-sky-400 text-sm font-medium">Not enabled</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-slate-400">Email Verification</span>
					<span class="text-green-400 text-sm font-medium">Verified</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-slate-400">Last Password Change</span>
					<span class="text-white text-sm">Never</span>
				</div>
			</div>
		</div>
	</div>
</div>
