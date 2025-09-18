import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import { verificationTokens } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const email = url.searchParams.get('email');
    
    if (!email) {
      return json({ error: 'Email parameter is required' }, { status: 400 });
    }

    // Get all tokens for this email
    const tokens = await db.query.verificationTokens.findMany({
      where: eq(verificationTokens.identifier, email),
    });

    // Get password reset tokens specifically
    const passwordResetTokens = tokens.filter(token => token.type === 'password_reset_code');

    return json({
      email,
      allTokens: tokens,
      passwordResetTokens,
      currentTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Debug tokens error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
