<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ChatMessage from './components/ChatMessage.svelte';
	import ChatInput from './components/ChatInput.svelte';
	import TypingIndicator from './components/TypingIndicator.svelte';
	import Sidebar from './components/Sidebar.svelte';
	import ScrollArea from '$lib/components/ScrollArea.svelte';
	import EnhancedMessageRenderer from '$lib/components/EnhancedMessageRenderer.svelte';
	import { clientChatService, type ChatMessage as ChatMessageType } from '$lib/services/clientChatService';

	// Redirect if not authenticated
	$: if (!$page.data.user) {
		goto('/login');
	}

	interface Message {
		id: string;
		text: string;
		isUser: boolean;
		timestamp: Date;
		isStreaming?: boolean;
	}

	interface Chat {
		id: string;
		title: string;
		timestamp: Date;
		isAutoRenamed?: boolean;
	}

	let messages: Message[] = [];
	let isTyping = false;
	let isStreaming = false;
	let sidebarOpen = true;
	let currentChatId = "1";
	
	// Initialize with first chat if available
	$: if (chats.length > 0 && !chats.find(chat => chat.id === currentChatId)) {
		currentChatId = chats[0].id;
	}
	let selectedModel = "models/gemini-1.5-flash";
	let scrollAreaRef: any;
	let error: string | null = null;
	let showModelDropdown = false;
	let chats: Chat[] = [
		{ id: "1", title: "Getting started with AI", timestamp: new Date(Date.now() - 1000 * 60 * 30), isAutoRenamed: true },
		{ id: "2", title: "React development tips", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isAutoRenamed: true },
		{ id: "3", title: "Machine learning basics", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isAutoRenamed: true },
		{ id: "4", title: "Web design principles", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), isAutoRenamed: true },
	];

	const scrollToBottom = () => {
		if (scrollAreaRef) {
			const scrollContainer = scrollAreaRef.querySelector('[data-radix-scroll-area-viewport]');
			if (scrollContainer) {
				scrollContainer.scrollTop = scrollContainer.scrollHeight;
			}
		}
	};

	$: {
		scrollToBottom();
	}

	const handleSendMessage = async (text: string) => {
		if (!text.trim() || isTyping || isStreaming) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			text,
			isUser: true,
			timestamp: new Date(),
		};

		// Auto-rename chat if this is the first user message and chat hasn't been auto-renamed
		const isFirstUserMessage = messages.length === 0;
		if (isFirstUserMessage) {
			autoRenameChat(currentChatId, text);
		}
		
		messages = [...messages, userMessage];
		
		isTyping = true;
		isStreaming = true;
		error = null;

		// Add placeholder AI message for streaming
			const aiMessage: Message = {
				id: (Date.now() + 1).toString(),
			text: '',
				isUser: false,
				timestamp: new Date(),
			isStreaming: true,
		};
		messages = [...messages, aiMessage];

		try {
			// Convert messages to conversation history format
			const conversationHistory: ChatMessageType[] = messages
				.filter(msg => !msg.isStreaming)
				.map(msg => ({
					id: msg.id,
					role: msg.isUser ? 'user' : 'assistant',
					content: msg.text,
					timestamp: msg.timestamp
				}));

			// Use streaming response
			let accumulatedContent = '';
			for await (const chunk of clientChatService.sendStreamingMessage(text, conversationHistory, selectedModel)) {
				if (chunk.type === 'chunk' && chunk.content) {
					accumulatedContent += chunk.content;
					// Update the AI message content
					const messageIndex = messages.findIndex(m => m.id === aiMessage.id);
					if (messageIndex !== -1) {
						messages[messageIndex] = {
							...messages[messageIndex],
							text: accumulatedContent
						};
						messages = [...messages]; // Trigger reactivity
					}
				} else if (chunk.type === 'complete') {
					// Finalize the message
					const messageIndex = messages.findIndex(m => m.id === aiMessage.id);
					if (messageIndex !== -1) {
						messages[messageIndex] = {
							...messages[messageIndex],
							text: accumulatedContent,
							isStreaming: false
						};
						messages = [...messages];
					}
					break;
				} else if (chunk.type === 'error') {
					throw new Error(chunk.error || 'Unknown error occurred');
				}
			}
		} catch (err) {
			console.error('Error sending message:', err);
			error = err instanceof Error ? err.message : 'Failed to send message';
			
			// Update the AI message with error
			const messageIndex = messages.findIndex(m => m.id === aiMessage.id);
			if (messageIndex !== -1) {
				messages[messageIndex] = {
					...messages[messageIndex],
					text: `Sorry, I encountered an error: ${error}`,
					isStreaming: false
				};
				messages = [...messages];
			}
		} finally {
			isTyping = false;
			isStreaming = false;
		}
	};

	const handleClearChat = () => {
		messages = [];
		isTyping = false;
		error = null;
	};

	const handleNewChat = () => {
		const newChatId = Date.now().toString();
		currentChatId = newChatId;
		// Add new chat to the list with default title and not auto-renamed
		const newChat: Chat = {
			id: newChatId,
			title: "New Chat",
			timestamp: new Date(),
			isAutoRenamed: false
		};
		chats = [newChat, ...chats];
		handleClearChat();
		console.log('New chat created:', newChatId, 'Total chats:', chats.length);
	};

	const handleSelectChat = (chatId: string) => {
		currentChatId = chatId;
		// In a real app, you would load the chat history here
		handleClearChat();
	};

	const handleBack = () => {
		goto('/');
	};

	const handleModelChange = (model: string) => {
		selectedModel = model;
		showModelDropdown = false;
		// In a real app, you would switch the AI model here
		console.log("Model changed to:", model);
	};

	const models = [
		{ value: "models/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
		{ value: "models/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
		{ value: "models/gemini-1.5-pro", label: "Gemini 1.5 Pro" },
		{ value: "models/gemini-1.5-flash", label: "Gemini 1.5 Flash" }
	];

	const handleClickOutside = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!target.closest('.model-dropdown')) {
			showModelDropdown = false;
		}
	};

	const extractTopicFromMessage = (message: string): string => {
		// Simple topic extraction - take first few words and clean them up
		const words = message.trim().split(/\s+/).slice(0, 4);
		let topic = words.join(' ');
		
		// Remove common question words and clean up
		topic = topic.replace(/^(what|how|why|when|where|can|could|would|should|is|are|do|does|did)\s+/i, '');
		topic = topic.replace(/\?+$/, ''); // Remove trailing question marks
		
		// Capitalize first letter
		topic = topic.charAt(0).toUpperCase() + topic.slice(1);
		
		// Limit length
		if (topic.length > 30) {
			topic = topic.substring(0, 27) + '...';
		}
		
		return topic || 'New Chat';
	};

	const handleChatRename = (chatId: string, newTitle: string) => {
		const chatIndex = chats.findIndex(chat => chat.id === chatId);
		if (chatIndex !== -1) {
			chats[chatIndex] = { ...chats[chatIndex], title: newTitle, isAutoRenamed: true };
			chats = [...chats]; // Trigger reactivity
		}
	};

	const handleChatDelete = (chatId: string) => {
		chats = chats.filter(chat => chat.id !== chatId);
		// If we deleted the current chat, switch to the first available chat or create a new one
		if (currentChatId === chatId) {
			if (chats.length > 0) {
				currentChatId = chats[0].id;
			} else {
				handleNewChat();
			}
		}
		console.log('Chat deleted:', chatId, 'Remaining chats:', chats.length);
	};

	const autoRenameChat = (chatId: string, firstMessage: string) => {
		console.log('Auto-rename called for chat:', chatId, 'with message:', firstMessage);
		const chatIndex = chats.findIndex(chat => chat.id === chatId);
		console.log('Chat found at index:', chatIndex, 'isAutoRenamed:', chats[chatIndex]?.isAutoRenamed);
		
		if (chatIndex !== -1 && !chats[chatIndex].isAutoRenamed) {
			const newTitle = extractTopicFromMessage(firstMessage);
			console.log('Renaming chat to:', newTitle);
			chats[chatIndex] = { ...chats[chatIndex], title: newTitle, isAutoRenamed: true };
			chats = [...chats]; // Trigger reactivity
		}
	};
</script>

<svelte:head>
	<title>ShieldBot - AI Assistant</title>
	<meta name="description" content="Chat with ShieldBot AI Assistant" />
</svelte:head>

<svelte:window on:click={handleClickOutside} />


<div class="h-screen flex bg-black text-white">
	<Sidebar 
		isOpen={sidebarOpen}
		onToggle={() => sidebarOpen = !sidebarOpen}
		{handleNewChat}
		{currentChatId}
		{handleSelectChat}
		{chats}
		onChatRename={handleChatRename}
		onChatDelete={handleChatDelete}
	/>
	
	<div class="flex-1 flex flex-col relative z-0">
		<!-- Sidebar Toggle Button (when sidebar is closed) -->
		{#if !sidebarOpen}
			<button
				on:click={() => sidebarOpen = true}
				class="absolute top-4 left-4 z-50 p-3 bg-black/80 border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-all duration-300 shadow-lg backdrop-blur-sm"
				aria-label="Open sidebar"
			>
				<svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		{/if}

		<!-- Model Selection Dropdown - Top Left -->
		<div class="absolute top-4 {sidebarOpen ? 'left-4' : 'left-20'} z-50 model-dropdown transition-all duration-300">
			<div class="relative">
				<button
					on:click={() => showModelDropdown = !showModelDropdown}
					class="flex items-center gap-2 px-4 py-2 bg-black/80 border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-all duration-300 shadow-lg backdrop-blur-sm"
				>
					<span class="text-sm font-medium">{models.find(m => m.value === selectedModel)?.label || 'Select Model'}</span>
					<svg class="size-4 transition-transform {showModelDropdown ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				
				{#if showModelDropdown}
					<div class="absolute top-full left-0 mt-1 w-48 bg-black border border-gray-600 rounded-lg shadow-2xl max-h-60 overflow-y-auto z-50">
						{#each models as model}
							<button
								on:click={() => handleModelChange(model.value)}
								class="w-full text-left px-3 py-2 text-white hover:bg-gray-800 transition-colors first:rounded-t-lg last:rounded-b-lg {model.value === selectedModel ? 'bg-gray-800' : ''}"
							>
								{model.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<ScrollArea bind:this={scrollAreaRef} class="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
			<!-- Background texture overlay -->
			<div class="absolute inset-0 opacity-5">
				<svg class="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
							<path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgb(147 197 253)" stroke-width="0.3"/>
						</pattern>
					</defs>
					<rect width="100" height="100" fill="url(#grid)" />
				</svg>
			</div>
			<!-- Decorative elements -->
			<div class="absolute top-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
			<div class="absolute bottom-20 left-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
			<div class="absolute top-1/2 left-10 w-16 h-16 bg-indigo-400/5 rounded-full blur-lg"></div>
			
			<div class="relative z-10 min-h-full flex flex-col pt-20">
				{#if error}
					<div class="mx-4 mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
						<div class="flex items-center gap-2">
							<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span class="text-red-400 text-sm">{error}</span>
						</div>
					</div>
				{/if}
				
				{#if messages.length === 0}
					<!-- Welcome Placeholder -->
					<div class="flex-1 flex flex-col items-center justify-center px-4 py-8">
						<div class="text-center max-w-2xl">
							<h2 class="text-2xl font-semibold text-white mb-2">Start chatting with ShieldBot</h2>
							<p class="text-gray-400 mb-8">Your AI security assistant is ready to help you with cybersecurity, authentication, and digital security topics.</p>
							
							<!-- Chat Prompts -->
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
								<button 
									on:click={() => handleSendMessage("What are the best practices for password security?")}
									class="group relative bg-gradient-to-r from-blue-900/40 via-blue-800/30 to-blue-700/40 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30 hover:border-blue-400/50 shadow-2xl hover:shadow-3xl hover:shadow-blue-500/25 transform hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden text-left"
								>
									<!-- Animated background effects -->
									<div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-blue-400/5 to-blue-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
									<div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-xl"></div>
									<div class="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-blue-300/10 to-transparent rounded-full blur-lg"></div>
									
									<div class="relative z-10 flex items-center gap-3">
										<div class="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/30 group-hover:from-blue-400/30 group-hover:to-blue-500/40 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-blue-500/30">
											<svg class="w-5 h-5 text-blue-300 group-hover:text-blue-200 transition-all duration-300 group-hover:drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
											</svg>
										</div>
										<div>
											<h3 class="text-white font-medium group-hover:text-blue-200 transition-colors duration-300 group-hover:drop-shadow-sm">Password Security</h3>
											<p class="text-sm text-slate-300 group-hover:text-slate-100 transition-colors duration-300">Learn about strong password practices</p>
										</div>
									</div>
								</button>
								
								<button 
									on:click={() => handleSendMessage("How can I protect myself from phishing attacks?")}
									class="group relative bg-gradient-to-r from-orange-900/40 via-orange-800/30 to-orange-700/40 backdrop-blur-sm rounded-2xl p-4 border border-orange-500/30 hover:border-orange-400/50 shadow-2xl hover:shadow-3xl hover:shadow-orange-500/25 transform hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden text-left"
								>
									<!-- Animated background effects -->
									<div class="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-orange-400/5 to-orange-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
									<div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full blur-xl"></div>
									<div class="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-orange-300/10 to-transparent rounded-full blur-lg"></div>
									
									<div class="relative z-10 flex items-center gap-3">
										<div class="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/30 group-hover:from-orange-400/30 group-hover:to-orange-500/40 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-orange-500/30">
											<svg class="w-5 h-5 text-orange-300 group-hover:text-orange-200 transition-all duration-300 group-hover:drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
											</svg>
										</div>
										<div>
											<h3 class="text-white font-medium group-hover:text-orange-200 transition-colors duration-300 group-hover:drop-shadow-sm">Phishing Protection</h3>
											<p class="text-sm text-slate-300 group-hover:text-slate-100 transition-colors duration-300">Identify and avoid phishing scams</p>
										</div>
									</div>
								</button>
								
								<button 
									on:click={() => handleSendMessage("What is two-factor authentication and why should I use it?")}
									class="group relative bg-gradient-to-r from-green-900/40 via-green-800/30 to-green-700/40 backdrop-blur-sm rounded-2xl p-4 border border-green-500/30 hover:border-green-400/50 shadow-2xl hover:shadow-3xl hover:shadow-green-500/25 transform hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden text-left"
								>
									<!-- Animated background effects -->
									<div class="absolute inset-0 bg-gradient-to-r from-green-500/5 via-green-400/5 to-green-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
									<div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-xl"></div>
									<div class="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-green-300/10 to-transparent rounded-full blur-lg"></div>
									
									<div class="relative z-10 flex items-center gap-3">
										<div class="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/30 group-hover:from-green-400/30 group-hover:to-green-500/40 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-green-500/30">
											<svg class="w-5 h-5 text-green-300 group-hover:text-green-200 transition-all duration-300 group-hover:drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
											</svg>
										</div>
										<div>
											<h3 class="text-white font-medium group-hover:text-green-200 transition-colors duration-300 group-hover:drop-shadow-sm">Two-Factor Auth</h3>
											<p class="text-sm text-slate-300 group-hover:text-slate-100 transition-colors duration-300">Understand 2FA benefits and setup</p>
										</div>
									</div>
								</button>
								
								<button 
									on:click={() => handleSendMessage("How do I secure my home network?")}
									class="group relative bg-gradient-to-r from-purple-900/40 via-purple-800/30 to-purple-700/40 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 hover:border-purple-400/50 shadow-2xl hover:shadow-3xl hover:shadow-purple-500/25 transform hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden text-left"
								>
									<!-- Animated background effects -->
									<div class="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-purple-400/5 to-purple-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
									<div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full blur-xl"></div>
									<div class="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-purple-300/10 to-transparent rounded-full blur-lg"></div>
									
									<div class="relative z-10 flex items-center gap-3">
										<div class="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/30 group-hover:from-purple-400/30 group-hover:to-purple-500/40 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-purple-500/30">
											<svg class="w-5 h-5 text-purple-300 group-hover:text-purple-200 transition-all duration-300 group-hover:drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
											</svg>
										</div>
										<div>
											<h3 class="text-white font-medium group-hover:text-purple-200 transition-colors duration-300 group-hover:drop-shadow-sm">Network Security</h3>
											<p class="text-sm text-slate-300 group-hover:text-slate-100 transition-colors duration-300">Secure your home Wi-Fi and devices</p>
										</div>
									</div>
								</button>
							</div>
						</div>
					</div>
				{:else}
				{#each messages as message (message.id)}
					<ChatMessage
						{message}
						>
							<EnhancedMessageRenderer
								content={message.text}
								isStreaming={message.isStreaming || false}
					/>
						</ChatMessage>
				{/each}
				{/if}
				{#if isTyping && !isStreaming}
					<TypingIndicator />
				{/if}
			</div>
		</ScrollArea>

		<ChatInput onSendMessage={handleSendMessage} isTyping={isTyping || isStreaming} />
	</div>
</div>
