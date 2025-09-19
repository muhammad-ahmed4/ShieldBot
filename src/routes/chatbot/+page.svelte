<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ChatMessage from './components/ChatMessage.svelte';
	import ChatInput from './components/ChatInput.svelte';
	import ChatHeader from './components/ChatHeader.svelte';
	import TypingIndicator from './components/TypingIndicator.svelte';
	import Sidebar from './components/Sidebar.svelte';
	import ScrollArea from '$lib/components/ScrollArea.svelte';

	// Redirect if not authenticated
	$: if (!$page.data.user) {
		goto('/login');
	}

	interface Message {
		id: string;
		text: string;
		isUser: boolean;
		timestamp: Date;
	}

	const mockResponses = [
		"Hello! I'm your AI assistant. How can I help you today?",
		"That's an interesting question! Let me think about that for a moment.",
		"I understand what you're asking. Here's my perspective on that topic...",
		"Great question! Based on the information you've provided, I'd suggest...",
		"I'm here to help with whatever you need. Feel free to ask me anything!",
		"That's a complex topic with many facets. Let me break it down for you...",
		"I appreciate you sharing that with me. Here's what I think about it...",
		"Excellent point! That reminds me of a few key considerations...",
	];

	let messages: Message[] = [
		{
			id: "1",
			text: "Hello! I'm your AI assistant powered by advanced language models. How can I help you today?",
			isUser: false,
			timestamp: new Date(),
		},
	];
	let isTyping = false;
	let sidebarOpen = true;
	let currentChatId = "1";
	let selectedModel = "gemini-pro";
	let scrollAreaRef: any;

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
		const userMessage: Message = {
			id: Date.now().toString(),
			text,
			isUser: true,
			timestamp: new Date(),
		};

		messages = [...messages, userMessage];
		isTyping = true;

		// Simulate AI response delay
		setTimeout(() => {
			const aiMessage: Message = {
				id: (Date.now() + 1).toString(),
				text: mockResponses[Math.floor(Math.random() * mockResponses.length)],
				isUser: false,
				timestamp: new Date(),
			};

			messages = [...messages, aiMessage];
			isTyping = false;
		}, 1500 + Math.random() * 1000);
	};

	const handleClearChat = () => {
		messages = [
			{
				id: "1",
				text: "Hello! I'm your AI assistant powered by advanced language models. How can I help you today?",
				isUser: false,
				timestamp: new Date(),
			},
		];
		isTyping = false;
	};

	const handleNewChat = () => {
		const newChatId = Date.now().toString();
		currentChatId = newChatId;
		handleClearChat();
	};

	const handleSelectChat = (chatId: string) => {
		currentChatId = chatId;
		// In a real app, you would load the chat history here
		handleClearChat();
	};

	const handleBack = () => {
		// Navigation logic would go here
		console.log("Back button clicked");
	};

	const handleModelChange = (model: string) => {
		selectedModel = model;
		// In a real app, you would switch the AI model here
		console.log("Model changed to:", model);
	};
</script>

<svelte:head>
	<title>ShieldBot - AI Assistant</title>
	<meta name="description" content="Chat with ShieldBot AI Assistant" />
</svelte:head>

<div class="h-screen flex bg-black text-white">
	<Sidebar 
		isOpen={sidebarOpen}
		onToggle={() => sidebarOpen = !sidebarOpen}
		{handleNewChat}
		{currentChatId}
		{handleSelectChat}
	/>
	
	<div class="flex-1 flex flex-col">
		<ChatHeader 
			onClearChat={handleClearChat}
			onToggleSidebar={() => sidebarOpen = !sidebarOpen}
			{sidebarOpen}
			onBack={handleBack}
			{selectedModel}
			onModelChange={handleModelChange}
		/>
		
		<ScrollArea bind:this={scrollAreaRef} class="flex-1 bg-black">
			<div class="min-h-full flex flex-col">
				{#each messages as message (message.id)}
					<ChatMessage
						{message}
					/>
				{/each}
				{#if isTyping}
					<TypingIndicator />
				{/if}
			</div>
		</ScrollArea>

		<ChatInput onSendMessage={handleSendMessage} {isTyping} />
	</div>
</div>
