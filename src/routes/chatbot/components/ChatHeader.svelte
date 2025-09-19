<script lang="ts">
	export let onClearChat: () => void;
	export let onToggleSidebar: () => void;
	export let sidebarOpen: boolean;
	export let onBack: (() => void) | undefined = undefined;
	export let selectedModel: string;
	export let onModelChange: (model: string) => void;

	let showModelDropdown = false;

	const models = [
		{ value: "gemini-pro", label: "Gemini Pro" },
		{ value: "gemini-ultra", label: "Gemini Ultra" },
		{ value: "gpt-4", label: "GPT-4" },
		{ value: "claude-3", label: "Claude 3" }
	];

	const handleModelSelect = (model: string) => {
		onModelChange(model);
		showModelDropdown = false;
	};

	const handleClickOutside = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!target.closest('.model-dropdown')) {
			showModelDropdown = false;
		}
	};
</script>

<svelte:window on:click={handleClickOutside} />

<div class="border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-800/95 backdrop-blur-sm p-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			{#if !sidebarOpen}
				<button
					on:click={onToggleSidebar}
					class="text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center p-2 rounded-lg transition-colors"
					aria-label="Toggle sidebar"
				>
					<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			{/if}
			
			{#if onBack}
				<button
					on:click={onBack}
					class="text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center p-2 rounded-lg transition-colors"
					aria-label="Go back"
				>
					<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
				</button>
			{/if}
			
			<div class="flex items-center gap-3">
				<div class="flex items-center justify-center size-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
					<svg class="size-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
				</div>
				<div>
					<h1 class="text-white font-medium">ShieldBot AI</h1>
					<p class="text-sm text-gray-400">Powered by AI</p>
				</div>
			</div>
		</div>

		<div class="flex items-center gap-3">
			<!-- Model Selection -->
			<div class="relative model-dropdown">
				<button
					on:click={() => showModelDropdown = !showModelDropdown}
					class="w-40 bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 transition-colors px-3 py-2 rounded-lg flex items-center justify-between"
				>
					<span>{models.find(m => m.value === selectedModel)?.label || 'Select Model'}</span>
					<svg class="size-4 transition-transform {showModelDropdown ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				
				{#if showModelDropdown}
					<div class="absolute top-full left-0 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
						{#each models as model}
							<button
								on:click={() => handleModelSelect(model.value)}
								class="w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg {model.value === selectedModel ? 'bg-gray-700' : ''}"
							>
								{model.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		
			<div class="relative">
				<button class="text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center p-2 rounded-lg transition-colors" aria-label="More options">
					<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
					</svg>
				</button>
				
				<div class="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
					<button
						on:click={onClearChat}
						class="w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors rounded-lg"
					>
						Clear chat
					</button>
					<button
						class="w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors rounded-lg"
					>
						Export chat
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
