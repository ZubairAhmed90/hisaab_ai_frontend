'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import { TransactFlowCard, TransactFlowHeader } from '@/components/transact/TransactFlow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BANKS } from '@/lib/mockData';

export default function AddBeneficiaryPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [bank, setBank] = useState(BANKS[0]);
  const [account, setAccount] = useState('');

  const handleSave = () => {
    if (!name || account.length < 4) {
      toast.error('Please fill all fields');
      return;
    }
    toast.success(`${name} added as beneficiary`);
    router.push('/transact/send');
  };

  return (
    <>
      <TransactFlowHeader
        title="Add beneficiary"
        current={0}
        steps={[{ label: 'New contact' }]}
      />
      <div className="mx-auto max-w-xl">
        <TransactFlowCard>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <UserPlus size={22} className="text-accent" />
            </div>
            <p className="text-sm text-muted">Save a contact for faster transfers</p>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Bank</Label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              >
                {BANKS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input value={account} onChange={(e) => setAccount(e.target.value)} className="rounded-xl" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => router.push('/transact/send')}>
                Cancel
              </Button>
              <Button className="flex-1 rounded-xl" onClick={handleSave}>
                Save beneficiary
              </Button>
            </div>
          </div>
        </TransactFlowCard>
      </div>
    </>
  );
}
