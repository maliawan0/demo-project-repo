"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { showSuccess, showError } from "@/utils/toast";
import { saveAnalysis } from "@/lib/analysisStorage";
import { Loader2, Save } from "lucide-react";

interface SaveAnalysisButtonProps {
  formData: any; // Replace with actual FormData type if available
  acceptedSuggestions: any[]; // Replace with actual Suggestion type if available
}

const SaveAnalysisButton: React.FC<SaveAnalysisButtonProps> = ({ formData, acceptedSuggestions }) => {
  const { user, isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [analysisName, setAnalysisName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!isLoggedIn || !user) {
      showError("You must be logged in to save an analysis.");
      return;
    }
    if (!analysisName.trim()) {
      showError("Please enter a name for your analysis.");
      return;
    }

    setIsSaving(true);
    try {
      saveAnalysis(user.id, analysisName, formData, acceptedSuggestions);
      showSuccess("Analysis saved successfully!");
      setIsOpen(false);
      setAnalysisName(""); // Clear input after saving
    } catch (error) {
      console.error("Failed to save analysis:", error);
      showError("Failed to save analysis. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!isLoggedIn}>
          <Save className="mr-2 h-4 w-4" /> Save Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Analysis</DialogTitle>
          <DialogDescription>
            Give your analysis a name to save it for later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="analysisName" className="text-right">
              Name
            </Label>
            <Input
              id="analysisName"
              value={analysisName}
              onChange={(e) => setAnalysisName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 'Project Alpha Script v1'"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave} disabled={isSaving || !analysisName.trim()}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveAnalysisButton;