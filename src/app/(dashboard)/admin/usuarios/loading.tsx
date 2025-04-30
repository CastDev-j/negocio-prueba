"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function UsersLoading() {
  return (
    <div className="gap-6 flex flex-col w-full">
      {/* Resumen de Usuarios */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4">
            {/* Card Admin */}
            <div className="rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="mt-2">
                <Skeleton className="h-2 w-full" />
              </div>
            </div>

            {/* Card Usuarios */}
            <div className="rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="mt-2">
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-36" />
          </div>
        </CardContent>
      </Card>

      {/* Listado de Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search bar */}
          <div className="mb-4">
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
          
          {/* Table */}
          <div className="rounded-md border">
            <div className="h-[400px] relative">
              <div className="absolute inset-0 flex flex-col">
                {/* Header */}
                <div className="border-b">
                  <div className="flex h-12">
                    {["Nombre", "Correo", "Rol", "Registros", ""].map((_, i) => (
                      <div key={i} className="flex-1 flex items-center px-4">
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Rows */}
                <div className="flex-1 overflow-hidden">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex border-b h-16">
                      {/* Nombre */}
                      <div className="flex-1 flex items-center px-4">
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      
                      {/* Correo */}
                      <div className="flex-1 flex items-center px-4">
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                      
                      {/* Rol */}
                      <div className="flex-1 flex items-center px-4">
                        <Skeleton className="h-10 w-32" />
                      </div>
                      
                      {/* Registros */}
                      <div className="flex-1 flex items-center px-4">
                        <Skeleton className="h-9 w-28" />
                      </div>
                      
                      {/* Acciones */}
                      <div className="flex-1 flex items-center px-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pestañas de Información Financiera */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            {["Ingresos", "Costos", "Gastos"].map((tab) => (
              <Skeleton key={tab} className="h-10 w-24" />
            ))}
          </div>
          <Skeleton className="h-9 w-32" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-64" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-80" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}