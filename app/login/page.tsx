'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Lock, AlertTriangle, Info } from 'lucide-react';

const errorMessages: Record<string, { title: string; description: string; hint?: string }> = {
  Configuration: {
    title: 'Keycloak belum terhubung',
    description:
      'Sepertinya Keycloak belum di-setup atau realm/client belum dikonfigurasi. Pastikan Keycloak sudah running dan variabel KEYCLOAK_ISSUER, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET di .env sudah benar.',
    hint: 'Cek SETUP_KEYCLOAK.md untuk panduan lengkap.',
  },
  OAuthCallback: {
    title: 'Gagal login via Keycloak',
    description:
      'Ada masalah saat callback dari Keycloak. Biasanya ini terjadi kalau redirect URI belum didaftarkan di Keycloak atau client secret berubah.',
  },
  Default: {
    title: 'Login gagal',
    description: 'Terjadi kesalahan saat proses login. Coba lagi atau hubungi administrator.',
  },
};

function LoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const authError = errorParam
    ? errorMessages[errorParam] ?? errorMessages.Default
    : null;

  const handleKeycloakLogin = async () => {
    setLocalError('');
    setLoading(true);

    try {
      await signIn('keycloak', {
        callbackUrl: searchParams.get('callbackUrl') || '/admin',
        redirect: true,
      });
    } catch {
      setLocalError('Tidak bisa terhubung. Pastikan koneksi internet lancar dan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-md shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold">Masuk ke Admin</CardTitle>
        <CardDescription className="text-muted-foreground">
          Kelola konten website dari dashboard admin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Auth.js redirect error */}
          {authError && (
            <div className="p-4 text-sm bg-destructive/10 border border-destructive/20 rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-destructive">{authError.title}</p>
                  <p className="text-destructive/80 mt-1">{authError.description}</p>
                  {authError.hint && (
                    <p className="text-destructive/60 mt-2 flex items-center gap-1">
                      <Info className="h-3 w-3" /> {authError.hint}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Local error (e.g. network) */}
          {localError && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {localError}
            </div>
          )}

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Login menggunakan akun Keycloak yang sudah terdaftar
            </p>

            <Button
              type="button"
              onClick={handleKeycloakLogin}
              className="w-full"
              disabled={loading}
              size="lg"
            >
              <Lock className="h-4 w-4 mr-2" />
              {loading ? 'Mengarahkan...' : 'Masuk dengan Keycloak'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Suspense fallback={
          <Card className="border-border/40 bg-card/50 backdrop-blur-md shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold">Masuk ke Admin</CardTitle>
              <CardDescription className="text-muted-foreground">Memuat...</CardDescription>
            </CardHeader>
          </Card>
        }>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
