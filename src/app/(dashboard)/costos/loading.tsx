import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CostosLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-9 w-32" />
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-64" />
                <div className="rounded-md border">
                  <div className="h-[400px] relative">
                    <div className="absolute inset-0 flex flex-col">
                      <div className="border-b">
                        <div className="flex h-10">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-24 m-auto" />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex border-b h-16">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Skeleton key={j} className="h-4 w-24 m-auto" />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
