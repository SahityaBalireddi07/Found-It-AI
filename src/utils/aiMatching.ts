import { Item, MatchResult, MatchScoreFactors } from '../types';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of',
  'my', 'i', 'me', 'we', 'our', 'is', 'it', 'its', 'was', 'are', 'be', 'has', 'have',
  'had', 'left', 'found', 'lost', 'behind', 'item', 'please', 'help', 'someone',
  'anyone', 'near', 'from', 'this', 'that', 'there', 'here', 'into', 'turned', 'looks'
]);

const SYNONYM_GROUPS: string[][] = [
  ['airpods', 'earbuds', 'headphones', 'earphones', 'airpod', 'buds', 'airpodspro'],
  ['bottle', 'flask', 'tumbler', 'hydroflask', 'hydro', 'yeti', 'thermos', 'waterbottle'],
  ['calculator', 'ti84', 'ti83', 'graphing', 'texasinstruments'],
  ['keys', 'key', 'keychain', 'fob', 'keyfob', 'lanyard', 'keyring'],
  ['wallet', 'purse', 'cardholder', 'billfold', 'bifold', 'moneyclip'],
  ['id', 'badge', 'studentcard', 'campuscard', 'card', 'accesspass'],
  ['laptop', 'macbook', 'computer', 'chromebook', 'pc', 'notebook'],
  ['jacket', 'fleece', 'sweater', 'hoodie', 'coat', 'zipup', 'sweatshirt'],
  ['backpack', 'bag', 'tote', 'knapsack', 'bookbag', 'pack'],
  ['glasses', 'sunglasses', 'spectacles', 'shades', 'frames'],
  ['phone', 'iphone', 'smartphone', 'android', 'samsung', 'pixel'],
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

function expandSynonyms(tokens: string[]): Set<string> {
  const expanded = new Set<string>(tokens);
  for (const token of tokens) {
    for (const group of SYNONYM_GROUPS) {
      if (group.some(word => word.includes(token) || token.includes(word))) {
        group.forEach(syn => expanded.add(syn));
      }
    }
  }
  return expanded;
}

function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): { score: number; intersections: string[] } {
  if (setA.size === 0 || setB.size === 0) return { score: 0, intersections: [] };
  
  const intersections: string[] = [];
  for (const elem of setA) {
    if (setB.has(elem)) {
      intersections.push(elem);
    }
  }

  const unionSize = new Set([...setA, ...setB]).size;
  return {
    score: unionSize === 0 ? 0 : intersections.length / unionSize,
    intersections,
  };
}

function calculateDateDifferenceInDays(dateStrA: string, dateStrB: string): number {
  const d1 = new Date(dateStrA).getTime();
  const d2 = new Date(dateStrB).getTime();
  if (isNaN(d1) || isNaN(d2)) return 7;
  const diffDays = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
  return diffDays;
}

export function evaluateItemMatch(itemA: Item, itemB: Item): MatchResult | null {
  // We match Lost with Found
  if (itemA.type === itemB.type) return null;

  const lostItem = itemA.type === 'lost' ? itemA : itemB;
  const foundItem = itemA.type === 'found' ? itemA : itemB;

  // 1. Category Score (0 - 100)
  const categoryScore = lostItem.category === foundItem.category ? 100 : 15;

  // 2. Text Similarity (Tokens from title, description, distinctive features)
  const textA = `${lostItem.name} ${lostItem.description} ${lostItem.distinctiveFeatures || ''}`;
  const textB = `${foundItem.name} ${foundItem.description} ${foundItem.distinctiveFeatures || ''}`;

  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  const rawOverlap = calculateJaccardSimilarity(new Set(tokensA), new Set(tokensB));
  const synSetA = expandSynonyms(tokensA);
  const synSetB = expandSynonyms(tokensB);
  const synOverlap = calculateJaccardSimilarity(synSetA, synSetB);

  // Boost for important title keyword matches
  const titleTokensA = tokenize(lostItem.name);
  const titleTokensB = tokenize(foundItem.name);
  const titleOverlap = calculateJaccardSimilarity(new Set(titleTokensA), new Set(titleTokensB));

  let textSimilarityScore = Math.min(
    100,
    Math.round(
      rawOverlap.score * 70 +
      synOverlap.score * 40 +
      titleOverlap.score * 50
    )
  );

  // Check direct brand/keyword presence (e.g. 'airpods', 'hydro', 'honda', 'ti-84', 'north face')
  const matchedKeywords = Array.from(new Set([...rawOverlap.intersections, ...titleOverlap.intersections]));

  // 3. Location Proximity Score (0 - 100)
  let locationScore = 15;
  if (lostItem.location.toLowerCase() === foundItem.location.toLowerCase()) {
    locationScore = 100;
  } else if (
    lostItem.location.toLowerCase().includes(foundItem.location.toLowerCase()) ||
    foundItem.location.toLowerCase().includes(lostItem.location.toLowerCase())
  ) {
    locationScore = 80;
  }

  // 4. Date Proximity Score (0 - 100)
  const daysDiff = calculateDateDifferenceInDays(lostItem.date, foundItem.date);
  let dateProximityScore = 20;
  if (daysDiff <= 1) {
    dateProximityScore = 100;
  } else if (daysDiff <= 3) {
    dateProximityScore = 80;
  } else if (daysDiff <= 7) {
    dateProximityScore = 55;
  } else if (daysDiff <= 14) {
    dateProximityScore = 35;
  }

  // Weighted overall calculation
  // Category (25%), Text (45%), Location (20%), Date (10%)
  let weighted =
    categoryScore * 0.25 +
    textSimilarityScore * 0.45 +
    locationScore * 0.20 +
    dateProximityScore * 0.10;

  // Penalty if category doesn't match and text similarity is low
  if (categoryScore < 50 && textSimilarityScore < 40) {
    weighted = Math.min(weighted, 25);
  }

  const overallScore = Math.round(Math.max(0, Math.min(100, weighted)));

  // Minimum threshold to consider a possible match
  if (overallScore < 40) {
    return null;
  }

  let confidenceLevel: 'High' | 'Medium' | 'Low' = 'Low';
  if (overallScore >= 75) {
    confidenceLevel = 'High';
  } else if (overallScore >= 55) {
    confidenceLevel = 'Medium';
  }

  // Formulate clear, transparent explanation
  const explanationParts: string[] = [];
  
  if (categoryScore === 100) {
    explanationParts.push(`Identical category (${lostItem.category})`);
  }

  if (matchedKeywords.length > 0) {
    const previewWords = matchedKeywords.slice(0, 4).join(', ');
    explanationParts.push(`Shared descriptive terms: "${previewWords}"`);
  } else if (textSimilarityScore > 40) {
    explanationParts.push('Strong thematic similarity in item descriptions');
  }

  if (locationScore >= 80) {
    explanationParts.push(`Reported in the same campus zone (${lostItem.location})`);
  }

  if (daysDiff <= 1) {
    explanationParts.push('Reported within 24 hours of each other');
  } else if (daysDiff <= 3) {
    explanationParts.push(`Reported within ${Math.ceil(daysDiff)} days of each other`);
  }

  const explanation = explanationParts.length > 0
    ? explanationParts.join(' · ') + '.'
    : 'Moderate correlation across item attributes and campus timing.';

  const factors: MatchScoreFactors = {
    categoryScore,
    textSimilarityScore,
    locationScore,
    dateProximityScore,
  };

  return {
    lostItem,
    foundItem,
    overallScore,
    confidenceLevel,
    explanation,
    factors,
    matchedKeywords,
  };
}

export function findMatchesForItem(targetItem: Item, allItems: Item[]): MatchResult[] {
  const matches: MatchResult[] = [];

  for (const item of allItems) {
    if (item.id === targetItem.id) continue;
    if (item.type === targetItem.type) continue;
    if (item.status === 'reunited') continue;

    const result = evaluateItemMatch(targetItem, item);
    if (result) {
      matches.push(result);
    }
  }

  return matches.sort((a, b) => b.overallScore - a.overallScore);
}

export function findAllCampusMatches(items: Item[]): MatchResult[] {
  const activeItems = items.filter(i => i.status !== 'reunited');
  const lostItems = activeItems.filter(i => i.type === 'lost');
  const foundItems = activeItems.filter(i => i.type === 'found');

  const allMatches: MatchResult[] = [];

  for (const lost of lostItems) {
    for (const found of foundItems) {
      const match = evaluateItemMatch(lost, found);
      if (match) {
        allMatches.push(match);
      }
    }
  }

  return allMatches.sort((a, b) => b.overallScore - a.overallScore);
}
