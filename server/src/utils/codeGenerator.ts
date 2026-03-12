const ADJECTIVES = [
  "BRAVE", "SWIFT", "WILD", "COOL", "EPIC", "LUCKY", "HAPPY", "SUNNY",
  "BOLD", "CALM", "CUTE", "DARK", "EASY", "FAST", "GOOD", "HIGH",
  "IRON", "JADE", "KIND", "LIME", "MEGA", "NEON", "OPEN", "PURE",
  "QUAD", "ROSY", "SAGE", "TEAL", "ULTRA", "VIVID", "WARM", "ZESTY"
];

const ANIMALS = [
  "BEAR", "WOLF", "HAWK", "LION", "DEER", "FROG", "CRAB", "DUCK",
  "FISH", "GOAT", "HARE", "IBIS", "KITE", "LYNX", "MINK", "NEWT",
  "ORCA", "PUMA", "QUAIL", "RAVEN", "SEAL", "TOAD", "VOLE", "WREN"
];

export function generateRoomCode(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}-${animal}-${num}`;
}
