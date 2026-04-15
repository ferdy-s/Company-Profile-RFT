import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getPublicCareers } from '@/lib/public-content';
import { BadgeCheck, Briefcase, Mail, MapPin } from 'lucide-react';

export default async function CareerPage() {
  const careerOpenings = await getPublicCareers();

  return (
    <>
      <PageHeader
        title="Karier"
        description="Gabung tim kami — kerja di project yang beda-beda, bareng orang-orang yang passionate."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="space-y-6">
            <Card className="border-border/40 bg-card/40">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl tracking-tight">
                  Kerja bareng tim yang rapi, cepat, dan transparan
                </CardTitle>
                <p className="text-muted-foreground">
                  Kami cari orang yang suka problem nyata: build produk, improve performa, dan bantu
                  klien grow. Kalau posisi yang cocok belum ada, Anda tetap bisa kirim CV.
                </p>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Project beragam (web, apps, growth)</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4" />
                  <span>Proses kerja jelas + code review</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Remote / hybrid tergantung posisi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Fast response via email</span>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              {careerOpenings.map((job) => (
                <Card
                  key={job.slug}
                  className="border-border/40 bg-card/50 hover:bg-card/70 transition-colors"
                >
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-xl sm:text-2xl">{job.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                        <Briefcase className="h-3.5 w-3.5" />
                        {job.type}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
                    <div className="rounded-xl border border-border/50 bg-background/40 p-4">
                      <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">
                        Yang bakal kamu kerjain
                      </p>
                      <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                        {job.responsibilities.map((r, i) => (
                          <li key={`${job.slug}-${i}`}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 space-y-4">
            <Card className="border-border/40 bg-card/40">
              <CardHeader>
                <CardTitle className="text-lg">Siap apply?</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kirim CV/portfolio dan tulis posisi yang Anda incar.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="mailto:info@rfttech.com?subject=Lamaran%20Digital%20Agency%20RFT">
                    Kirim lamaran via email
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link href="/contact">Tanya dulu via kontak</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
