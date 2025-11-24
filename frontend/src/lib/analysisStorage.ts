import { v4 as uuidv4 } from 'uuid';

interface SavedSuggestion {
  id: string;
  term: string;
  type: string;
  reason: string;
  confidence_score: number;
  category: string; // Ensure category is saved
}

interface SavedFormData {
  script: string;
  productionBudget: number;
  targetDemographic: string;
  willingnessToAdapt: "no-changes" | "minor-dialogue" | "scene-level";
  creativeDirectionNotes?: string;
}

export interface AnalysisSession {
  id: string;
  userId: string;
  timestamp: number; // For sorting and display
  name: string; // User-given name for the analysis
  formData: SavedFormData;
  acceptedSuggestions: SavedSuggestion[];
}

const LS_ANALYSES_KEY = "userAnalyses";

// Helper to get all analyses from localStorage
const getAllAnalyses = (): AnalysisSession[] => {
  if (typeof window === "undefined") return [];
  const analysesJson = localStorage.getItem(LS_ANALYSES_KEY);
  return analysesJson ? JSON.parse(analysesJson) : [];
};

// Helper to save all analyses to localStorage
const saveAllAnalyses = (analyses: AnalysisSession[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_ANALYSES_KEY, JSON.stringify(analyses));
  }
};

export const saveAnalysis = (
  userId: string,
  name: string,
  formData: SavedFormData,
  acceptedSuggestions: SavedSuggestion[]
): AnalysisSession => {
  const allAnalyses = getAllAnalyses();
  const newAnalysis: AnalysisSession = {
    id: uuidv4(),
    userId,
    timestamp: Date.now(),
    name,
    formData,
    acceptedSuggestions,
  };
  saveAllAnalyses([...allAnalyses, newAnalysis]);
  return newAnalysis;
};

export const getAnalysesForUser = (userId: string): AnalysisSession[] => {
  const allAnalyses = getAllAnalyses();
  return allAnalyses.filter(analysis => analysis.userId === userId).sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
};

export const getAnalysisById = (id: string): AnalysisSession | undefined => {
  const allAnalyses = getAllAnalyses();
  return allAnalyses.find(analysis => analysis.id === id);
};

export const deleteAnalysis = (id: string, userId: string): boolean => {
  let allAnalyses = getAllAnalyses();
  const initialLength = allAnalyses.length;
  allAnalyses = allAnalyses.filter(analysis => analysis.id !== id || analysis.userId !== userId); // Ensure user owns the analysis
  saveAllAnalyses(allAnalyses);
  return allAnalyses.length < initialLength; // True if an analysis was removed
};