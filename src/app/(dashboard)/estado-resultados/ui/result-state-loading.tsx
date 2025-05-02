import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import React from "react";

export const ResultStateLoading = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between py-2 border-b">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-5 w-32" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-7 w-16" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
