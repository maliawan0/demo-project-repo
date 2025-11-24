import { MOCK_ADSENSE_RPM, MOCK_ASSUMED_FILL_RATE, MOCK_PROJECTED_IMPRESSIONS_PER_SLOT, MOCK_CATEGORY_CPMS } from "./mockData";

interface AcceptedSuggestion {
  id: string;
  term: string;
  type: string;
  reason: string;
  confidence_score: number;
  category: string; // Added category for budget calculation
}

export const calculateBudgetImpact = (
  productionBudget: number,
  acceptedSuggestions: AcceptedSuggestion[],
  targetWatchHours: number = 100000 // Mock value for target watch hours
) => {
  // Baseline revenue (AdSense) - using a mock RPM and target watch hours
  // Assuming 1000 views per watch hour for simplicity to calculate AdSense
  const baselineAdsenseRevenue = (targetWatchHours / 1000) * MOCK_ADSENSE_RPM;

  // Potential sponsorship revenue
  let sponsorshipPotential = 0;
  const categoryBreakdown: { [key: string]: number } = {};

  acceptedSuggestions.forEach((suggestion) => {
    const category = suggestion.category || "Default";
    const cpm = MOCK_CATEGORY_CPMS[category] || MOCK_CATEGORY_CPMS["Default"];
    
    // Sponsorship = (CPM / 1000) * assumed fill rate * projected impressions per slot
    const revenuePerSlot = (cpm / 1000) * MOCK_ASSUMED_FILL_RATE * MOCK_PROJECTED_IMPRESSIONS_PER_SLOT;
    
    sponsorshipPotential += revenuePerSlot;
    categoryBreakdown[category] = (categoryBreakdown[category] || 0) + revenuePerSlot;
  });

  const totalProjectedRevenue = baselineAdsenseRevenue + sponsorshipPotential;
  const netImpact = totalProjectedRevenue - productionBudget;

  return {
    productionBudget,
    baselineAdsenseRevenue,
    sponsorshipPotential,
    totalProjectedRevenue,
    netImpact,
    categoryBreakdown,
  };
};