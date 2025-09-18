<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let code = $state('');
	let error = $state('');
	let success = $state('');
	let isLoading = $state(false);
	let resendCooldown = $state(0);
	let userId = $state('');
	let userEmail = $state('');

	// Get user data from URL params
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		userId = urlParams.get('userId') || '';
		userEmail = urlParams.get('email') || '';
		
		if (!userId || !userEmail) {
			goto('/register');
		}
	});

	// Auto-focus first input
	onMount(() => {
		const firstInput = document.getElementById('code-0');
		if (firstInput) {
			firstInput.focus();
		}
	});

	// Handle code input
	function handleCodeInput(index: number, value: string) {
		if (value.length > 1) {
			value = value.slice(-1);
		}
		
		const codeArray = code.split('');
		codeArray[index] = value;
		code = codeArray.join('');
		
		// Move to next input
		if (value && index < 5) {
			const nextInput = document.getElementById(`code-${index + 1}`);
			if (nextInput) {
				nextInput.focus();
			}
		}
	}

	// Handle backspace
	function handleKeyDown(index: number, event: KeyboardEvent) {
		if (event.key === 'Backspace' && !code[index] && index > 0) {
			const prevInput = document.getElementById(`code-${index - 1}`);
			if (prevInput) {
				prevInput.focus();
			}
		}
	}

	// Handle paste
	function handlePaste(event: ClipboardEvent) {
		event.preventDefault();
		const pastedData = event.clipboardData?.getData('text') || '';
		const cleanData = pastedData.replace(/\D/g, '').slice(0, 6);
		
		if (cleanData.length === 6) {
			code = cleanData;
			// Focus last input
			const lastInput = document.getElementById('code-5');
			if (lastInput) {
				lastInput.focus();
			}
		}
	}

	// Resend code
	async function resendCode() {
		if (resendCooldown > 0) return;
		
		isLoading = true;
		error = '';
		
		try {
			const response = await fetch('/api/auth/resend-verification-code', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId, email: userEmail }),
			});
			
			const result = await response.json();
			
			if (response.ok) {
				success = 'New verification code sent to your email!';
				// Start cooldown timer
				resendCooldown = 60;
				const timer = setInterval(() => {
					resendCooldown--;
					if (resendCooldown <= 0) {
						clearInterval(timer);
					}
				}, 1000);
			} else {
				error = result.error || 'Failed to resend code';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	// Handle form submission
	function handleSubmit() {
		if (code.length !== 6) {
			error = 'Please enter a 6-digit code';
			return;
		}
		
		console.log('Submitting verification code:', { code, userId, userEmail });
		
		return async ({ result, update }: { result: any; update: any }) => {
			console.log('Verification result:', result);
			
			if (result.type === 'failure') {
				error = result.data?.error || 'Verification failed';
				console.log('Verification failed:', result.data);
			} else if (result.type === 'success') {
				success = 'Email verified successfully! Redirecting to login...';
				setTimeout(() => {
					goto('/login');
				}, 2000);
			}
			await update();
		};
	}
</script>

<svelte:head>
	<title>Verify Email - ShieldAuth</title>
	<meta name="description" content="Verify your email address" />
</svelte:head>

<!-- Two Panel Layout -->
<div class="min-h-screen flex">
	<!-- Left Panel - Graphics and Welcome (65%) -->
	<div class="hidden lg:flex lg:w-[65%] bg-gradient-to-br from-sky-800 via-blue-900 to-slate-900 relative overflow-hidden">
		<!-- Background Pattern -->
		<div class="absolute inset-0 opacity-10">
			<svg class="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
						<path d="M 10 0 L 0 0 0 10" fill="none" stroke="sky-300" stroke-width="0.5"/>
					</pattern>
				</defs>
				<rect width="100" height="100" fill="url(#grid)" />
			</svg>
		</div>
		
		<!-- Content -->
		<div class="relative z-10 flex flex-col justify-center items-center px-12 text-white w-full">
			<!-- Text Overlay Background -->
			<div class="absolute inset-0 bg-black/20 rounded-2xl"></div>
			<div class="relative z-20 max-w-lg text-center p-8">
				<!-- Logo -->
				<div class="mb-12">
					<h1 class="text-5xl font-bold mb-4 text-white">ShieldAuth</h1>
					<p class="text-sky-200 text-xl">Secure Authentication Platform</p>
				</div>
				
				<!-- Welcome Text -->
				<div class="mb-12">
					<h2 class="text-4xl font-semibold mb-6 text-white">Verify Your Email</h2>
					<p class="text-sky-200 text-lg leading-relaxed">
						We've sent a 6-digit verification code to your email address. Enter it below to complete your registration.
					</p>
				</div>
				
				<!-- Features -->
				<div class="flex justify-center space-x-8">
					<div class="flex flex-col items-center space-y-2">
						<div class="w-12 h-12 bg-sky-800/30 rounded-full flex items-center justify-center">
							<svg class="w-6 h-6 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
						</div>
						<span class="text-sky-200 text-sm text-center">Check your email</span>
					</div>
					<div class="flex flex-col items-center space-y-2">
						<div class="w-12 h-12 bg-sky-800/30 rounded-full flex items-center justify-center">
							<svg class="w-6 h-6 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<span class="text-sky-200 text-sm text-center">Code expires in 10 minutes</span>
					</div>
					<div class="flex flex-col items-center space-y-2">
						<div class="w-12 h-12 bg-sky-800/30 rounded-full flex items-center justify-center">
							<svg class="w-6 h-6 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<span class="text-sky-200 text-sm text-center">Secure verification</span>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Decorative Elements -->
		<div class="absolute top-20 right-20 w-32 h-32 bg-sky-500/20 rounded-full blur-xl"></div>
		<div class="absolute bottom-20 left-20 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
		<div class="absolute top-1/2 left-10 w-16 h-16 bg-sky-400/10 rounded-full blur-lg"></div>
	</div>
	
	<!-- Right Panel - Verification Form (35%) -->
	<div class="flex-1 lg:w-[35%] flex flex-col justify-center px-8 bg-slate-50 dark:bg-slate-900">
		<!-- Mobile Logo -->
		<div class="lg:hidden text-center mb-8">
			<a href="/" class="text-3xl font-bold text-slate-700 dark:text-slate-300">
				ShieldAuth
			</a>
		</div>
		
		<!-- Form Container -->
		<div class="mx-auto w-full max-w-lg">
			<div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 m-8">
				<!-- Form Header -->
				<div class="text-center mb-8">
					<div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-slate-800 dark:text-white">
						Enter Verification Code
					</h2>
					<p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
						We sent a 6-digit code to <strong>{userEmail}</strong>
					</p>
				</div>
				
				<!-- Error Messages -->
				{#if error}
<<<<<<< HEAD
					<div class="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-4 mb-6">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
=======
					<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
>>>>>>> 4ab6d2b01e60bcee7535a1a381e212be16fa1049
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div class="ml-3">
<<<<<<< HEAD
								<p class="text-sm text-sky-700 dark:text-sky-200">{error}</p>
=======
								<p class="text-sm text-red-700 dark:text-red-200">{error}</p>
>>>>>>> 4ab6d2b01e60bcee7535a1a381e212be16fa1049
							</div>
						</div>
					</div>
				{/if}
				
				<!-- Success Messages -->
				{#if success}
					<div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm text-green-700 dark:text-green-200">{success}</p>
							</div>
						</div>
					</div>
				{/if}
				
				<!-- Verification Form -->
				<form method="POST" use:enhance={handleSubmit} class="space-y-6">
					<input type="hidden" name="userId" value={userId} />
					<input type="hidden" name="email" value={userEmail} />
					<input type="hidden" name="code" value={code} />
					
					<!-- Code Input -->
					<div>
						<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4 text-center">
							Enter the 6-digit code
						</label>
						<div class="flex justify-center space-x-3">
							{#each Array(6) as _, i}
								<input
									id="code-{i}"
									type="text"
									maxlength="1"
									value={code[i] || ''}
									oninput={(e) => handleCodeInput(i, (e.target as HTMLInputElement)?.value || '')}
									onkeydown={(e) => handleKeyDown(i, e)}
									onpaste={handlePaste}
									class="w-12 h-12 text-center text-lg font-semibold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
								/>
							{/each}
						</div>
					</div>
					
					<!-- Submit Button -->
					<div>
						<button
							type="submit"
							disabled={code.length !== 6}
							class="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200"
						>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							Verify Email
						</button>
					</div>
					
					<!-- Resend Code -->
					<div class="text-center">
						<p class="text-sm text-slate-600 dark:text-slate-400 mb-2">
							Didn't receive the code?
						</p>
						<button
							type="button"
							onclick={resendCode}
							disabled={isLoading || resendCooldown > 0}
							class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
						>
							{#if isLoading}
								Sending...
							{:else if resendCooldown > 0}
								Resend in {resendCooldown}s
							{:else}
								Resend Code
							{/if}
						</button>
					</div>
					
					<!-- Back to Register -->
					<div class="text-center">
						<a
							href="/register"
							class="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
						>
							← Back to Registration
						</a>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
