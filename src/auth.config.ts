import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";


const loginRoutes = ["/auth/login", "/auth/register", "/auth/recover"];
const authRoutes = [
  "/costos",
  "/estado-resultados",
  "/flujo-caja",
  "/gastos",
  "/ingresos",
];
const adminRoutes = ["/admin"];

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isLoginRoute = loginRoutes.some((route) =>
        pathname.startsWith(route)
      );
      const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
      );
      const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // Si no está autenticado y la ruta requiere autenticación
      if (!isLoggedIn) {
        if (isAuthRoute || isAdminRoute) {
          return NextResponse.redirect(new URL("/auth/login", nextUrl)); // Redirigir al login
        }
        return true; // Permitir rutas públicas
      }

      // Si está autenticado pero está intentando acceder a una ruta de login
      if (isLoginRoute) {
        return NextResponse.redirect(new URL("/", nextUrl)); // Redirigir a la página principal
      }

      if (isAdminRoute && auth?.user?.role !== "admin") {
        return NextResponse.redirect(new URL("/", nextUrl));
      }

      if (isAuthRoute) {
        return true;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.data = user;
      }

      return token;
    },
    session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token.data as any;
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
