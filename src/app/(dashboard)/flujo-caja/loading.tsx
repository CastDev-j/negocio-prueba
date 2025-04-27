import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function FlujoCajaLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center">
              <Skeleton className="h-[350px] w-[90%]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="h-[300px] relative">
                <div className="absolute inset-0 flex flex-col">
                  <div className="border-b">
                    <div className="flex h-10">
                      <Skeleton className="h-4 w-24 m-auto" />
                      <Skeleton className="h-4 w-32 m-auto" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex border-b h-12">
                        <Skeleton className="h-4 w-24 m-auto" />
                        <Skeleton className="h-4 w-32 m-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
