import { AdminCareerEditor } from '@/components/admin-career-editor';

export default function AdminNewCareerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Lowongan baru</h1>
        <p className="text-muted-foreground">Isi formulir lalu simpan.</p>
      </div>
      <AdminCareerEditor />
    </div>
  );
}
