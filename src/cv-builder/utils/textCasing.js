/**
 * Text casing utilities for CV form fields.
 */

const TITLE_LOWERCASE_WORDS = [
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in',
  'into', 'nor', 'of', 'on', 'or', 'the', 'to', 'with', 'vs', 'via'
];

const KEEP_UPPERCASE = [
  'CEO', 'CTO', 'CFO', 'COO', 'CIO', 'VP', 'EVP', 'SVP',
  'HR', 'IT', 'PR', 'QA', 'UX', 'UI', 'BA', 'BS', 'MS', 'PhD', 'MBA',
  'API', 'CSS', 'HTML', 'JS', 'JSON', 'PHP', 'SQL', 'XML', 'AWS', 'GCP',
  'iOS', 'macOS', 'iPhone', 'iPad', 'eBay', 'PayPal', 'YouTube',
  'USA', 'UK', 'UAE', 'EU', 'NGO', 'NYSC',
  'PMP', 'CPA', 'CFA', 'NIN', 'BVN', 'LGA',
];

function needsCasingFix(str) {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (!trimmed) return false;
  if (trimmed === trimmed.toLowerCase()) return true;
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) return true;
  return false;
}

export function toTitleCase(str) {
  if (!str || typeof str !== 'string') return str;
  return str.trim().toLowerCase().split(/\s+/).map((word, index) => {
    if (!word) return word;
    const upperMatch = KEEP_UPPERCASE.find((k) => k.toLowerCase() === word.toLowerCase());
    if (upperMatch) return upperMatch;
    if (index !== 0 && TITLE_LOWERCASE_WORDS.includes(word)) return word;
    if (word.includes('-')) {
      return word.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('-');
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

export function toSentenceCase(str) {
  if (!str || typeof str !== 'string') return str;
  let result = str.trim();
  if (!result) return str;
  result = result.charAt(0).toUpperCase() + result.slice(1);
  result = result.replace(/([.!?]\s+|\n\s*)([a-z])/g, (m, p, l) => p + l.toUpperCase());
  result = result.replace(/\bi\b/g, 'I');
  result = result.replace(/\bi'(m|ve|ll|d|s)\b/gi, (m, s) => "I'" + s.toLowerCase());
  return result;
}

export function toLowerCase(str) {
  if (!str || typeof str !== 'string') return str;
  return str.trim().toLowerCase();
}

export function toUrlFormat(str) {
  if (!str || typeof str !== 'string') return str;
  return str.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/**
 * NEW — Title-case each item in a comma-separated list.
 * "javascript, react, node" → "JavaScript, React, Node"
 * Also handles newline-separated and semicolon-separated.
 */
export function toCommaListTitleCase(str) {
  if (!str || typeof str !== 'string') return str;

  // Detect separator priority: newline > semicolon > comma
  const separator = str.includes('\n') ? '\n' : (str.includes(';') ? ';' : ',');

  return str
    .split(separator)
    .map((item) => {
      const trimmed = item.trim();
      if (!trimmed) return '';

      // Check for KEEP_UPPERCASE matches first (whole item)
      const upperMatch = KEEP_UPPERCASE.find(
        (k) => k.toLowerCase() === trimmed.toLowerCase()
      );
      if (upperMatch) return upperMatch;

      // Otherwise apply title case to the item
      return toTitleCase(trimmed);
    })
    .join(separator === '\n' ? '\n' : separator + ' ')
    // Clean up double-spaces from split-rejoin
    .replace(/,\s+/g, ', ')
    .replace(/;\s+/g, '; ');
}

/**
 * NEW — Live first-letter capitalization (called on every keystroke).
 * Only fixes the very first character if lowercase. Doesn't touch the rest.
 */
export function liveCapitalizeFirst(value) {
  if (!value || typeof value !== 'string') return value;
  if (value.length === 0) return value;

  // If first character is lowercase letter, capitalize it
  const firstChar = value.charAt(0);
  if (firstChar >= 'a' && firstChar <= 'z') {
    return firstChar.toUpperCase() + value.slice(1);
  }
  return value;
}

/**
 * NEW — Live capitalize-after-period (for long-form text like summary).
 * Capitalizes first letter after ". " or "! " or "? "
 * Also auto-capitalizes "i" → "I" when followed by space or apostrophe.
 */
export function liveCapitalizeSentences(value) {
  if (!value || typeof value !== 'string') return value;
  let result = value;

  // First letter of the whole string
  if (result.length > 0) {
    const firstChar = result.charAt(0);
    if (firstChar >= 'a' && firstChar <= 'z') {
      result = firstChar.toUpperCase() + result.slice(1);
    }
  }

  // After period/exclamation/question + space
  result = result.replace(/([.!?]\s)([a-z])/g, (m, punct, letter) => {
    return punct + letter.toUpperCase();
  });

  // After newline
  result = result.replace(/(\n\s*)([a-z])/g, (m, nl, letter) => {
    return nl + letter.toUpperCase();
  });

  // Standalone "i" with space after → "I"
  result = result.replace(/(\s|^)i(\s|'|$)/g, (m, before, after) => {
    return before + 'I' + after;
  });

  return result;
}

/**
 * Universal smart formatter for blur events.
 */
export function smartCase(currentValue, fieldKey, setter) {
  if (!currentValue || !needsCasingFix(currentValue)) return;

  const f = (fieldKey || '').toLowerCase();
  let formatted;

  if (f.includes('email')) {
    formatted = toLowerCase(currentValue);
  }
  else if (f.includes('linkedin') || f.includes('website') ||
           f.includes('github') || f.includes('twitter') ||
           f.includes('url') || f.includes('portfolio')) {
    formatted = toUrlFormat(currentValue);
  }
  else if (f.includes('phone') || f.includes('nin') ||
           f.includes('password') || f.includes('date')) {
    return;
  }
  // Comma-separated lists: skills, languages, certifications, hobbies
  else if (f.includes('skills') || f.includes('languages') ||
           f.includes('certifications') || f.includes('hobbies')) {
    formatted = toCommaListTitleCase(currentValue);
  }
  // Long-form text → sentence case
  else if (f.includes('summary') || f.includes('objective') ||
           f.includes('description') || f.includes('responsibilit')) {
    formatted = toSentenceCase(currentValue);
  }
  // Default → title case
  else {
    formatted = toTitleCase(currentValue);
  }

  if (formatted !== currentValue) {
    setter(formatted);
  }
}

/**
 * NEW — Live title case (capitalize each word as user types).
 * Used for: Job Title, Company, School, Degree, City, Country, etc.
 *
 * Smart logic:
 * - Capitalizes the start of each word
 * - But ONLY captures words after a SPACE (not mid-word)
 * - So "software" → "Software", then "software e" → "Software E", "software engineer" → "Software Engineer"
 * - Does NOT capitalize while user is mid-typing a word
 */
export function liveTitleCase(value) {
  if (!value || typeof value !== 'string') return value;
  if (value.length === 0) return value;

  // Capitalize the very first character if lowercase
  let result = value;
  if (result.charAt(0) >= 'a' && result.charAt(0) <= 'z') {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }

  // Capitalize letter that comes right after a space (but not connector words like "of", "and")
  // We use a regex that matches a space followed by a lowercase letter
  result = result.replace(/(\s)([a-z])(\w*)/g, (match, space, firstLetter, rest) => {
    const fullWord = (firstLetter + rest).toLowerCase();

    // Skip connector words (the/of/and/etc.)
    if (TITLE_LOWERCASE_WORDS.includes(fullWord)) {
      return space + fullWord;
    }

    // Skip if the word is a known abbreviation that should stay uppercase
    const upperMatch = KEEP_UPPERCASE.find(
      (k) => k.toLowerCase() === fullWord
    );
    if (upperMatch) return space + upperMatch;

    return space + firstLetter.toUpperCase() + rest;
  });

  // Handle hyphenated words (e.g. "self-employed" → "Self-Employed")
  result = result.replace(/(-)([a-z])/g, (match, dash, letter) => {
    return dash + letter.toUpperCase();
  });

  return result;
}

/**
 * NEW — Live comma-list title case (for skills, hobbies, languages).
 * Capitalizes the first letter of each comma-separated item AS USER TYPES.
 *
 * Behavior:
 * - "reading" → "Reading"
 * - "reading, travel" → "Reading, Travel"
 * - "reading, travel, singing" → "Reading, Travel, Singing"
 * - Newline-separated also works: "Reading\nFootball"
 * - Respects KEEP_UPPERCASE: "javascript, react, html, css" → "JavaScript, React, HTML, CSS"
 */
export function liveCommaListTitleCase(value) {
  if (!value || typeof value !== 'string') return value;
  if (value.length === 0) return value;

  // Detect separator: newline > comma > semicolon
  const hasNewline = value.includes('\n');
  const hasComma = value.includes(',');
  const hasSemicolon = value.includes(';');

  if (!hasNewline && !hasComma && !hasSemicolon) {
    // Single item — just title-case the first letter
    return liveTitleCase(value);
  }

  // Split by ALL separators while preserving them
  // We use a regex with capture groups to keep separators in the result
  const parts = value.split(/([,;\n])/);

  return parts.map((part, index) => {
    // Skip the separator characters
    if (part === ',' || part === ';' || part === '\n') return part;

    // Process the actual content
    const trimmed = part.trim();
    if (!trimmed) return part;

    // Detect leading whitespace to preserve it
    const leadingSpace = part.match(/^\s*/)[0];
    const trailingSpace = part.match(/\s*$/)[0];

    // Check KEEP_UPPERCASE first (e.g., "html" → "HTML", "css" → "CSS")
    const upperMatch = KEEP_UPPERCASE.find(
      (k) => k.toLowerCase() === trimmed.toLowerCase()
    );
    if (upperMatch) {
      return leadingSpace + upperMatch + trailingSpace;
    }

    // Apply title case — capitalize first letter of each word in this item
    const titleCased = trimmed
      .split(/\s+/)
      .map((word, i) => {
        if (!word) return word;
        const upperWord = KEEP_UPPERCASE.find(
          (k) => k.toLowerCase() === word.toLowerCase()
        );
        if (upperWord) return upperWord;
        if (i !== 0 && TITLE_LOWERCASE_WORDS.includes(word.toLowerCase())) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');

    return leadingSpace + titleCased + trailingSpace;
  }).join('');
}