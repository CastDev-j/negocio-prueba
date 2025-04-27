import { withPrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
};

export default withPrismaPlugin(nextConfig);
