import { AdminServiceEditor } from '@/components/admin-service-editor';

export default function AdminNewServicePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Layanan baru</h1>
        <p className="text-muted-foreground">Isi formulir lalu simpan.</p>
      </div>
      <AdminServiceEditor />
    </div>
  );
}
