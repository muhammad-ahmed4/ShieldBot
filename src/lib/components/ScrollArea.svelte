<script lang="ts">
	interface ScrollAreaProps {
		class?: string;
		children?: any;
		[key: string]: any;
	}

	let { class: className = '', children, ...restProps }: ScrollAreaProps = $props();

	// Simple utility function for class merging
	function cn(...classes: (string | undefined | null | false)[]): string {
		return classes.filter(Boolean).join(' ');
	}
</script>

<div 
	class={cn("relative overflow-hidden", className)}
	{...restProps}
	data-slot="scroll-area"
>
	<div 
		class="h-full w-full overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
		data-slot="scroll-area-viewport"
	>
		{@render children?.()}
	</div>
</div>
