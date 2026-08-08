// src/utils/Emailvalidation.ts

/**
 * Structural format check:
 * - requires text before @
 * - requires text after @
 * - requires a dot with a valid extension (e.g. .com, .in, .co)
 * - rejects consecutive dots
 */
export const isValidEmail = (email: string): boolean => {
  const trimmed = email.trim();

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(trimmed)) return false;
  if (trimmed.includes('..')) return false;

  return true;
};

/**
 * Synchronous format-only check (fast, no network).
 * Use this for on-blur / on-type feedback.
 */
export const getEmailError = (email: string): string | null => {
  const trimmed = email.trim();

  if (!trimmed) return 'Email is required';
  if (!trimmed.includes('@')) return 'Email must contain @';

  const [local, domain] = trimmed.split('@');
  if (!local) return 'Enter something before the @';
  if (!domain) return 'Enter a domain after the @';
  if (!domain.includes('.')) return 'Domain must include an extension, e.g. .com';

  if (!isValidEmail(trimmed)) return 'Enter a valid email address';

  return null; // valid format
};

/**
 * Real-domain check using Google's public DNS-over-HTTPS API.
 * Confirms the domain has mail servers (MX records) configured —
 * catches typo/fake domains like "sddfaf.com" that pass format checks
 * but can't actually receive email.
 *
 * Pure client-side fetch — no backend, works fine on GitHub Pages.
 * Note: this confirms the DOMAIN can receive mail, not that the
 * specific mailbox (e.g. "asdfaa@") exists. Only real verification
 * (sending a code/link) can confirm that.
 */
export const checkDomainHasMailServer = async (email: string): Promise<boolean> => {
  const domain = email.trim().split('@')[1];
  if (!domain) return false;

  try {
    const response = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`
    );
    const data = await response.json();

    // Status 0 = NOERROR, Answer array present = MX records exist
    return data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    // If the DNS check itself fails (network issue), don't block the user —
    // fall back to allowing it through on format validity alone.
    return true;
  }
};

/**
 * Full async check combining format + real domain validation.
 * Returns an error message, or null if the email is good to use.
 */
export const validateEmailFully = async (email: string): Promise<string | null> => {
  const formatError = getEmailError(email);
  if (formatError) return formatError;

  const domainIsReal = await checkDomainHasMailServer(email);
  if (!domainIsReal) {
    return "This email domain doesn't seem to accept mail. Check for typos.";
  }

  return null; // fully valid
};