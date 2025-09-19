<script lang="ts">
	export let onSendMessage: (message: string) => void;
	export let isTyping: boolean = false;

	let message = '';

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		if (message.trim() && !isTyping) {
			onSendMessage(message.trim());
			message = '';
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};
</script>

<div class="border-t border-gray-700 bg-black/80 backdrop-blur-sm p-4">
	<form on:submit={handleSubmit} class="flex gap-3 items-center max-w-4xl mx-auto">
		<button
			type="button"
			class="text-gray-400 hover:text-white hover:bg-gray-800 shrink-0 flex items-center justify-center p-2 rounded-lg transition-colors"
			aria-label="Attach file"
		>
			<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
			</svg>
		</button>
		
		<div class="flex-1 relative">
			<input
				bind:value={message}
				on:keydown={handleKeyDown}
				placeholder="Message AI Assistant..."
				class="w-full bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500/20 pr-12 rounded-full px-4 py-3 transition-all duration-200"
				disabled={isTyping}
			/>
			
			<button
				type="button"
				class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white hover:bg-gray-800 size-8 p-0 rounded-full flex items-center justify-center transition-colors"
				aria-label="Voice input"
			>
				<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
				</svg>
			</button>
		</div>
		
		<button
			type="submit"
			disabled={!message.trim() || isTyping}
			class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white disabled:from-gray-600 disabled:to-gray-600 disabled:text-gray-400 shrink-0 rounded-full px-4 py-3 shadow-lg transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed"
			aria-label="Send message"
		>
			<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
			</svg>
		</button>
	</form>
</div>
