import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Google from "next-auth/providers/google";
import { getUserByEmail } from "./app/actions/getUserByEmail";
import { User } from "./app/generated/prisma";
import { saveUser } from "./app/actions/saveUser";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      profile: async (profile) => {
        const existingUser = await getUserByEmail(profile.email);

        if (existingUser) {
          return existingUser;
        }

        const newUser: User = {
          id: crypto.randomUUID(), // Generate a unique ID
          name: profile.name as string,
          email: profile.email as string,
          role: "user",
          image: profile.picture || null,
          password: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const userSaved = await saveUser(newUser);

        if (!userSaved) {
          throw new Error("Error saving user to database");
        }

        return userSaved;
      },
    }),
  ],
});
