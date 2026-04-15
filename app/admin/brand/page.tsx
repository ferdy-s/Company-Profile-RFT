import { AdminBrandEditor } from '@/components/admin-brand-editor';
import { BRAND_LOGO_FALLBACK_SRC, BRAND_SETTINGS_ID } from '@/lib/brand';
import { getBrandSettingsLogoUrl } from '@/lib/brand-settings-db';

export default async function AdminBrandPage() {
  const logoUrl = await getBrandSettingsLogoUrl(BRAND_SETTINGS_ID);
  const initialLogoUrl = logoUrl ?? BRAND_LOGO_FALLBACK_SRC;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Brand</h1>
        <p className="text-muted-foreground">Atur logo utama website.</p>
      </div>
      <AdminBrandEditor initialLogoUrl={initialLogoUrl} />
    </div>
  );
}

