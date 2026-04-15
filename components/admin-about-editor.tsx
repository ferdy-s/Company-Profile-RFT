'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

const valueSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
});

const schema = z.object({
  headline: z.string().min(1),
  intro: z.string().min(1),
  body: z.array(z.object({ paragraph: z.string().min(1) })).min(1),
  values: z.array(valueSchema).min(1),
});

type AboutFormValues = z.infer<typeof schema>;

export function AdminAboutEditor({
  initial,
}: {
  initial: {
    headline: string;
    intro: string;
    body: string[];
    values: { title: string; text: string }[];
  };
}) {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AboutFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      headline: initial.headline,
      intro: initial.intro,
      body: initial.body.map((paragraph) => ({ paragraph })),
      values: initial.values,
    },
  });

  const { fields: bodyFields, append: appendBody, remove: removeBody } = useFieldArray({
    control,
    name: 'body',
  });

  const { fields: valueFields, append: appendValue, remove: removeValue } = useFieldArray({
    control,
    name: 'values',
  });

  const onSubmit = async (data: AboutFormValues) => {
    const payload = {
      headline: data.headline,
      intro: data.intro,
      body: data.body.map((b) => b.paragraph),
      values: data.values,
    };

    const res = await fetch('/api/admin/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || 'Gagal menyimpan');
      return;
    }

    router.refresh();
    alert('Halaman tentang disimpan.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Konten &quot;Tentang kami&quot;</CardTitle>
          <CardDescription>
            Satu halaman untuk blok tentang di beranda (single-page): judul, pengantar, paragraf, dan
            nilai-nilai.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="headline">Judul utama</Label>
            <Input id="headline" {...register('headline')} />
            {errors.headline && (
              <p className="text-sm text-destructive">{errors.headline.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="intro">Pengantar</Label>
            <Textarea id="intro" rows={4} {...register('intro')} />
            {errors.intro && <p className="text-sm text-destructive">{errors.intro.message}</p>}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Paragraf isi</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendBody({ paragraph: '' })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Paragraf
              </Button>
            </div>
            {bodyFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <Textarea
                  rows={3}
                  className="flex-1"
                  {...register(`body.${index}.paragraph` as const)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => removeBody(index)}
                  aria-label="Hapus paragraf"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.body && (
              <p className="text-sm text-destructive">Minimal satu paragraf yang diisi.</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Kartu nilai</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendValue({ title: '', text: '' })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Nilai
              </Button>
            </div>
            {valueFields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-border/50 p-4 space-y-3">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeValue(index)}
                  >
                    Hapus
                  </Button>
                </div>
                <div className="grid gap-2">
                  <Label>Judul nilai</Label>
                  <Input {...register(`values.${index}.title` as const)} />
                </div>
                <div className="grid gap-2">
                  <Label>Teks</Label>
                  <Textarea rows={2} {...register(`values.${index}.text` as const)} />
                </div>
              </div>
            ))}
            {errors.values && (
              <p className="text-sm text-destructive">Minimal satu kartu nilai.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Button type="submit">Simpan tentang kami</Button>
    </form>
  );
}
