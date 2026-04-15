'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/image-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const schema = z.object({
  logoUrl: z.string().url('Upload logo terlebih dahulu'),
});

type FormValues = z.infer<typeof schema>;

export function AdminBrandEditor({ initialLogoUrl }: { initialLogoUrl: string }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { logoUrl: initialLogoUrl },
  });

  const logoUrl = watch('logoUrl');

  const onSubmit = async (data: FormValues) => {
    const res = await fetch('/api/admin/brand', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logoUrl: data.logoUrl }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || 'Gagal menyimpan');
      return;
    }
    router.refresh();
    alert('Logo brand tersimpan.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Brand logo</CardTitle>
          <CardDescription>
            Logo ini dipakai di navbar, hero, dan footer. Upload akan tersimpan di MinIO dan URL-nya
            disimpan di database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Logo (gambar)</Label>
            <input type="hidden" {...register('logoUrl')} />
            <ImageUpload
              value={logoUrl}
              onChange={(url) => setValue('logoUrl', url, { shouldValidate: true })}
            />
            {errors.logoUrl && <p className="text-sm text-destructive">{errors.logoUrl.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Button type="submit">Simpan logo</Button>
    </form>
  );
}

