"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Lightbulb, Heart } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

function AnimatedSection({ children, className = "" }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default function TentangPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <AnimatedSection>
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/maskot-simaster.png"
              alt="SIMASTER Mascot"
              width={120}
              height={120}
              className="w-32 h-32"
            />
          </div>
          <Badge className="bg-accent text-accent-foreground mb-4">Tentang Kami</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-balance">Gamagma</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Platform Informasi Resmi untuk Calon Mahasiswa UGM dari MAN 2 Kota Malang
          </p>
        </div>
      </AnimatedSection>

      {/* Mission & Vision */}
      <AnimatedSection>
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Visi</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Menjadi platform informasi terpercaya yang membantu siswa MAN 2 Kota Malang mewujudkan impian kuliah di
                Universitas Gadjah Mada
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Misi</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Memberikan transparansi informasi lengkap mengenai jalur masuk, fakultas, dan kehidupan kampus di UGM
                serta mendampingi teman - teman dari MAN 2 Kota Malang dalam perjalanannya untuk bisa berkuliah di UGM nantinya.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </AnimatedSection>

      {/* What We Offer */}
      <AnimatedSection>
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Yang Kami Tawarkan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Kontak Person</CardTitle>
                <CardDescription>Akses langsung ke Kakak-Kakak Alumni MAN 2 Kota Malang di UGM</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Track Record</CardTitle>
                <CardDescription>
                  Lihat pencapaian alumni MAN 2 yang berhasil diterima di berbagai fakultas UGM
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Jurnal Alumni</CardTitle>
                <CardDescription>Baca pengalaman dan tips dari alumni yang sudah kuliah di UGM</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* About UGM Section */}
      <AnimatedSection>
        <div className="bg-gradient-to-r from-primary to-blue-900 text-primary-foreground rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-balance">Tentang Universitas Gadjah Mada</h2>
            <p className="text-lg text-primary-foreground/90 text-pretty leading-relaxed">
              Universitas Gadjah Mada (UGM) adalah universitas negeri tertua dan terbesar di Indonesia yang didirikan pada
              19 Desember 1949. UGM memiliki 18 fakultas dengan lebih dari 100 program studi yang terakreditasi
              unggul BAN-PT maupun internasional. Dengan motto "Locally Rooted, Globally Respected", UGM terus menjadi pilihan utama bagi calon
              mahasiswa yang ingin berkontribusi bagi bangsa dan dunia.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
              <div>
                <p className="text-3xl font-bold">75+</p>
                <p className="text-sm text-primary-foreground/90">Tahun Berdiri</p>
              </div>
              <div>
                <p className="text-3xl font-bold">18+</p>
                <p className="text-sm text-primary-foreground/90">Fakultas dan Sekolah Vokasi</p>
              </div>
              <div>
                <p className="text-3xl font-bold">100+</p>
                <p className="text-sm text-primary-foreground/90">Program Studi</p>
              </div>
              <div>
                <p className="text-3xl font-bold">55K+</p>
                <p className="text-sm text-primary-foreground/90">Mahasiswa</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Map Section */}
      <AnimatedSection>
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Peta Universitas Gadjah Mada</h2>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&amp;q=Universitas+Gadjah+Mada,Bulaksumur+Yogyakarta&amp;zoom=15"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Universitas Gadjah Mada"
            />
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
