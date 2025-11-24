import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { calculateBudgetImpact } from "@/lib/budgetCalculator";
import BudgetChart from "@/components/BudgetChart";
import SaveAnalysisButton from "@/components/SaveAnalysisButton";
import { Download } from "lucide-react"; // Import Download icon

interface Suggestion {
  id: string;
  term: string;
  type: string;
  reason: string;
  confidence_score: number;
  category: string;
}

interface FormData {
  script: string;
  productionBudget: number;
  targetDemographic: string;
  willingnessToAdapt: "no-changes" | "minor-dialogue" | "scene-level";
  creativeDirectionNotes?: string;
}

const EvidencePackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, acceptedSuggestions } = location.state || { formData: {}, acceptedSuggestions: [] };

  if (!formData || !acceptedSuggestions || acceptedSuggestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-2xl shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">No Data to Display</CardTitle>
            <CardDescription>Please go back to the input form and review suggestions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/input-form")}>Go to Input Form</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    productionBudget,
    baselineAdsenseRevenue,
    sponsorshipPotential,
    totalProjectedRevenue,
    netImpact,
    categoryBreakdown,
  } = calculateBudgetImpact(formData.productionBudget, acceptedSuggestions);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const willingnessToAdaptMap = {
    "no-changes": "No changes",
    "minor-dialogue": "Minor dialogue changes",
    "scene-level": "Scene-level changes",
  };

  const chartData = Object.entries(categoryBreakdown).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const handleDownloadJson = () => {
    const dataToDownload = {
      formData,
      acceptedSuggestions,
      budgetImpact: {
        productionBudget,
        baselineAdsenseRevenue,
        sponsorshipPotential,
        totalProjectedRevenue,
        netImpact,
        categoryBreakdown,
      },
    };
    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commercial-analysis-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex flex-col items-center">
      <Card className="w-full max-w-5xl shadow-lg mt-8 mb-8 print:shadow-none print:border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 print:text-black">
            Commercial Opportunity Evidence Pack
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2 print:text-gray-700">
            Detailed assessment of commercial integrations and their budget impact.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Input Parameters Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Input Parameters</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <div>
                <p className="font-semibold">Production Budget:</p>
                <p>{formatCurrency(formData.productionBudget)}</p>
              </div>
              <div>
                <p className="font-semibold">Target Demographic:</p>
                <p>{formData.targetDemographic}</p>
              </div>
              <div>
                <p className="font-semibold">Willingness to Adapt Creative:</p>
                <p>{willingnessToAdaptMap[formData.willingnessToAdapt]}</p>
              </div>
              {formData.creativeDirectionNotes && (
                <div>
                  <p className="font-semibold">Creative Direction Notes:</p>
                  <p className="whitespace-pre-wrap">{formData.creativeDirectionNotes}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="font-semibold">Script Excerpt:</p>
                <p className="text-sm italic max-h-40 overflow-y-auto border p-2 rounded-md bg-gray-50 dark:bg-gray-800">
                  {formData.script.substring(0, 500)}... (full script not shown for brevity)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Accepted Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Accepted Commercial Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Term</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Reason for Commercial Value</TableHead>
                    <TableHead className="w-[120px] text-right">Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {acceptedSuggestions.map((suggestion: Suggestion) => (
                    <TableRow key={suggestion.id}>
                      <TableCell className="font-medium">{suggestion.term}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{suggestion.type}</Badge>
                      </TableCell>
                      <TableCell>{suggestion.reason}</TableCell>
                      <TableCell className="text-right">
                        {(suggestion.confidence_score * 100).toFixed(0)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Budget Impact Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Budget Impact Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-blue-50 dark:bg-blue-950">
                  <CardHeader>
                    <CardTitle className="text-lg">Production Budget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                      {formatCurrency(productionBudget)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 dark:bg-green-950">
                  <CardHeader>
                    <CardTitle className="text-lg">Total Projected Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                      {formatCurrency(totalProjectedRevenue)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">AdSense Baseline</TableCell>
                    <TableCell className="text-right">{formatCurrency(baselineAdsenseRevenue)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Potential Sponsorships</TableCell>
                    <TableCell className="text-right">{formatCurrency(sponsorshipPotential)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Net Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className={`text-4xl font-extrabold ${
                      netImpact >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {netImpact >= 0 ? "+" : ""}
                    {formatCurrency(netImpact)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {netImpact >= 0
                      ? "Your project is projected to break even with a surplus!"
                      : "Additional funding may be required to cover the budget gap."}
                  </p>
                </CardContent>
              </Card>

              {chartData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Sponsorship Upside by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BudgetChart data={chartData} />
                    <Table className="mt-4">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Potential Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(categoryBreakdown).map(([category, amount]) => (
                          <TableRow key={category}>
                            <TableCell>
                              <Badge variant="secondary">{category}</Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-center space-x-4 print:hidden">
            <Button variant="outline" onClick={() => navigate("/budget-impact")}>
              Back to Dashboard
            </Button>
            <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white">
              Print Evidence Pack
            </Button>
            <Button onClick={handleDownloadJson} className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="mr-2 h-4 w-4" /> Download JSON
            </Button>
            <Button onClick={() => navigate("/input-form")} className="bg-gray-600 hover:bg-gray-700 text-white">
              Start New Analysis
            </Button>
            <SaveAnalysisButton formData={formData} acceptedSuggestions={acceptedSuggestions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvidencePackPage;