const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

type NewsletterPayload = {
  email: string;
  source?: string;
};

export const isNewsletterDatabaseReady = Boolean(supabaseUrl && supabaseAnonKey);

export const saveNewsletterEmail = async ({ email, source = "website" }: NewsletterPayload) => {
  if (!isNewsletterDatabaseReady) {
    throw new Error("Newsletter database is not connected yet.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/newsletter_subscribers`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      source,
    }),
  });

  if (!response.ok) {
    throw new Error("Could not save this email right now.");
  }
};
