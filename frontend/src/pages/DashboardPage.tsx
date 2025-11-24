import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateBudgetImpact } from "@/lib/budgetCalculator";
import { Badge } from "@/components/ui/badge";
import BudgetChart from "@/components/BudgetChart";
import SaveAnalysisButton from "@/components/SaveAnalysisButton"; // New import

const DashboardPage = () => {
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

  const chartData = Object.entries(categoryBreakdown).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex flex-col items-center">
      <Card className="w-full max-w-4xl shadow-lg mt-8 mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Budget Impact Assessment
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            See how commercial integrations can influence your project's financial outlook.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

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

          <div className="mt-8 flex justify-center space-x-4">
            <Button variant="outline" onClick={() => navigate("/input-form")}>
              Start New Analysis
            </Button>
            <Button
              onClick={() => navigate("/evidence-pack", { state: { formData, acceptedSuggestions } })}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              View Evidence Pack
            </Button>
            {/* Save Analysis Button */}
            <SaveAnalysisButton formData={formData} acceptedSuggestions={acceptedSuggestions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;