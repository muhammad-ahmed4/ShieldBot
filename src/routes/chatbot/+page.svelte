<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Redirect if not authenticated
	onMount(() => {
		if (!$page.data.user) {
			goto('/login');
		}
	});

	// Chat state
	let messages = $state([
		{
			id: 1,
			text: "Hello! I'm your AI assistant. How can I help you today?",
			sender: 'bot',
			timestamp: new Date()
		}
	]);
	
	let inputMessage = $state('');
	let isLoading = $state(false);
	let sidebarOpen = $state(false);

	// Send message function
	async function sendMessage() {
		if (!inputMessage.trim() || isLoading) return;

		const userMessage = {
			id: Date.now(),
			text: inputMessage.trim(),
			sender: 'user',
			timestamp: new Date()
		};

		messages = [...messages, userMessage];
		inputMessage = '';
		isLoading = true;

		try {
			const response = await fetch('/api/chatbot', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message: userMessage.text }),
			});

			if (response.ok) {
				const data = await response.json();
				const botMessage = {
					id: Date.now() + 1,
					text: data.message,
					sender: 'bot',
					timestamp: new Date()
				};
				messages = [...messages, botMessage];
			} else {
				throw new Error('Failed to get response');
			}
		} catch (error) {
			console.error('Error sending message:', error);
			const errorMessage = {
				id: Date.now() + 1,
				text: "Sorry, I'm having trouble responding right now. Please try again later.",
				sender: 'bot',
				timestamp: new Date()
			};
			messages = [...messages, errorMessage];
		} finally {
			isLoading = false;
		}
	}

	// Handle Enter key
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	// Format timestamp
	function formatTime(date: Date) {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	// Toggle sidebar
	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	// Start new chat
	function startNewChat() {
		messages = [{
			id: 1,
			text: "Hello! I'm your AI assistant. How can I help you today?",
			sender: 'bot',
			timestamp: new Date()
		}];
		sidebarOpen = false;
	}
</script>

<svelte:head>
	<title>AI Chatbot | ShieldAuth</title>
	<meta name="description" content="Chat with your AI assistant" />
</svelte:head>

<!-- Main Container -->
<div class="h-screen flex bg-slate-900" role="main">
	<!-- Sidebar -->
	<div class="sidebar {sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0">
		<div class="flex flex-col h-full">
			<!-- Sidebar Header -->
			<div class="flex items-center justify-between p-4 border-b border-slate-700">
				<div class="flex items-center space-x-3">
					<div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
						</svg>
					</div>
					<span class="text-white font-semibold">ShieldAuth</span>
				</div>
				<button 
					onclick={toggleSidebar}
					class="lg:hidden text-slate-400 hover:text-white"
					aria-label="Close sidebar"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- New Chat Button -->
			<div class="p-4">
				<button 
					onclick={startNewChat}
					class="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
					<span>New Chat</span>
				</button>
			</div>

			<!-- Chat History -->
			<div class="flex-1 overflow-y-auto px-4">
				<div class="space-y-2">
					<!-- Sample chat history items -->
					<div class="p-3 text-slate-400 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
						<div class="text-sm truncate">Previous conversation...</div>
						<div class="text-xs text-slate-500 mt-1">2 hours ago</div>
					</div>
					<div class="p-3 text-slate-400 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
						<div class="text-sm truncate">Another chat session...</div>
						<div class="text-xs text-slate-500 mt-1">Yesterday</div>
					</div>
				</div>
			</div>

			<!-- Sidebar Footer -->
			<div class="p-4 border-t border-slate-700">
				<div class="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
					{#if $page.data.user?.image}
						<img src={$page.data.user.image} alt="Profile" class="w-8 h-8 rounded-full" />
					{:else}
						<div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
							{$page.data.user?.email?.charAt(0).toUpperCase()}
						</div>
					{/if}
					<div class="flex-1 min-w-0">
						<div class="text-sm font-medium text-white truncate">
							{$page.data.user?.name || $page.data.user?.email}
						</div>
						<div class="text-xs text-slate-400 truncate">
							{$page.data.user?.email}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex-1 flex flex-col min-w-0">
		<!-- Mobile Menu Button -->
		<button 
			onclick={toggleSidebar}
			class="lg:hidden fixed top-4 left-4 z-40 p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
			aria-label="Open sidebar"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>

		<!-- Chat Area -->
		<main class="flex-1 flex flex-col overflow-hidden">
			<!-- Messages -->
			<div class="flex-1 overflow-y-auto p-4 space-y-6">
				{#each messages as message (message.id)}
					<div class="flex {message.sender === 'user' ? 'justify-end' : 'justify-start'}">
						<div class="max-w-3xl w-full">
							<div class="flex {message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3">
								<!-- Avatar -->
								<div class="flex-shrink-0">
									{#if message.sender === 'user'}
										{#if $page.data.user?.image}
											<img src={$page.data.user.image} alt="User" class="w-8 h-8 rounded-full" />
										{:else}
											<div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
												{$page.data.user?.email?.charAt(0).toUpperCase()}
											</div>
										{/if}
									{:else}
										<!-- Robot Avatar -->
										<div class="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
											<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
											</svg>
										</div>
									{/if}
								</div>
								
								<!-- Message Content -->
								<div class="flex-1 min-w-0">
									<div class="bg-slate-800 rounded-lg p-4 text-slate-200">
										<div class="prose prose-invert max-w-none">
											<p class="whitespace-pre-wrap">{message.text}</p>
										</div>
									</div>
									<div class="text-xs text-slate-500 mt-2 {message.sender === 'user' ? 'text-right' : 'text-left'}">
										{formatTime(message.timestamp)}
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
				
				<!-- Loading indicator -->
				{#if isLoading}
					<div class="flex justify-start">
						<div class="max-w-3xl w-full">
							<div class="flex items-start space-x-3">
								<!-- Robot Avatar -->
								<div class="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
									<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
								</div>
								<div class="bg-slate-800 rounded-lg p-4">
									<div class="flex space-x-1">
										<div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
										<div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
										<div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Input Area -->
			<div class="border-t border-slate-700 p-4">
				<div class="max-w-4xl mx-auto">
					<div class="relative">
					<textarea
						bind:value={inputMessage}
						onkeypress={handleKeyPress}
						placeholder="Message AI Assistant..."
						disabled={isLoading}
						class="w-full px-4 py-3 pr-12 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
						rows="1"
						style="min-height: 48px; max-height: 120px;"
					></textarea>
					<button
						onclick={sendMessage}
						disabled={!inputMessage.trim() || isLoading}
						class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						aria-label="Send message"
					>
						{#if isLoading}
							<svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
						{:else}
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
							</svg>
						{/if}
					</button>
					</div>
					<p class="text-xs text-slate-500 mt-2 text-center">
						Press Enter to send, Shift+Enter for new line
					</p>
				</div>
			</div>
		</main>
	</div>

	<!-- Sidebar Overlay (Mobile) -->
	{#if sidebarOpen}
		<div 
			class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
			onclick={toggleSidebar}
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Enter' && toggleSidebar()}
		></div>
	{/if}
</div>

<style>
	:global(body) {
		height: 100vh;
		overflow: hidden;
	}
	
	.sidebar {
		background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
		position: relative;
	}
	
	.sidebar::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: 
			radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
		pointer-events: none;
	}
	
	.sidebar > * {
		position: relative;
		z-index: 1;
	}
</style>
