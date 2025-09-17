import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  // Check if this is an OAuth callback or direct access
  const provider = url.searchParams.get("provider");
  const callbackUrl = url.searchParams.get("callbackUrl") || "/";

  // For direct access to signin page, redirect to our custom login
  if (!provider) {
    throw redirect(302, "/login");
  }

  // For OAuth flows, let Auth.js handle it but ensure proper redirect
  throw redirect(302, `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
};
