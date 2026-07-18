export function extractAndValidateMeetingCode(inputVal: string): string | null {
  const val = inputVal.trim();
  if (!val) return null;

  // Extract from invite link /meeting/123-4567-890 or /join?code=123-4567-890
  let candidate = val;
  const urlMatch = val.match(/\/meeting\/([a-zA-Z0-9-]+)/);
  const codeMatch = val.match(/[?&]code=([a-zA-Z0-9-]+)/);
  if (urlMatch) {
    candidate = urlMatch[1];
  } else if (codeMatch) {
    candidate = codeMatch[1];
  }

  // Validate the code: standard XXX-XXXX-XXX or 10 digits XXXXXXXXXX
  const standardRegex = /^\d{3}-\d{4}-\d{3}$/;
  const digitRegex = /^\d{10}$/;

  if (standardRegex.test(candidate)) {
    return candidate;
  } else if (digitRegex.test(candidate)) {
    // Format to XXX-XXXX-XXX
    return `${candidate.slice(0, 3)}-${candidate.slice(3, 7)}-${candidate.slice(7)}`;
  }

  return null;
}
