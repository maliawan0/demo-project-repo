import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            AI Commercial Query Detection
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Quantify and secure potential sponsorship revenue before production begins.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Upload your script, define your budget, and let AI help you discover commercial integration opportunities and their budget impact.
          </p>
          <Link to="/input-form">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-lg shadow-md transition-all duration-300 ease-in-out">
              Get Started
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;