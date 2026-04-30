declare global {
	namespace App {
		interface Platform {
			env: {
				SEED_KV: KVNamespace;
				APP_PASSWORD: string;
				COOKIE_SECRET: string;
			};
			context: { waitUntil(promise: Promise<unknown>): void };
			caches: CacheStorage & { default: Cache };
		}
		interface Locals {
			authed: boolean;
		}
	}
}

export {};
