<script lang="ts">
	interface Message {
		id: string;
		text: string;
		isUser: boolean;
		timestamp: Date;
	}

	export let message: Message;
</script>

<div class="flex gap-3 p-4 {message.isUser ? 'flex-row-reverse' : ''} hover:bg-gray-800/30 transition-colors">
	<div class="size-8 shrink-0 rounded-full overflow-hidden">
		{#if message.isUser}
			<div class="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
				<svg class="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
			</div>
		{:else}
			<div class="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
				<svg class="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
				</svg>
			</div>
		{/if}
	</div>
	
	<div class="flex flex-col gap-1 max-w-[80%] {message.isUser ? 'items-end' : 'items-start'}">
		<div
			class="rounded-2xl px-4 py-3 shadow-sm border {
				message.isUser
					? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-md border-emerald-200'
					: 'bg-gray-800 text-white rounded-bl-md border-gray-700'
			}"
		>
			<p class="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
		</div>
		<span class="text-xs text-gray-400 px-2">
			{message.timestamp.toLocaleTimeString('en-US', { 
				hour: '2-digit', 
				minute: '2-digit' 
			})}
		</span>
	</div>
</div>
