'use client';

import { useState } from 'react';
import { Link2, Mail, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLinkPartner } from '@/lib/hooks';

// Banner to link a partner account by email
export function LinkPartnerBanner() {
  const [email, setEmail] = useState('');
  const link = useLinkPartner();

  const handleLink = () => {
    if (!email.trim()) return;
    link.mutate(email.trim(), {
      onSuccess: () => {
        toast.success('Partner linked! You can now set shared spending limits.');
        setEmail('');
      },
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Could not link partner';
        toast.error(msg);
      },
    });
  };

  return (
    <div className="rounded-3xl border border-dashed border-primary/25 bg-gradient-to-br from-primary/10 to-primary/5 p-5 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3 sm:flex-1">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <Users size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Link a partner account</p>
            <p className="mt-0.5 text-sm text-muted">
              Connect your spouse or family member to set shared spending limits
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              placeholder="partner@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-border/60 bg-white pl-9 sm:w-64"
            />
          </div>
          <Button onClick={handleLink} disabled={!email || link.isPending} className="gap-2 rounded-xl">
            <Link2 size={16} />
            {link.isPending ? 'Linking...' : 'Link Partner'}
          </Button>
        </div>
      </div>
    </div>
  );
}
