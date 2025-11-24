import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { generateMockSuggestions } from "@/lib/mockData";
import { showSuccess } from "@/utils/toast";
import { Loader2 } from "lucide-react"; // Import Loader2 icon

const formSchema = z.object({
  script: z.string().min(50, { message: "Script must be at least 50 characters." }),
  productionBudget: z.preprocess(
    (val) => Number(val),
    z.number().min(1, { message: "Production budget must be a positive number." })
  ),
  targetDemographic: z.string().min(3, { message: "Target demographic is required." }),
  willingnessToAdapt: z.enum(["no-changes", "minor-dialogue", "scene-level"], {
    required_error: "Please select your willingness to adapt creative.",
  }),
  creativeDirectionNotes: z.string().optional(),
});

const InputFormPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      script: "",
      productionBudget: 0,
      targetDemographic: "",
      willingnessToAdapt: "no-changes",
      creativeDirectionNotes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true); // Set loading to true on submit
    try {
      const mockSuggestions = await generateMockSuggestions(values.script); // Await the mock suggestions
      showSuccess("Script submitted and AI suggestions generated!");
      navigate("/review-suggestions", { state: { formData: values, suggestions: mockSuggestions } });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      // Optionally show an error toast here
    } finally {
      setIsLoading(false); // Set loading to false after completion
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Upload Script & Parameters
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Provide your script and key details to analyze commercial opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="script"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Script/Treatment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your full script or excerpt here..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productionBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Production Budget ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 200000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetDemographic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Demographic/Audience</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 18-34 year olds, tech enthusiasts" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="willingnessToAdapt"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Willingness to Adapt Creative</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no-changes" />
                          </FormControl>
                          <FormLabel className="font-normal">No changes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="minor-dialogue" />
                          </FormControl>
                          <FormLabel className="font-normal">Minor dialogue changes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="scene-level" />
                          </FormControl>
                          <FormLabel className="font-normal">Scene-level changes</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="creativeDirectionNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Optional Creative Direction Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any specific notes for brand integrations or creative constraints?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Script"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InputFormPage;