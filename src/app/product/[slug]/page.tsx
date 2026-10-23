import { redirect } from "next/navigation";

interface ProductRedirectProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductRedirectPage({ params }: ProductRedirectProps) {
  const { slug } = await params;
  redirect(`/products/${slug}`);
}
