import { AdminTrustedPartnerEditor } from '@/components/admin-trusted-partner-editor';

export default function AdminNewTrustedPartnerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Mitra baru</h1>
        <p className="text-muted-foreground">Unggah logo dan isi nama brand.</p>
      </div>
      <AdminTrustedPartnerEditor />
    </div>
  );
}
