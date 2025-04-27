"use server";

import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

const id = "f8ff05e5-776e-4aa9-9bf3-b9a3a820349a";

export const incrementCounter = async () => {
    let updatedCounter;

    try {
        const counter = await prisma.counter.findFirst({
            where: { id },
        });

        if (!counter) {
            throw new Error("Counter not found");
        }

        updatedCounter = await prisma.counter.update({
            where: { id },
            data: { value: counter.value + 1 },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }

    revalidatePath("counter");
    return updatedCounter;
};

export const decrementCounter = async () => {
    let updatedCounter;

    try {
        const counter = await prisma.counter.findFirst({
            where: { id },
        });

        if (!counter) {
            throw new Error("Counter not found");
        }

        updatedCounter = await prisma.counter.update({
            where: { id },
            data: { value: counter.value - 1 },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }

    revalidatePath("counter");
    return updatedCounter;
};

export const resetCounter = async () => {
    let updatedCounter;

    try {
        const counter = await prisma.counter.findFirst({
            where: { id },
        });

        if (!counter) {
            throw new Error("Counter not found");
        }

        updatedCounter = await prisma.counter.update({
            where: { id },
            data: { value: 0 },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }

    revalidatePath("counter");
    return updatedCounter;
};

export const getCounter = async () => {
    let counter;

    try {
        counter = await prisma.counter.findFirst({
            where: { id },
        });

        if (!counter) {
            throw new Error("Counter not found");
        }
    } catch (error) {
        console.error(error);
        throw error;
    }

    revalidatePath("counter");
    return counter;
};
