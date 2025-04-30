import { $Enums } from "@/app/generated/prisma";

export interface GoogleUser {
  name: string;
  email: string;
  password: string;
  image: string | null;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;
}
