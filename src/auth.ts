import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { User } from "./app/generated/prisma";
import bcrypt from "bcryptjs";
import { type LoginFormValues } from "./lib/schemas/finance-schemas";
import { getUserByEmail } from "./app/actions/auth/getUserByEmail";
import { saveGoogleUser } from "./app/actions/auth/saveGoogleUser";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as LoginFormValues;

        const user = await getUserByEmail(email.toLowerCase());

        if (!user) return null;

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (isPasswordCorrect) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;

          return userWithoutPassword;
        }

        return null;
      },
    }),
    Google({
      profile: async (profile) => {
        const existingUser = await getUserByEmail(profile.email);

        if (existingUser) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = existingUser;

          return userWithoutPassword;
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

        const userSaved = await saveGoogleUser(newUser);

        if (!userSaved) {
          throw new Error("Error saving user to database");
        }

        return userSaved;
      },
    }),
  ],
});
