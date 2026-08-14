// Singlish to Sinhala Phonetic Transliteration Engine for ZAYEA X

interface RuleMap {
  [key: string]: string;
}

// Special clusters & composite sounds
const SPECIAL_WORDS: RuleMap = {
  shri: 'ශ්‍රී',
  dharmaya: 'ධර්මය',
  karunakarala: 'කරුණාකරලා',
  oyaata: 'ඔයාට',
  oyata: 'ඔයාට',
  kohomada: 'කොහොමද',
  subha: 'සුභ',
  sthuthi: 'ස්තූතියි',
  sthutiyi: 'ස්තූතියි',
  bohoma: 'බොහෝම',
  ayubowan: 'ආයුබෝවන්',
  api: 'අපි',
  mama: 'මම',
  mata: 'මට',
  monawada: 'මොනවද',
  mokakda: 'මොකක්ද',
  ow: 'ඔව්',
  naa: 'නෑ',
  hari: 'හරි',
  godak: 'ගොඩක්',
  lassana: 'ලස්සන',
};

// Consonant clusters
const CONSONANTS: RuleMap = {
  nndh: 'ඳ',
  nnd: 'ඬ',
  nng: 'ඟ',
  mmb: 'ඹ',
  kkh: 'ක්ඛ',
  tth: 'ත්ථ',
  pph: 'ප්ඵ',
  ggh: 'ග්ඝ',
  ddh: 'ද්ධ',
  bbh: 'බ්භ',
  nch: 'ඤ',
  ndh: 'ඳ',
  ng: 'ඟ',
  th: 'ත',
  dh: 'ද',
  Th: 'ථ',
  Dh: 'ධ',
  ch: 'ච',
  Ch: 'ඡ',
  ph: 'ෆ',
  sh: 'ශ',
  Sh: 'ෂ',
  kh: 'ඛ',
  gh: 'ඝ',
  zh: 'ඣ',
  bh: 'භ',
  jh: 'ඣ',
  ny: 'ඥ',
  kn: 'ක්න',
  gn: 'ග්න',
  k: 'ක',
  g: 'ග',
  t: 'ට',
  d: 'ඩ',
  T: 'ඨ',
  D: 'ඪ',
  n: 'න',
  N: 'ණ',
  p: 'ප',
  b: 'බ',
  m: 'ම',
  y: 'ය',
  r: 'ර',
  l: 'ල',
  L: 'ළ',
  v: 'ව',
  w: 'ව',
  s: 'ස',
  S: 'ශ',
  h: 'හ',
  f: 'ෆ',
  j: 'ජ',
  J: 'ඣ',
  c: 'ච',
  x: 'ක්ස්',
  z: 'ස්',
};

// Vowel modifiers applied after a consonant
const VOWEL_MODIFIERS: RuleMap = {
  aae: 'ෑ',
  aee: 'ෑ',
  aa: 'ා',
  ae: 'ැ',
  a: '',
  ii: 'ී',
  ee: 'ී',
  i: 'ි',
  e: 'ෙ',
  ea: 'ේ',
  ei: 'ේ',
  uu: 'ූ',
  oo: 'ෝ',
  u: 'ු',
  o: 'ො',
  oe: 'ෝ',
  au: 'ෞ',
  ou: 'ෞ',
  ai: 'ෛ',
};

// Standalone vowels at the start of a syllable
const STANDALONE_VOWELS: RuleMap = {
  aae: 'ඈ',
  aee: 'ඈ',
  aa: 'ආ',
  ae: 'ඇ',
  a: 'අ',
  ii: 'ඊ',
  ee: 'ඊ',
  i: 'ඉ',
  ea: 'ඒ',
  ei: 'ඒ',
  e: 'එ',
  uu: 'ඌ',
  oo: 'ඕ',
  u: 'උ',
  oe: 'ඕ',
  o: 'ඔ',
  au: 'ඖ',
  ou: 'ඖ',
  ai: 'ඓ',
};

export function convertSinglishToSinhala(input: string): string {
  if (!input) return '';

  let words = input.split(/(\s+|[.,!?;:()\[\]{}"'\/\\])/);
  let output = '';

  for (const token of words) {
    if (!token || /^\s+$/.test(token) || /^[.,!?;:()\[\]{}"'\/\\]+$/.test(token)) {
      output += token;
      continue;
    }

    const lowerToken = token.toLowerCase();
    if (SPECIAL_WORDS[lowerToken]) {
      output += SPECIAL_WORDS[lowerToken];
      continue;
    }

    output += parseWord(token);
  }

  return output;
}

function parseWord(word: string): string {
  let res = '';
  let i = 0;
  const len = word.length;

  while (i < len) {
    // 1. Check for 4, 3, 2, or 1 character consonant match
    let matchConsonant = '';
    let consLen = 0;

    for (let l = 4; l >= 1; l--) {
      if (i + l <= len) {
        const sub = word.substring(i, i + l);
        if (CONSONANTS[sub]) {
          matchConsonant = CONSONANTS[sub];
          consLen = l;
          break;
        }
      }
    }

    if (matchConsonant) {
      i += consLen;

      // 2. Now check if followed by a vowel modifier
      let matchVowelMod = '';
      let vowelLen = 0;

      for (let vl = 3; vl >= 1; vl--) {
        if (i + vl <= len) {
          const vSub = word.substring(i, i + vl);
          if (VOWEL_MODIFIERS[vSub] !== undefined) {
            matchVowelMod = VOWEL_MODIFIERS[vSub];
            vowelLen = vl;
            break;
          }
        }
      }

      if (vowelLen > 0) {
        res += matchConsonant + matchVowelMod;
        i += vowelLen;
      } else {
        // No vowel follows -> Hal-lakuna (Al-lakuna) e.g. k -> ක්
        res += matchConsonant + '්';
      }
    } else {
      // Check for standalone vowel
      let matchStandaloneVowel = '';
      let sVowelLen = 0;

      for (let vl = 3; vl >= 1; vl--) {
        if (i + vl <= len) {
          const vSub = word.substring(i, i + vl);
          if (STANDALONE_VOWELS[vSub]) {
            matchStandaloneVowel = STANDALONE_VOWELS[vSub];
            sVowelLen = vl;
            break;
          }
        }
      }

      if (matchStandaloneVowel) {
        res += matchStandaloneVowel;
        i += sVowelLen;
      } else {
        // Unknown character or symbol, just append as is
        res += word[i];
        i++;
      }
    }
  }

  return res;
}

// Quick suggestions for current Singlish word
export function getSinglishWordSuggestions(currentWord: string): string[] {
  if (!currentWord || currentWord.trim().length === 0) return [];
  const sinhala = convertSinglishToSinhala(currentWord);
  const lower = currentWord.toLowerCase();

  const suggestions: string[] = [sinhala];

  if (SPECIAL_WORDS[lower] && SPECIAL_WORDS[lower] !== sinhala) {
    suggestions.push(SPECIAL_WORDS[lower]);
  }

  // Add variations if common
  if (lower.endsWith('a')) {
    suggestions.push(convertSinglishToSinhala(currentWord + 'a')); // lengthened
  }
  if (lower.startsWith('o')) {
    suggestions.push('ඔයා');
  }
  if (lower.startsWith('m')) {
    suggestions.push('මම', 'මට');
  }
  if (lower.startsWith('s')) {
    suggestions.push('සුභ පැතුම්', 'ස්තූතියි');
  }

  return Array.from(new Set(suggestions)).slice(0, 5);
}
