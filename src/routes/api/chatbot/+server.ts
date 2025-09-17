import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
  // Check if user is authenticated
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return json({ error: "Message is required" }, { status: 400 });
    }

    // TODO: Implement Gemini AI integration
    // For now, return a placeholder response
    const response = {
      message: `I received your message: "${message}". The Gemini AI integration will be implemented soon!`,
      timestamp: new Date().toISOString(),
    };

    return json(response);
  } catch (error) {
    console.error("Chatbot API error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
