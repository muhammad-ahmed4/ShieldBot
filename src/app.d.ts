// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('@auth/core/types').User | null;
			session: import('@auth/core/types').Session | null;
			getSession(): Promise<import('@auth/core/types').Session | null>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
