'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { AdminSidebar } from '@/components/admin-sidebar';

export function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        <div className="flex-1 min-w-0">
          <div className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
            <div className="px-4 py-3 flex items-center gap-3">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Open admin menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <div className="h-full overflow-auto">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Admin menu</SheetTitle>
                    </SheetHeader>
                    <AdminSidebar onNavigate={() => setOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
              <div className="text-sm font-semibold text-foreground">Admin</div>
            </div>
          </div>

          <main className="p-4 sm:p-6 lg:p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}

