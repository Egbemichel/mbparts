// app/product/[slug]/page.tsx (server component)
import ProductDetailsClient from "./ProductDetailsClient";
import { Product } from "@/lib/types";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for each product
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts/parts/${slug}/`, { cache: "no-store" });

  if (!res.ok) {
    return {
      title: "Product not found | MB Parts Assembly",
      description: "This product does not exist.",
      robots: { index: false, follow: false },
    };
  }

  const product: Product = await res.json();
  const description = product.description || `Buy ${product.name} at MB Parts Assembly with warranty and fast delivery.`;

  return {
    title: `${product.name} – MB Parts Assembly`,
    description,
    metadataBase: new URL("https://mbpartsassembly.com"),
    openGraph: {
      type: "website",
      url: `https://mbpartsassembly.com/product/${product.slug}`,
      title: `${product.name} – MB Parts Assembly`,
      description,
      images: product.images?.length
          ? product.images.map(img => ({ url: img.image_url, width: 1200, height: 630, alt: product.name }))
          : [{ url: product.image_url || "/favicon.ico", width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} – MB Parts Assembly`,
      description,
      images: product.images?.length ? product.images.map(img => img.image_url) : [product.image_url || "/favicon.ico"],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://mbpartsassembly.com/product/${product.slug}` },
  };
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts/parts/${slug}/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <p className="p-8 text-red-500">Product not found.</p>;
  }

  const product: Product = await res.json();

  return (
      <>
        {/* JSON-LD structured data for Google rich snippets */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                name: product.name,
                image: product.images?.map(img => img.image_url) || [product.image_url || ""],
                description: product.description || "",
                sku: product.id.toString(),
                category: product.category,
                offers: {
                  "@type": "Offer",
                  url: `https://mbpartsassembly.com/product/${product.slug}`,
                  priceCurrency: "USD",
                  price: product.price,
                  availability: product.stock_status ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                },
                aggregateRating: product.stars
                    ? {
                      "@type": "AggregateRating",
                      ratingValue: product.stars,
                      reviewCount: 100,
                    }
                    : undefined,
              }),
            }}
        />
        <ProductDetailsClient product={product} />
      </>
  );
}
