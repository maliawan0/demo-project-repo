import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Import Input component
import { showSuccess, showError } from "@/utils/toast";

interface Suggestion {
  id: string;
  term: string;
  type: string;
  reason: string;
  confidence_score: number;
  status: "accepted" | "rejected";
}

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, suggestions: initialSuggestions } = location.state || { formData: {}, suggestions: [] };

  const [suggestions, setSuggestions] = useState<Suggestion[]>(
    initialSuggestions.map((s: any) => ({ ...s, status: "accepted" })) // Default to accepted
  );
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Filter suggestions based on search term
  const filteredSuggestions = useMemo(() => {
    if (!searchTerm) {
      return suggestions;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return suggestions.filter(
      (s) =>
        s.term.toLowerCase().includes(lowerCaseSearchTerm) ||
        s.reason.toLowerCase().includes(lowerCaseSearchTerm) ||
        s.type.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [suggestions, searchTerm]);

  if (!formData || !initialSuggestions || initialSuggestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-2xl shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">No Suggestions Found</CardTitle>
            <CardDescription>Please go back to the input form to submit a script.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/input-form")}>Go to Input Form</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleToggle = (id: string, checked: boolean) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: checked ? "accepted" : "rejected" } : s))
    );
  };

  const handleProceedToBudget = () => {
    const acceptedSuggestions = suggestions.filter((s) => s.status === "accepted");
    if (acceptedSuggestions.length === 0) {
      showError("Please accept at least one suggestion to proceed to budget impact.");
      return;
    }
    showSuccess("Suggestions saved. Calculating budget impact...");
    navigate("/budget-impact", { state: { formData, acceptedSuggestions } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex flex-col items-center">
      <Card className="w-full max-w-4xl shadow-lg mt-8 mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Review AI Commercial Suggestions
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Accept or reject the AI-generated commercial integration opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search suggestions by term, type, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Term</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Reason for Commercial Value</TableHead>
                <TableHead className="text-right w-[100px]">Accept?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion) => (
                  <TableRow key={suggestion.id}>
                    <TableCell className="font-medium">{suggestion.term}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{suggestion.type}</Badge>
                    </TableCell>
                    <TableCell>{suggestion.reason}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Switch
                          id={`suggestion-${suggestion.id}`}
                          checked={suggestion.status === "accepted"}
                          onCheckedChange={(checked) => handleToggle(suggestion.id, checked)}
                        />
                        <Label htmlFor={`suggestion-${suggestion.id}`} className="sr-only">
                          {suggestion.status === "accepted" ? "Accepted" : "Rejected"}
                        </Label>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No matching suggestions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-8 flex justify-end space-x-4">
            <Button variant="outline" onClick={() => navigate("/input-form")}>
              Back to Form
            </Button>
            <Button onClick={handleProceedToBudget} className="bg-blue-600 hover:bg-blue-700 text-white">
              Proceed to Budget Impact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewPage;