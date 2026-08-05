export function deriveNameFromEmail(email: string): string {
  if (!email || !email.includes('@')) return 'User';
  const localPart = email.split('@')[0];
  // Replace dots, underscores, hyphens, pluses with spaces
  const cleaned = localPart.replace(/[._+-]+/g, ' ').trim();
  if (!cleaned) return 'User';
  // Capitalize each word nicely
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getInitials(name: string): string {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) {
    // If single word like "Fpatra651", take first letter (or first 2 if available and alphabetic)
    const word = parts[0];
    if (word.length >= 2 && /[a-zA-Z]/.test(word[1])) {
      return (word[0] + word[1]).toUpperCase();
    }
    return word[0].toUpperCase();
  }
  // If first and last name e.g. "Alex Morgan" -> "AM"
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}

export function formatCurrency(amount: number, currencyStr: string = 'INR (₹)'): string {
  const isINR = currencyStr.includes('INR') || currencyStr.includes('₹');
  const symbol = isINR ? '₹' : currencyStr.includes('EUR') ? '€' : currencyStr.includes('GBP') ? '£' : '$';
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);

  try {
    if (isINR) {
      // Indian numbering format (e.g. 1,24,592.00)
      const formatted = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(absVal);
      return `${isNegative ? '-' : ''}${symbol}${formatted}`;
    } else {
      const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(absVal);
      return `${isNegative ? '-' : ''}${symbol}${formatted}`;
    }
  } catch {
    return `${isNegative ? '-' : ''}${symbol}${absVal.toFixed(2)}`;
  }
}
