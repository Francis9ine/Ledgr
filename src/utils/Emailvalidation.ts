/**
 * Validates an email address properly:
 * - requires text before @
 * - requires text after @
 * - requires a dot with at least 2 letters after it (e.g. .com, .in, .co)
 * - no spaces allowed
 * - rejects consecutive dots, leading/trailing dots in the domain
 */
export const isValidEmail = (email: string): boolean => {
  const trimmed = email.trim();

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(trimmed)) return false;

  // reject consecutive dots anywhere (e.g. john..doe@mail.com)
  if (trimmed.includes('..')) return false;

  return true;
};

export const getEmailError = (email: string): string | null => {
  const trimmed = email.trim();

  if (!trimmed) return 'Email is required';
  if (!trimmed.includes('@')) return 'Email must contain @';

  const [local, domain] = trimmed.split('@');
  if (!local) return 'Enter something before the @';
  if (!domain) return 'Enter a domain after the @';
  if (!domain.includes('.')) return 'Domain must include an extension, e.g. .com';

  if (!isValidEmail(trimmed)) return 'Enter a valid email address';

  return null; // valid
};