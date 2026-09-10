import { Garment } from '../types';

export type GarmentRole = 'top' | 'bottom' | 'fullBody' | 'shoes' | 'outerwear' | 'accessory' | 'other';

export interface GarmentClassification {
  garment: Garment;
  role: GarmentRole;
  roleLabel: string;
}

export interface GeneratedOutfitResult {
  success: boolean;
  garments: Garment[];
  suggestedName: string;
  explanation: {
    structureRule: string;
    colorRule: string;
    summary: string;
  };
  missingRequirements?: string[];
  countsByRole: {
    tops: number;
    bottoms: number;
    fullBodies: number;
    shoes: number;
    outerwear: number;
    accessories: number;
  };
}

/**
 * Classifies a garment into a functional clothing role based on type keywords and iconKey.
 */
export function getGarmentRole(garment: Garment): GarmentRole {
  const typeLower = (garment.type || '').toLowerCase().trim();
  const iconKey = garment.iconKey;

  // 1. Text-based detection for accuracy
  if (/vestido|mono|enterizo|jumpsuit|overol/.test(typeLower)) {
    return 'fullBody';
  }
  if (/pantal[oó]n|jean|vaquero|short|bermuda|falda|legging|jogger/.test(typeLower)) {
    return 'bottom';
  }
  if (/camisa|camiseta|top|blusa|su[eé]ter|sudadera|hoodie|polo|jersey|remera|playera|chaleco/.test(typeLower)) {
    return 'top';
  }
  if (/zapato|zapatilla|sneaker|bota|bot[ií]n|sandalia|mocas[ií]n|tac[oó]n|calzado/.test(typeLower)) {
    return 'shoes';
  }
  if (/chaqueta|abrigo|cazadora|blazer|chamarra|gabardina|cardigan|sobrecamisa|parka/.test(typeLower)) {
    return 'outerwear';
  }
  if (/accesorio|bufanda|gorra|sombrero|cintur[oó]n|bolso|cartera|collar|reloj|gafas|lentes/.test(typeLower)) {
    return 'accessory';
  }

  // 2. Icon-based fallback
  if (iconKey === 'dress') return 'fullBody';
  if (iconKey === 'pants') return 'bottom';
  if (iconKey === 'shirt') return 'top';
  if (iconKey === 'shoes') return 'shoes';
  if (iconKey === 'jacket') return 'outerwear';
  if (iconKey === 'accessory') return 'accessory';

  return 'top';
}

export function getRoleLabel(role: GarmentRole): string {
  switch (role) {
    case 'top':
      return 'Prenda superior';
    case 'bottom':
      return 'Prenda inferior';
    case 'fullBody':
      return 'Cuerpo entero';
    case 'shoes':
      return 'Calzado';
    case 'outerwear':
      return 'Capa exterior';
    case 'accessory':
      return 'Accesorio';
    default:
      return 'Prenda';
  }
}

/**
 * Identifies if a color is a versatile neutral color.
 */
export function isNeutralColor(colorName: string): boolean {
  const c = colorName.toLowerCase().trim();
  return /negro|blanco|gris|beige|marr[oó]n|marino|denim|crema|crudo|caf[eé]|camel|khaki|arena/.test(c);
}

/**
 * Evaluates color compatibility across selected garments according to styling harmony rules.
 */
export function evaluateColorHarmony(garments: Garment[]): { score: number; rule: string } {
  if (garments.length === 0) return { score: 0, rule: 'Sin prendas' };

  const colors = garments.map((g) => g.color.toLowerCase().trim());
  const neutralCount = colors.filter(isNeutralColor).length;
  const vividCount = colors.length - neutralCount;

  // Case 1: All neutrals (Total black, denim + white, beige + gray, etc.)
  if (vividCount === 0) {
    return {
      score: 95,
      rule: 'Base neutra atemporal: Todos los tonos son neutros combinables (alta armonía y versatilidad).',
    };
  }

  // Case 2: Exactly 1 vivid color with neutral support
  if (vividCount === 1) {
    const vividGarment = garments.find((g) => !isNeutralColor(g.color));
    return {
      score: 90,
      rule: `Acento de color equilibrado: Prenda destacada en ${vividGarment?.color || 'color vivo'} con base neutra de soporte.`,
    };
  }

  // Case 3: Tone-on-tone or matching base color
  const baseWords = colors.map((c) => c.split(' ')[0]);
  const uniqueBases = new Set(baseWords);
  if (uniqueBases.size < baseWords.length) {
    return {
      score: 85,
      rule: 'Armonía tonal: Las prendas comparten familias de color afines.',
    };
  }

  // Case 4: Multiple vivid colors
  return {
    score: 70,
    rule: 'Contraste audaz: Combinación con presencia de colores activos.',
  };
}

/**
 * Main engine: Generates an automatic outfit from wardrobe garments based on predefined logic rules.
 *
 * Rules:
 * 1. Structural Compatibility:
 *    - Formula 1: 1 Top + 1 Bottom (+ optional Shoes, Outerwear, Accessory)
 *    - Formula 2: 1 FullBody (+ optional Shoes, Outerwear, Accessory)
 * 2. Color Balance:
 *    - Scored based on neutral anchor rule and balanced color accents.
 * 3. Diversity:
 *    - Prefers different combinations than previously generated if available.
 */
export function generateAutoOutfit(
  garments: Garment[],
  excludeGarmentIdCombinations: string[][] = []
): GeneratedOutfitResult {
  // 1. Group garments by functional role
  const tops = garments.filter((g) => getGarmentRole(g) === 'top');
  const bottoms = garments.filter((g) => getGarmentRole(g) === 'bottom');
  const fullBodies = garments.filter((g) => getGarmentRole(g) === 'fullBody');
  const shoes = garments.filter((g) => getGarmentRole(g) === 'shoes');
  const outerwear = garments.filter((g) => getGarmentRole(g) === 'outerwear');
  const accessories = garments.filter((g) => getGarmentRole(g) === 'accessory');

  const countsByRole = {
    tops: tops.length,
    bottoms: bottoms.length,
    fullBodies: fullBodies.length,
    shoes: shoes.length,
    outerwear: outerwear.length,
    accessories: accessories.length,
  };

  const hasTwoPieceFormula = tops.length > 0 && bottoms.length > 0;
  const hasFullBodyFormula = fullBodies.length > 0;

  // 2. Check minimum structural requirements
  if (!hasTwoPieceFormula && !hasFullBodyFormula) {
    const missing: string[] = [];
    if (tops.length === 0 && fullBodies.length === 0) {
      missing.push('1 prenda superior (camiseta, camisa, suéter...)');
    }
    if (bottoms.length === 0 && fullBodies.length === 0) {
      missing.push('1 prenda inferior (pantalón, jeans, falda...)');
    }

    return {
      success: false,
      garments: [],
      suggestedName: '',
      explanation: {
        structureRule: 'Requiere al menos 1 prenda superior y 1 inferior (o 1 vestido).',
        colorRule: 'No evaluado.',
        summary: 'Para armar un outfit por reglas lógicas, necesitas al menos prendas compatibles en tu armario.',
      },
      missingRequirements: missing,
      countsByRole,
    };
  }

  // 3. Build candidate combinations
  interface Candidate {
    garments: Garment[];
    structureRule: string;
    colorRule: string;
    score: number;
    signature: string;
  }

  const candidates: Candidate[] = [];

  // Helper to check if a combination signature matches previously excluded sets
  const isExcluded = (candidateGarments: Garment[]) => {
    const ids = candidateGarments.map((g) => g.id).sort().join(',');
    return excludeGarmentIdCombinations.some(
      (prevIds) => prevIds.slice().sort().join(',') === ids
    );
  };

  // Helper to pick best companion item (shoe, jacket, accessory) that harmonizes
  const pickBestCompanion = (pool: Garment[], currentSelection: Garment[]): Garment | null => {
    if (pool.length === 0) return null;
    let bestItem = pool[0];
    let bestScore = -1;

    for (const item of pool) {
      const evaluation = evaluateColorHarmony([...currentSelection, item]);
      let itemScore = evaluation.score;
      if (isNeutralColor(item.color)) itemScore += 10; // Prefer neutral shoes/jackets
      if (itemScore > bestScore) {
        bestScore = itemScore;
        bestItem = item;
      }
    }
    return bestItem;
  };

  // Formula A: Top + Bottom
  if (hasTwoPieceFormula) {
    for (const top of tops) {
      for (const bottom of bottoms) {
        const baseSet = [top, bottom];
        const colorEval = evaluateColorHarmony(baseSet);
        let score = colorEval.score;

        // Structure rule description
        const structureRule = 'Regla 2 piezas: Prenda superior compatible con prenda inferior.';

        // Try adding shoes if available
        const companionShoe = pickBestCompanion(shoes, baseSet);
        const setWithShoe = companionShoe ? [...baseSet, companionShoe] : baseSet;

        // Optionally add jacket if available and harmonizes well
        const companionJacket = pickBestCompanion(outerwear, setWithShoe);
        const finalSet = companionJacket && Math.random() > 0.4 ? [...setWithShoe, companionJacket] : setWithShoe;

        // Bonus if not previously shown
        if (!isExcluded(finalSet)) {
          score += 40;
        }

        candidates.push({
          garments: finalSet,
          structureRule: companionShoe
            ? 'Regla completa: Prenda superior + Prenda inferior + Calzado coordinado.'
            : structureRule,
          colorRule: evaluateColorHarmony(finalSet).rule,
          score,
          signature: finalSet.map((g) => g.id).sort().join(','),
        });
      }
    }
  }

  // Formula B: Full Body (Dress)
  if (hasFullBodyFormula) {
    for (const dress of fullBodies) {
      const baseSet = [dress];
      let score = 85;

      const companionShoe = pickBestCompanion(shoes, baseSet);
      const setWithShoe = companionShoe ? [...baseSet, companionShoe] : baseSet;

      const companionJacket = pickBestCompanion(outerwear, setWithShoe);
      const finalSet = companionJacket && Math.random() > 0.5 ? [...setWithShoe, companionJacket] : setWithShoe;

      if (!isExcluded(finalSet)) {
        score += 40;
      }

      candidates.push({
        garments: finalSet,
        structureRule: companionShoe
          ? 'Regla cuerpo entero: Vestido + Calzado armónico.'
          : 'Regla cuerpo entero: Prenda única de vestimenta.',
        colorRule: evaluateColorHarmony(finalSet).rule,
        score,
        signature: finalSet.map((g) => g.id).sort().join(','),
      });
    }
  }

  // Sort candidates by score descending
  candidates.sort((a, b) => b.score - a.score);

  // Pick one from the top tier (with subtle random variation among best scoring options)
  const topTier = candidates.slice(0, Math.min(5, candidates.length));
  const chosen = topTier[Math.floor(Math.random() * topTier.length)] || candidates[0];

  // Generate an intelligent descriptive name for the outfit
  const mainGarments = chosen.garments.slice(0, 2);
  const nameParts = mainGarments.map((g) => `${g.type} ${g.color}`);
  const suggestedName = nameParts.length > 1
    ? `Look: ${nameParts.join(' + ')}`
    : `Look: ${chosen.garments[0]?.type || 'Outfit'} ${chosen.garments[0]?.color || ''}`.trim();

  return {
    success: true,
    garments: chosen.garments,
    suggestedName: suggestedName.substring(0, 60),
    explanation: {
      structureRule: chosen.structureRule,
      colorRule: chosen.colorRule,
      summary: `Combinación automática seleccionada por compatibilidad de tipos (${chosen.garments.map((g) => g.type).join(', ')}) y armonía cromática.`,
    },
    countsByRole,
  };
}
