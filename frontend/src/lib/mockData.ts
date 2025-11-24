import { v4 as uuidv4 } from 'uuid';

interface Suggestion {
  id: string;
  term: string;
  type: string;
  reason: string;
  confidence_score: number;
}

// Keys for localStorage
const LS_ADSENSE_RPM = "adsenseRpm";
const LS_ASSUMED_FILL_RATE = "assumedFillRate";
const LS_PROJECTED_IMPRESSIONS_PER_SLOT = "projectedImpressionsPerSlot";

// Default values
const DEFAULT_ADSENSE_RPM = 5; // $5 per 1000 views (mock value)
const DEFAULT_ASSUMED_FILL_RATE = 0.7; // 70% fill rate for sponsorships
const DEFAULT_PROJECTED_IMPRESSIONS_PER_SLOT = 100000; // 100k impressions per accepted slot (mock value)

// Utility functions to get/set values from localStorage
export const getMockAdsenseRpm = (): number => {
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem(LS_ADSENSE_RPM);
    return storedValue ? parseFloat(storedValue) : DEFAULT_ADSENSE_RPM;
  }
  return DEFAULT_ADSENSE_RPM;
};

export const setMockAdsenseRpm = (value: number) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_ADSENSE_RPM, value.toString());
  }
};

export const getMockAssumedFillRate = (): number => {
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem(LS_ASSUMED_FILL_RATE);
    return storedValue ? parseFloat(storedValue) : DEFAULT_ASSUMED_FILL_RATE;
  }
  return DEFAULT_ASSUMED_FILL_RATE;
};

export const setMockAssumedFillRate = (value: number) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_ASSUMED_FILL_RATE, value.toString());
  }
};

export const getMockProjectedImpressionsPerSlot = (): number => {
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem(LS_PROJECTED_IMPRESSIONS_PER_SLOT);
    return storedValue ? parseInt(storedValue, 10) : DEFAULT_PROJECTED_IMPRESSIONS_PER_SLOT;
  }
  return DEFAULT_PROJECTED_IMPRESSIONS_PER_SLOT;
};

export const setMockProjectedImpressionsPerSlot = (value: number) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_PROJECTED_IMPRESSIONS_PER_SLOT, value.toString());
  }
};

// Mock data for AI suggestions based on common commercial terms
const mockCommercialTerms = [
  { term: "coffee", type: "product", reason: "CPG category; high advertiser demand", category: "CPG" },
  { term: "laptop", type: "product", reason: "Tech gadget; frequent product placements", category: "Tech" },
  { term: "kitchen", type: "environment", reason: "Home goods, appliances; lifestyle brands", category: "Home & Living" },
  { term: "office", type: "environment", reason: "Productivity tools, office supplies; B2B/B2C tech", category: "Tech" },
  { term: "wedding", type: "situation", reason: "Event planning, fashion, jewelry; high spend events", category: "Events & Lifestyle" },
  { term: "moving day", type: "situation", reason: "Logistics, home services, furniture; new beginnings", category: "Home & Living" },
  { term: "smartphone", type: "product", reason: "Ubiquitous tech; app integrations, accessories", category: "Tech" },
  { term: "car", type: "product", reason: "Automotive industry; luxury, utility vehicles", category: "Automotive" },
  { term: "restaurant", type: "environment", reason: "Food & beverage, dining experiences; local/chain promotions", category: "Food & Beverage" },
  { term: "travel", type: "situation", reason: "Tourism, airlines, hotels; experience-based marketing", category: "Travel" },
  { term: "running shoes", type: "product", reason: "Athletic wear; fitness, health brands", category: "Apparel & Sports" },
  { term: "book", type: "product", reason: "Publishing, e-readers, audiobooks; educational/entertainment", category: "Media & Entertainment" },
];

export const generateMockSuggestions = async (script: string): Promise<Suggestion[]> => {
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay

  const generated: Suggestion[] = [];
  const scriptLower = script.toLowerCase();

  // Simple keyword matching for demonstration
  mockCommercialTerms.forEach(termData => {
    if (scriptLower.includes(termData.term.toLowerCase())) {
      generated.push({
        id: uuidv4(),
        term: termData.term,
        type: termData.type,
        reason: termData.reason,
        confidence_score: Math.random() * 0.3 + 0.7, // 70-100% confidence
        // @ts-ignore - category is for internal use in budget calc
        category: termData.category,
      });
    }
  });

  // If no matches, provide some generic ones for demonstration
  if (generated.length === 0 && script.length > 100) {
    generated.push({
      id: uuidv4(),
      term: "generic product",
      type: "product",
      reason: "General consumer good; broad appeal",
      confidence_score: 0.75,
      // @ts-ignore
      category: "CPG",
    });
    generated.push({
      id: uuidv4(),
      term: "urban setting",
      type: "environment",
      reason: "City life; diverse brand opportunities",
      confidence_score: 0.80,
      // @ts-ignore
      category: "Events & Lifestyle",
    });
  } else if (generated.length === 0) {
     generated.push({
      id: uuidv4(),
      term: "story element",
      type: "situation",
      reason: "Narrative opportunity; brand storytelling",
      confidence_score: 0.65,
      // @ts-ignore
      category: "Media & Entertainment",
    });
  }

  return generated;
};

// Mock data for budget calculation parameters - now dynamically fetched
export const MOCK_ADSENSE_RPM = getMockAdsenseRpm();
export const MOCK_ASSUMED_FILL_RATE = getMockAssumedFillRate();
export const MOCK_PROJECTED_IMPRESSIONS_PER_SLOT = getMockProjectedImpressionsPerSlot();

export const MOCK_CATEGORY_CPMS: { [key: string]: number } = {
  "CPG": 20, // $20 CPM
  "Tech": 35, // $35 CPM
  "Home & Living": 25, // $25 CPM
  "Events & Lifestyle": 30, // $30 CPM
  "Automotive": 40, // $40 CPM
  "Food & Beverage": 22, // $22 CPM
  "Apparel & Sports": 28, // $28 CPM
  "Travel": 32, // $32 CPM
  "Media & Entertainment": 18, // $18 CPM
  "Default": 25, // Default CPM for categories not explicitly listed
};