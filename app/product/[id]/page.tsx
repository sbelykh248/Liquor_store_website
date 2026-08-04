import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products } from "@/lib/data/products";
import ProductDetailClient from "@/components/ProductDetailClient";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

function findProduct(id: string) {
  return products.find((p) => p.id === id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) return { title: "Bottle not found" };
  return {
    title: product.brand,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) notFound();

  return <ProductDetailClient productId={id} fallback={product} />;
}
