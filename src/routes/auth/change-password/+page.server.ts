import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  // Redirect to login if not authenticated
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  // Return user data for the page
  return {
    user: locals.user,
  };
};
