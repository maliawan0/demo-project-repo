"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { showSuccess } from "@/utils/toast";
import {
  getMockAdsenseRpm,
  getMockAssumedFillRate,
  getMockProjectedImpressionsPerSlot,
  setMockAdsenseRpm,
  setMockAssumedFillRate,
  setMockProjectedImpressionsPerSlot,
} from "@/lib/mockData";

const formSchema = z.object({
  adsenseRpm: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "AdSense RPM must be a non-negative number." })
  ),
  assumedFillRate: z.preprocess(
    (val) => Number(val),
    z.number().min(0).max(1, { message: "Assumed fill rate must be between 0 and 1." })
  ),
  projectedImpressionsPerSlot: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Projected impressions must be a non-negative number." })
  ),
});

const SettingsPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adsenseRpm: getMockAdsenseRpm(),
      assumedFillRate: getMockAssumedFillRate(),
      projectedImpressionsPerSlot: getMockProjectedImpressionsPerSlot(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setMockAdsenseRpm(values.adsenseRpm);
    setMockAssumedFillRate(values.assumedFillRate);
    setMockProjectedImpressionsPerSlot(values.projectedImpressionsPerSlot);
    showSuccess("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Application Settings
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Configure parameters for budget impact calculations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="adsenseRpm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AdSense Revenue Per Mille (RPM)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 5.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assumedFillRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assumed Sponsorship Fill Rate (0-1)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 0.7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectedImpressionsPerSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projected Impressions Per Sponsorship Slot</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" placeholder="e.g., 100000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Save Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;