export interface WordEntry {
  id: string;
  word: string;
  meaning: string;
  example?: string;
}

/** Actieve subset woorden / uitdrukkingen voor deze sessie. */
export const words: WordEntry[] = [
  {
    id: 'als-een-razende-tekeergaan',
    word: 'als een razende tekeergaan',
    meaning: 'heel hard bewegen',
    example: 'Zijn hart gaat als een razende tekeer.',
  },
  {
    id: 'auteur',
    word: 'de auteur',
    meaning: 'een schrijver of schrijfster',
    example: 'Paul van Loon is de auteur van Dolfje Weerwolfje.',
  },
  {
    id: 'avondschemering',
    word: 'de avondschemering',
    meaning: "de tijd dat de zon 's avonds nog niet helemaal onder is",
    example: 'In de avondschemering kon ik nog net zien dat een kat de schuur in sloop.',
  },
  {
    id: 'behoedzaam',
    word: 'behoedzaam',
    meaning: 'voorzichtig',
    example: 'Om geen geluid te maken, sloop zij behoedzaam de trap op.',
  },
  {
    id: 'desondanks',
    word: 'desondanks',
    meaning: 'toch',
    example: 'Die spin is niet gevaarlijk, maar desondanks ben ik bang.',
  },
  {
    id: 'grimmig',
    word: 'grimmig',
    meaning: 'kwaadaardig, boos',
    example: 'Er heerste een grimmige sfeer nadat de wedstrijd was verloren.',
  },
  {
    id: 'gruwelen',
    word: 'gruwelen',
    meaning: 'een hekel hebben aan; griezelen van',
    example: 'Ik gruwel van insecten.',
  },
  {
    id: 'hachelijk',
    word: 'hachelijk',
    meaning: 'gevaarlijk',
    example: 'Zonder licht fietsen in het donker is een hachelijk avontuur.',
  },
  {
    id: 'koude-rillingen',
    word: 'koude rillingen',
    meaning: 'bibberen van angst',
    example: 'Ik krijg koude rillingen als ik aan dat donkere huis denk.',
  },
  {
    id: 'stressreactie',
    word: 'de stressreactie',
    meaning: 'de reactie van je lichaam als je gestrest bent',
    example: 'Die enge spin wekt een stressreactie bij me op.',
  },
  {
    id: 'bang-voor-eigen-schaduw',
    word: 'bang zijn voor je eigen schaduw',
    meaning: 'overdreven bang zijn',
  },
  {
    id: 'held-op-sokken',
    word: 'een held op sokken',
    meaning: 'wel een grote mond hebben, maar niets durven',
  },
  {
    id: 'stress',
    word: 'de stress',
    meaning: 'druk, spanning',
    example: 'In de buurt komen van iets waar je bang voor bent, geeft veel stress.',
  },
  {
    id: 'controle',
    word: 'de controle',
    meaning: 'de beheersing, dat het gaat zoals jij wilt',
    example: 'Lisa had geen controle meer over zichzelf en begon keihard te gillen.',
  },
];

export const CORRECT_EMOJIS = ['🐟', '😄', '🥳', '🔥', '💪', '⭐', '🏆', '👏', '🦄', '🎸', '🚀', '🌈', '🎯', '😎', '🐬'];
export const WRONG_EMOJIS = ['🦙💨', '💩', '🙈', '😬', '🫠', '🤡', '🐌', '👻', '🧟', '🤪', '🫣', '💀', '🪿'];

export const CORRECT_MESSAGES = [
  'Goed zo!', 'Top!', 'Helemaal goed!', 'Lekker bezig!', 'Taal held!',
  'Knaller!', 'Yes!', 'Nailed it!', 'Bam!', 'Wow!',
];
export const WRONG_MESSAGES = [
  'Helaas!', 'Net niet!', 'Oeps!', 'Jammer!', 'Bijna!',
  'Volgende keer beter!', 'Niet getreurd!', 'Uh oh!',
];

export const JOKES = [
  'Waarom ging het woordenboek naar de dokter?\nHet had te veel betekenissen! 😂',
  'Wat zei het ene woord tegen het andere?\n"Jij betekent veel voor mij!" 🥰',
  'Waarom was de pen verdrietig?\nHij kon zijn woorden niet vinden! 😢✏️',
  'Knock knock!\nWie is daar?\nBetekenis.\nBetekenis wie?\nBetekenis dat je deze game gaat winnen! 🏆',
];

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
