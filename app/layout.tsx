import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gamagma.com",
  description:
    "Platform informasi resmi untuk calon mahasiswa UGM dari MAN 2 Kota Malang. Dapatkan informasi lengkap mengenai jalur masuk, fakultas, dan kehidupan kampus di Universitas Gadjah Mada.",
  icons: {
    icon: [
      {
        url: "/images/halo.jpeg",
        type: "image/jpeg",
      },
    ],
    apple: "/images/halo.jpeg",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`font-sans antialiased`}>
        <HeaderWrapper />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
