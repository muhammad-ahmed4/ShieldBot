<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { signOut } from '@auth/sveltekit/client';
	import { invalidateAll } from '$app/navigation';
	import NotificationContainer from '$lib/components/NotificationContainer.svelte';
	
	// User dropdown state
	let showUserDropdown = false;
	
	// Toggle user dropdown
	function toggleUserDropdown() {
		showUserDropdown = !showUserDropdown;
	}
	
	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.user-dropdown')) {
			showUserDropdown = false;
		}
	}
	
	// Handle logout using Auth.js
	async function handleLogout() {
		try {
			// Close dropdown first
			showUserDropdown = false;
			
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
		// Always apply dark mode
		if (typeof document !== 'undefined') {
			document.documentElement.classList.add('dark');
		}
		
		// Add click outside listener
		document.addEventListener('click', handleClickOutside);
		
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<svelte:head>
	<title>ShieldAuth - Secure Authentication</title>
	<meta name="description" content="A secure authentication application built with SvelteKit" />
</svelte:head>

<div class="min-h-screen bg-slate-900">
	<!-- Navigation - Hidden on auth pages -->
	{#if !$page.url.pathname.startsWith('/auth') && $page.url.pathname !== '/login' && $page.url.pathname !== '/register' && !$page.url.pathname.startsWith('/checks')}
	<nav class="{($page.url.pathname === '/') ? 'absolute inset-x-0 top-0 z-30 bg-transparent border-transparent' : 'bg-slate-800 shadow-sm border-b border-slate-700'}">
		<div class="w-full px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16 w-full">
				<!-- Left side - Logo -->
				<div class="flex items-center">
<<<<<<< HEAD
					<a href="/" class="font-bold transition-all duration-200 relative group {($page.url.pathname === '/') ? 'text-white text-3xl md:text-4xl hover:text-sky-400' : 'text-white hover:text-sky-400 text-2xl'}">
						ShieldAuth
						<span class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full {($page.url.pathname === '/') ? 'bg-sky-400' : 'bg-sky-400'}"></span>
=======
					<a href="/" class="font-bold transition-all duration-200 relative group {($page.url.pathname === '/') ? 'text-white text-3xl md:text-4xl hover:text-red-400' : 'text-blue-400 hover:text-red-400 text-2xl'}">
						ShieldAuth
						<span class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full {($page.url.pathname === '/') ? 'bg-red-400' : 'bg-red-400'}"></span>
>>>>>>> 4ab6d2b01e60bcee7535a1a381e212be16fa1049
					</a>
				</div>
				
				<!-- Right side - Navigation Links or User menu -->
				<div class="flex items-center space-x-8">
					<!-- Navigation Links for all users -->
					<div class="hidden md:flex items-center space-x-8">
<<<<<<< HEAD
						<a href="/about" class="transition-all duration-200 {($page.url.pathname === '/') ? 'text-white text-lg md:text-xl font-semibold hover:text-sky-400 hover:underline underline-offset-4 decoration-sky-400' : ($page.url.pathname === '/about') ? 'text-blue-400 text-lg font-semibold' : 'text-slate-300 hover:text-sky-400 hover:underline underline-offset-4 decoration-sky-400 text-lg font-semibold'}">
							About
						</a>
						<a href="/contact" class="transition-all duration-200 {($page.url.pathname === '/') ? 'text-white text-lg md:text-xl font-semibold hover:text-sky-400 hover:underline underline-offset-4 decoration-sky-400' : ($page.url.pathname === '/contact') ? 'text-blue-400 text-lg font-semibold' : 'text-slate-300 hover:text-sky-400 hover:underline underline-offset-4 decoration-sky-400 text-lg font-semibold'}">
							Contact
						</a>
						{#if $page.url.pathname !== '/'}
							<a href="/chatbot" class="transition-all duration-200 {($page.url.pathname === '/chatbot') ? 'text-blue-400 text-lg font-semibold flex items-center space-x-1' : 'text-slate-300 hover:text-sky-400 hover:underline underline-offset-4 decoration-sky-400 text-lg font-semibold flex items-center space-x-1'}">
								<span>ShieldBot</span>
								<span class="w-2 h-2 {($page.url.pathname === '/chatbot') ? 'bg-blue-400' : 'bg-blue-500'} rounded-full {($page.url.pathname === '/chatbot') ? '' : 'animate-pulse'}"></span>
=======
						<a href="/about" class="transition-all duration-200 {($page.url.pathname === '/') ? 'text-white text-lg md:text-xl font-semibold hover:text-red-400 hover:underline underline-offset-4 decoration-red-400' : 'text-slate-300 hover:text-red-400 hover:underline underline-offset-4 decoration-red-400 text-lg font-semibold'}">
							About
						</a>
						<a href="/contact" class="transition-all duration-200 {($page.url.pathname === '/') ? 'text-white text-lg md:text-xl font-semibold hover:text-red-400 hover:underline underline-offset-4 decoration-red-400' : 'text-slate-300 hover:text-red-400 hover:underline underline-offset-4 decoration-red-400 text-lg font-semibold'}">
							Contact
						</a>
						{#if $page.url.pathname !== '/'}
							<a href="/chatbot" class="transition-all duration-200 text-slate-300 hover:text-emerald-500 hover:underline underline-offset-4 decoration-emerald-500 text-lg font-semibold flex items-center space-x-1">
								<span>ShieldBot</span>
								<span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
>>>>>>> 4ab6d2b01e60bcee7535a1a381e212be16fa1049
							</a>
						{/if}
					</div>
					
					{#if !$page.data.user}
						<!-- Authentication Links for non-authenticated users -->
						<div class="hidden md:flex items-center space-x-8">
<<<<<<< HEAD
							<a href="/login" class="transition-all duration-200 {($page.url.pathname === '/') ? 'text-white text-lg md:text-xl font-semibold hover:text-sky-400 hover:underline underline-offset-4 decoration-sky-400' : 'px-4 py-2 rounded-lg text-sm font-medium border border-blue-600 text-blue-300 bg-slate-800 hover:bg-slate-700'}">
								Login
							</a>
							<a href="/register" class="transition-all duration-200 {($page.url.pathname === '/') ? 'text-white text-lg md:text-xl font-semibold hover:text-sky-400 hover:underline underline-offset-4 decoration-sky-400' : 'px-4 py-2 font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white'}">
=======
							<a href="/login" class="transition-all duration-200 {($page.url.pathname === '/') ? 'text-white text-lg md:text-xl font-semibold hover:text-red-400 hover:underline underline-offset-4 decoration-red-400' : 'px-4 py-2 rounded-lg text-sm font-medium border border-blue-600 text-blue-300 bg-slate-800 hover:bg-slate-700'}">
								Login
							</a>
							<a href="/register" class="transition-all duration-200 {($page.url.pathname === '/') ? 'text-white text-lg md:text-xl font-semibold hover:text-red-400 hover:underline underline-offset-4 decoration-red-400' : 'px-4 py-2 font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white'}">
>>>>>>> 4ab6d2b01e60bcee7535a1a381e212be16fa1049
								Register
							</a>
						</div>
					{:else}
						<!-- User menu for authenticated users -->
						<div class="relative user-dropdown">
							<button
								on:click={toggleUserDropdown}
								class="flex items-center space-x-2 p-2 rounded-lg transition-colors {($page.url.pathname === '/') ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
								aria-label="User menu"
							>
								{#if $page.data.user.image}
									<img src={$page.data.user.image} alt="Profile" class="w-6 h-6 rounded-full" />
								{:else}
									<div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium {($page.url.pathname === '/') ? 'bg-white/30' : 'bg-blue-500'}">
										{$page.data.user.email?.charAt(0).toUpperCase()}
									</div>
								{/if}
<<<<<<< HEAD
								<span class="hidden sm:block hover:text-sky-400 transition-colors duration-200">{$page.data.user.email}</span>
=======
								<span class="hidden sm:block hover:text-red-400 transition-colors duration-200">{$page.data.user.email}</span>
>>>>>>> 4ab6d2b01e60bcee7535a1a381e212be16fa1049
								<svg class="w-4 h-4 transition-transform duration-200" class:rotate-180={showUserDropdown} fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</button>
							
							<!-- Dropdown menu -->
							{#if showUserDropdown}
								<div class="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-1 z-50">
									<div class="px-4 py-2 border-b border-slate-700">
										<p class="text-sm font-medium text-white">{$page.data.user.name || 'User'}</p>
										<p class="text-xs text-slate-400 break-all">{$page.data.user.email}</p>
									</div>
									<a
										href="/dashboard"
										on:click={() => { if ($page.url.pathname === '/dashboard') { window.location.reload(); } }}
<<<<<<< HEAD
										class="flex items-center px-4 py-2 text-sm transition-all duration-200 relative group {($page.url.pathname === '/dashboard') ? 'text-slate-500 cursor-default opacity-50' : 'text-slate-300 hover:bg-slate-700 hover:text-sky-400'}"
=======
										class="flex items-center px-4 py-2 text-sm transition-all duration-200 relative group {($page.url.pathname === '/dashboard') ? 'text-slate-500 cursor-default opacity-50' : 'text-slate-300 hover:bg-slate-700 hover:text-red-400'}"
>>>>>>> 4ab6d2b01e60bcee7535a1a381e212be16fa1049
									>
										<svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
										</svg>
										Dashboard
										{#if $page.url.pathname !== '/dashboard'}
											<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-300 transition-all duration-200 group-hover:w-full"></span>
										{/if}
									</a>
									<a
										href="/profile"
										on:click={() => { if ($page.url.pathname === '/profile') { window.location.reload(); } }}
<<<<<<< HEAD
										class="flex items-center px-4 py-2 text-sm transition-all duration-200 relative group {($page.url.pathname === '/profile') ? 'text-slate-500 cursor-default opacity-50' : 'text-slate-300 hover:bg-slate-700 hover:text-sky-400'}"
=======
										class="flex items-center px-4 py-2 text-sm transition-all duration-200 relative group {($page.url.pathname === '/profile') ? 'text-slate-500 cursor-default opacity-50' : 'text-slate-300 hover:bg-slate-700 hover:text-red-400'}"
>>>>>>> 4ab6d2b01e60bcee7535a1a381e212be16fa1049
									>
										<svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
										Profile
										{#if $page.url.pathname !== '/profile'}
											<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-300 transition-all duration-200 group-hover:w-full"></span>
										{/if}
									</a>
									{#if $page.data.user.role === 'admin'}
										<a
											href="/admin"
											on:click={() => { if ($page.url.pathname === '/admin') { window.location.reload(); } }}
<<<<<<< HEAD
											class="flex items-center px-4 py-2 text-sm transition-all duration-200 relative group {($page.url.pathname.startsWith('/admin')) ? 'text-slate-500 cursor-default opacity-50' : 'text-slate-300 hover:bg-slate-700 hover:text-sky-400'}"
=======
											class="flex items-center px-4 py-2 text-sm transition-all duration-200 relative group {($page.url.pathname.startsWith('/admin')) ? 'text-slate-500 cursor-default opacity-50' : 'text-slate-300 hover:bg-slate-700 hover:text-red-400'}"
>>>>>>> 4ab6d2b01e60bcee7535a1a381e212be16fa1049
										>
											<svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
											</svg>
											Admin Dashboard
											{#if !$page.url.pathname.startsWith('/admin')}
												<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-300 transition-all duration-200 group-hover:w-full"></span>
											{/if}
										</a>
									{/if}
									<div class="border-t border-slate-700 my-1"></div>
									<button
										on:click={handleLogout}
										class="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-white transition-all duration-200 relative group"
									>
										<svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
										</svg>
										Sign Out
										<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-red-400 transition-all duration-200 group-hover:w-full"></span>
									</button>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</nav>
	{/if}
	
	<!-- Main content -->
	<main class="flex-1">
		<slot />
	</main>
	
	<!-- Notification Container -->
	<NotificationContainer />
	
</div>
