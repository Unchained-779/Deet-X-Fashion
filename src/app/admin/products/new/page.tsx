import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Size } from "@prisma/client";
import NewProductClient from "@/components/NewProductClient";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <NewProductClient
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
