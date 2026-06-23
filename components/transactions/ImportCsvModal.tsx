'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import api from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

// Modal to import transactions from a CSV file
export function ImportCsvModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/transactions/import-csv', formData);
      toast.success(`${res.data.data.imported} transactions imported!`);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setOpen(false);
      setFile(null);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" className="gap-2">
          <Upload size={16} /> Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import CSV</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted">
          Upload a bank statement CSV from UBL, HBL, or other supported banks.
        </p>
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface/50 px-6 py-8 transition-colors hover:border-primary/30 hover:bg-surface">
          <Upload size={24} className="mb-2 text-muted" />
          <span className="text-sm font-medium text-gray-700">
            {file ? file.name : 'Choose a CSV file'}
          </span>
          <span className="mt-1 text-xs text-muted">Click to browse</span>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        <Button className="mt-4 w-full" disabled={!file || loading} onClick={handleUpload}>
          {loading ? 'Uploading...' : 'Upload CSV'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
