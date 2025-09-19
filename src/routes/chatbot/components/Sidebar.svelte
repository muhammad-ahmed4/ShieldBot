<script lang="ts">
	import { page } from '$app/stores';
	import ScrollArea from '$lib/components/ScrollArea.svelte';

	export let isOpen: boolean;
	export let onToggle: () => void;
	export let handleNewChat: () => void;
	export let currentChatId: string;
	export let handleSelectChat: (chatId: string) => void;

	interface Chat {
		id: string;
		title: string;
		timestamp: Date;
	}

	const chats: Chat[] = [
		{ id: "1", title: "Getting started with AI", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
		{ id: "2", title: "React development tips", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
		{ id: "3", title: "Machine learning basics", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
		{ id: "4", title: "Web design principles", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
	];

	const userInfo = {
		name: $page.data.user?.name || "User",
		email: $page.data.user?.email || "user@example.com",
		avatar: $page.data.user?.image || null
	};

	const formatChatTime = (date: Date) => {
		const now = new Date();
		const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
		
		if (diffInHours < 1) return "Just now";
		if (diffInHours < 24) return `${diffInHours}h ago`;
		if (diffInHours < 48) return "Yesterday";
		return `${Math.floor(diffInHours / 24)}d ago`;
	};

	let showUserDropdown = false;
	let showChatDropdown: string | null = null;

	const handleClickOutside = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!target.closest('.dropdown')) {
			showUserDropdown = false;
			showChatDropdown = null;
		}
	};
</script>

<svelte:window on:click={handleClickOutside} />

{#if !isOpen}
	<div class="flex flex-col bg-gray-800 border-r border-gray-700">
		<div class="p-3">
			<button
				on:click={onToggle}
				class="text-gray-400 hover:bg-gray-700 w-full justify-center flex items-center p-2 rounded-lg transition-colors"
				aria-label="Toggle sidebar"
			>
				<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		</div>
		<div class="p-3 pt-0">
			<button
				on:click={handleNewChat}
				class="text-gray-400 hover:bg-gray-700 w-full justify-center flex items-center p-2 rounded-lg transition-colors"
				aria-label="New chat"
			>
				<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
			</button>
		</div>
	</div>
{:else}
	<div class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
		<!-- Header -->
		<div class="p-3 border-b border-gray-700">
			<div class="flex items-center justify-between mb-3">
				<h2 class="text-white text-sm font-medium">Conversations</h2>
				<button
					on:click={onToggle}
					class="text-gray-400 hover:text-white hover:bg-gray-700 size-6 p-0 flex items-center justify-center rounded-lg transition-colors"
					aria-label="Close sidebar"
				>
					<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			
			<button
				on:click={handleNewChat}
				class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white justify-start gap-2 shadow-lg transition-all duration-200 px-4 py-2 rounded-lg flex items-center"
			>
				<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				New Chat
			</button>
		</div>

		<!-- Chat List -->
		<ScrollArea class="flex-1">
			<div class="p-2">
				{#each chats as chat}
					<button
						class="group flex items-center gap-2 p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 w-full text-left {
							currentChatId === chat.id
								? 'bg-gray-700 text-white shadow-sm border border-gray-600/50'
								: 'text-gray-400 hover:bg-gray-700 hover:text-white'
						}"
						on:click={() => handleSelectChat(chat.id)}
					>
						<div class="flex items-center justify-center size-8 rounded-lg transition-colors {
							currentChatId === chat.id ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gray-700'
						}">
							<svg class="size-4 {currentChatId === chat.id ? 'text-white' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
							</svg>
						</div>
						
						<div class="flex-1 min-w-0">
							<p class="truncate text-sm font-medium">{chat.title}</p>
							<p class="text-xs text-gray-400">{formatChatTime(chat.timestamp)}</p>
						</div>
						
						<div class="relative dropdown">
							<div
								on:click={(e) => { e.stopPropagation(); showChatDropdown = showChatDropdown === chat.id ? null : chat.id; }}
								class="opacity-0 group-hover:opacity-100 size-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50 flex items-center justify-center rounded-lg transition-all cursor-pointer"
								role="button"
								tabindex="0"
								on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showChatDropdown = showChatDropdown === chat.id ? null : chat.id; } }}
								aria-label="Chat options"
							>
								<svg class="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
								</svg>
							</div>
							
							{#if showChatDropdown === chat.id}
								<div class="absolute right-0 top-full mt-1 w-32 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
									<button class="w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors rounded-lg text-sm">
										Rename
									</button>
									<button class="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700 transition-colors rounded-lg text-sm">
										Delete
									</button>
								</div>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		</ScrollArea>

		<!-- User Profile Section -->
		<div class="p-3 border-t border-gray-700">
			<button class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer w-full text-left">
				<div class="size-8 rounded-full overflow-hidden">
					{#if userInfo.avatar}
						<img src={userInfo.avatar} alt={userInfo.name} class="w-full h-full object-cover" />
					{:else}
						<div class="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-sm font-medium">
							{userInfo.name.split(' ').map((n: string) => n[0]).join('')}
						</div>
					{/if}
				</div>
				
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-white truncate">{userInfo.name}</p>
					<p class="text-xs text-gray-400 truncate">{userInfo.email}</p>
				</div>
				
				<div class="relative dropdown">
					<div
						on:click={() => showUserDropdown = !showUserDropdown}
						class="size-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
						role="button"
						tabindex="0"
						on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showUserDropdown = !showUserDropdown; } }}
						aria-label="User options"
					>
						<svg class="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
						</svg>
					</div>
					
					{#if showUserDropdown}
						<div class="absolute right-0 top-full mt-1 w-32 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
							<button class="w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors rounded-lg text-sm">
								Profile
							</button>
							<button class="w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors rounded-lg text-sm">
								Settings
							</button>
						</div>
					{/if}
				</div>
			</button>
		</div>
	</div>
{/if}
