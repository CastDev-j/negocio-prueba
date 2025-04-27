import { Prisma } from "@/app/generated/prisma";
import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";

const userData: Prisma.UserCreateInput[] = [
  {
    email: "test1@google.com",
    name: "Test User 1",
    password: bcrypt.hashSync("123456", 10),
    role: "admin",
    image: "https://mx.pinterest.com/pin/1266706140449957/",
  },
  {
    email: "test2@google.com",
    name: "Test User 2",
    password: bcrypt.hashSync("123456", 10),
  },
];

const counterData: Prisma.CounterCreateInput[] = [
  {
    value: 0,
  },
];

export async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("You are trying to seed the production database.");
  }

  try {
    await prisma.user.deleteMany();
    await prisma.counter.deleteMany();
  } catch (error) {
    console.error("Error seeding database:", error);
  }

  for (const u of userData) {
    await prisma.user.create({ data: u });
  }

  for (const c of counterData) {
    await prisma.counter.create({ data: c });
  }

}

main();
