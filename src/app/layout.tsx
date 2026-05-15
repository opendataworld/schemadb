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
    title: meta.title,
    description: meta.description,
    keywords: ["schema.org", "structured data", "SEO", "JSON-LD", "microdata"],
    authors: [{ name: "Schema.org Community" }],
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      url: "https://schema.org",
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD for software application
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Schema.org Agent",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
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
