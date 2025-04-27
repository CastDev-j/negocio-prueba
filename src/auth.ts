import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Google from "next-auth/providers/google";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      profile: (profile) => {
        //TODO, hacer llamada a base de datos para roles y crear el usuario si no existe

        const user = {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "admin",
        };

        return user;
      },
    }),
  ],
});
