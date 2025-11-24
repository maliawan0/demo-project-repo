"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { getAnalysesForUser, deleteAnalysis, AnalysisSession } from "@/lib/analysisStorage";
import { format } from "date-fns";
import { Trash2, Eye } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const AnalysisHistoryPage = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [userAnalyses, setUserAnalyses] = useState<AnalysisSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && user) {
      loadAnalyses();
    } else if (!isLoggedIn) {
      navigate("/login"); // Redirect to login if not logged in
    }
  }, [isLoggedIn, user, navigate]);

  const loadAnalyses = () => {
    if (user?.id) {
      setLoading(true);
      const analyses = getAnalysesForUser(user.id);
      setUserAnalyses(analyses);
      setLoading(false);
    }
  };

  const handleViewAnalysis = (analysis: AnalysisSession) => {
    navigate("/budget-impact", { state: { formData: analysis.formData, acceptedSuggestions: analysis.acceptedSuggestions } });
  };

  const handleDeleteAnalysis = (analysisId: string) => {
    if (user?.id) {
      const success = deleteAnalysis(analysisId, user.id);
      if (success) {
        showSuccess("Analysis deleted successfully!");
        loadAnalyses(); // Reload the list
      } else {
        showError("Failed to delete analysis.");
      }
    }
  };

  if (!isLoggedIn) {
    return null; // Or a loading spinner, as the useEffect will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <p className="text-lg text-gray-600 dark:text-gray-400">Loading analyses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex flex-col items-center">
      <Card className="w-full max-w-4xl shadow-lg mt-8 mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Saved Analyses
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Access and manage your previously saved commercial query detection sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userAnalyses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground mb-4">You haven't saved any analyses yet.</p>
              <Button onClick={() => navigate("/input-form")}>Start New Analysis</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Analysis Name</TableHead>
                  <TableHead>Date Saved</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAnalyses.map((analysis) => (
                  <TableRow key={analysis.id}>
                    <TableCell className="font-medium">{analysis.name}</TableCell>
                    <TableCell>{format(new Date(analysis.timestamp), "PPP p")}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewAnalysis(analysis)}>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your analysis
                              session and remove its data from our servers (local storage).
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAnalysis(analysis.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisHistoryPage;