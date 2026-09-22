import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LenisProvider } from "@/components/lenis-provider"
import ClickSpark from "@/components/click-spark"
import "./globals.css"

const _inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const _jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Treinamento em Certificados de Calibração | TECNOISO",
  description: "Treinamento TECNOISO para análise e interpretação de certificados de calibração. Turma EaD em 30 de setembro de 2026.",
  keywords: ["certificados de calibração", "metrologia", "ISO 17025", "TECNOISO", "treinamento"],
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#d32f2f",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased`}>
        <ClickSpark
          sparkColor="#d32f2f"
          sparkSize={12}
          sparkRadius={20}
          sparkCount={8}
          duration={400}
          easing="ease-out"
        >
          <LenisProvider>{children}</LenisProvider>
        </ClickSpark>
        <Analytics />
      </body>
    </html>
  )
}
