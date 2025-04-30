import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { type LoginFormValues } from "./lib/schemas/finance-schemas";
import { getUserByEmail } from "./app/actions/auth/getUserByEmail";
import { saveGoogleUser } from "./app/actions/auth/saveGoogleUser";
import { GoogleUser } from "./interfaces/user";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as LoginFormValues;

        const { data } = await getUserByEmail(email.toLowerCase());

        if (!data) return null;

        const user = data;

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
        // 1. Intentar obtener usuario existente
        const { data: existingUser, success } = await getUserByEmail(
          profile.email
        );

        if (success && existingUser) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = existingUser;
          return {
            id: userWithoutPassword.id,
            name: userWithoutPassword.name,
            email: userWithoutPassword.email,
            image: userWithoutPassword.image || null,
            role: userWithoutPassword.role,
          };
        }

        // 2. Si no existe, crear nuevo usuario
        const newUser: GoogleUser = {
          name: profile.name as string,
          email: profile.email as string,
          role: "user",
          image: profile.picture || null,
          password: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const { data: userSavedData, success: successUserSaved } =
          await saveGoogleUser(newUser);

        if (successUserSaved && userSavedData) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, createdAt, updatedAt, ...userSaved } =
            userSavedData;
          return {
            id: userSaved.id,
            name: userSaved.name,
            email: userSaved.email,
            image: userSaved.image || null,
            role: userSaved.role,
          };
        }

        throw new Error("Failed to get or create user");
      },
    }),
  ],
});
