/**
 * Authentic Khmer Calendar & Date/Time Formatting Utilities
 * Converts standard dates and Gregorian calendar numbers into rich Khmer script
 */

const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

const KHMER_DAYS = [
  'ថ្ងៃអាទិត្យ',
  'ថ្ងៃច័ន្ទ',
  'ថ្ងៃអង្គារ',
  'ថ្ងៃពុធ',
  'ថ្ងៃព្រហស្បតិ៍',
  'ថ្ងៃសុក្រ',
  'ថ្ងៃសៅរ៍'
];

const KHMER_MONTHS = [
  'មករា',
  'កុម្ភៈ',
  'មីនា',
  'មេសា',
  'ឧសភា',
  'មិថុនា',
  'កក្កដា',
  'សីហា',
  'កញ្ញា',
  'តុលា',
  'វិច្ឆិកា',
  'ធ្នូ'
];

/**
 * Converts English digits (0-9) to authentic Khmer numerals (០-៩)
 */
export function toKhmerDigits(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[0-9]/g, (digit) => KHMER_DIGITS[Number(digit)]);
}

/**
 * Checks if a string is already formatted in Khmer
 */
export function isKhmerDateString(val) {
  return typeof val === 'string' && (val.includes('ថ្ងៃ') || val.includes('ម៉ោង') || /[\u1780-\u17FF]/.test(val));
}

/**
 * Parses any date input into a valid Date object
 */
function parseDate(dateInput) {
  if (!dateInput) return new Date();
  if (dateInput instanceof Date) return dateInput;
  const parsed = new Date(dateInput);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Formats full Khmer date with day of the week
 * Example: "ថ្ងៃសុក្រ ទី០២ ខែតុលា ឆ្នាំ២០២៦"
 */
export function formatKhmerFullDate(dateInput) {
  if (isKhmerDateString(dateInput)) return dateInput;
  const d = parseDate(dateInput);
  const dayName = KHMER_DAYS[d.getDay()];
  const dayNum = toKhmerDigits(String(d.getDate()).padStart(2, '0'));
  const monthName = KHMER_MONTHS[d.getMonth()];
  const yearNum = toKhmerDigits(d.getFullYear());

  return `${dayName} ទី${dayNum} ខែ${monthName} ឆ្នាំ${yearNum}`;
}

/**
 * Formats Khmer date without day of the week
 * Example: "ថ្ងៃទី០២ ខែតុលា ឆ្នាំ២០២៦"
 */
export function formatKhmerDateOnly(dateInput) {
  if (isKhmerDateString(dateInput)) return dateInput;
  const d = parseDate(dateInput);
  const dayNum = toKhmerDigits(String(d.getDate()).padStart(2, '0'));
  const monthName = KHMER_MONTHS[d.getMonth()];
  const yearNum = toKhmerDigits(d.getFullYear());

  return `ថ្ងៃទី${dayNum} ខែ${monthName} ឆ្នាំ${yearNum}`;
}

/**
 * Formats short Khmer date
 * Example: "០២ តុលា ២០២៦"
 */
export function formatKhmerShortDate(dateInput) {
  if (isKhmerDateString(dateInput)) return dateInput;
  const d = parseDate(dateInput);
  const dayNum = toKhmerDigits(String(d.getDate()).padStart(2, '0'));
  const monthName = KHMER_MONTHS[d.getMonth()];
  const yearNum = toKhmerDigits(d.getFullYear());

  return `${dayNum} ${monthName} ${yearNum}`;
}

/**
 * Formats live time in Khmer with periods (ព្រឹក, រសៀល, ល្ងាច, យប់)
 * Example: "ម៉ោង ០៤:៥២:១០ រសៀល"
 */
export function formatKhmerTime(dateInput, includeSeconds = true) {
  if (typeof dateInput === 'string' && dateInput.includes('ម៉ោង')) return dateInput;
  const d = parseDate(dateInput);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  // Determine Khmer day period
  let period = 'ព្រឹក'; // AM
  if (hours >= 12 && hours < 17) {
    period = 'រសៀល'; // Afternoon
  } else if (hours >= 17 && hours < 20) {
    period = 'ល្ងាច'; // Evening
  } else if (hours >= 20 || hours < 5) {
    period = 'យប់'; // Night
  }

  // Convert to 12-hour format
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const hoursStr = toKhmerDigits(String(displayHours).padStart(2, '0'));
  const minutesStr = toKhmerDigits(minutes);
  const secondsStr = toKhmerDigits(seconds);

  if (includeSeconds) {
    return `ម៉ោង ${hoursStr}:${minutesStr}:${secondsStr} ${period}`;
  }
  return `ម៉ោង ${hoursStr}:${minutesStr} ${period}`;
}

/**
 * Formats combined Khmer date and time
 * Example: "ថ្ងៃទី០២ ខែតុលា ឆ្នាំ២០២៦ • ម៉ោង ០៤:៥២ រសៀល"
 */
export function formatKhmerDateTime(dateInput) {
  if (isKhmerDateString(dateInput)) return dateInput;
  return `${formatKhmerDateOnly(dateInput)} • ${formatKhmerTime(dateInput, false)}`;
}
