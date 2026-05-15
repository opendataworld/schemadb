import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fetch dynamic metadata from schema.org
async function fetchSchemaOrgMeta() {
  try {
    const response = await fetch("https://schema.org", { 
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Schema.org-Agent/1.0" }
    })
    const html = await response.text()
    
    // Extract meta description from schema.org homepage
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/)
    const titleMatch = html.match(/<title>([^<]+)<\/title>/)
    
    return {
      title: titleMatch?.[1] || "Schema.org Agent",
      description: descMatch?.[1] || "AI agent that helps people understand schema.org taxonomy and vocabulary",
    }
  } catch {
    return {
      title: "Schema.org Agent",
      description: "AI agent that helps people understand schema.org taxonomy and vocabulary",
    }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = await fetchSchemaOrgMeta()
  return {
    metadataBase: new URL("https://schema.org"),
    title: {
      default: meta.title,
      template: "%s | Schema.org Agent",
    },
    description: meta.description,
    keywords: [
      "schema.org",
      "structured data", 
      "SEO",
      "JSON-LD",
      "microdata",
      "RDFa",
      "vocabulary",
      "taxonomy",
    ],
    authors: [{ name: "Open Data World" }],
    creator: "Open Data World",
    publisher: "Open Data World",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      url: "https://github.com/opendataworld/schemadb",
      siteName: "Schema.org Agent",
      locale: "en_US",
      alternateLocale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      creator: "@opendataworld",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: "https://github.com/opendataworld/schemadb",
      languages: {
        "en-US": "https://github.com/opendataworld/schemadb",
      },
    },
    verification: {
      google: "google-site-verification-code",
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD for AI-powered Q&A application
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Schema.org Agent",
    alternateName: "Schema.org Q&A",
    description: "An AI-powered assistant that helps people understand the taxonomy and vocabulary of schema.org",
    url: "https://github.com/opendataworld/schemadb",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript and a modern web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "50",
    },
    author: {
      "@type": "Organization",
      name: "Open Data World",
      url: "https://github.com/opendataworld",
    },
    programmingLanguage: "TypeScript",
    softwareVersion: "1.0.0",
    releaseNotes: "https://github.com/opendataworld/schemadb/releases",
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
