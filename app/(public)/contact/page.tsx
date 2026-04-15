import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Hubungi Kami"
        description="Punya ide project atau mau tanya-tanya dulu? Langsung aja reach out — kami fast response."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          <Card className="border-border/40 bg-card/40 overflow-hidden">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl tracking-tight">
                Ceritain kebutuhan Anda
              </CardTitle>
              <p className="text-muted-foreground">
                Kalau bisa, sertakan: tujuan, contoh referensi, deadline, dan budget range — biar kami bisa
                respon cepat dan tepat.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border/50 bg-background/40 p-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium">Respon cepat</p>
                    <p className="text-sm text-muted-foreground">
                      Biasanya kami balas dalam 1×24 jam di hari kerja.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button asChild size="lg" className="w-full">
                  <Link href="mailto:info@rfttech.com?subject=Diskusi%20Project%20Digital%20Agency">
                    Email kami
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link href="/#layanan">Lihat layanan</Link>
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Dengan menghubungi kami, Anda setuju kami menyimpan detail kontak untuk follow up.
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="mailto:info@rfttech.com" className="text-primary font-medium hover:underline">
                  info@rfttech.com
                </Link>
                <p className="text-sm text-muted-foreground mt-2">
                  Tulis subjek: &quot;Diskusi Project&quot; biar cepat ketemu.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  Kantor
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Indonesia — untuk meeting tatap muka, bisa atur jadwal lewat email dulu.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
