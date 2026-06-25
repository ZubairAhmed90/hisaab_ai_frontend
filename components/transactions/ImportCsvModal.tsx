'use client';

import { useState } from 'react';
import { FileSpreadsheet, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AppFormModal } from '@/components/shared/AppFormModal';
import api from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

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
    <AppFormModal
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setFile(null);
      }}
      trigger={
        <Button variant="outline" className="gap-2">
          <Upload size={16} /> Import CSV
        </Button>
      }
      title="Import CSV"
      description="Upload a bank statement CSV from UBL, HBL, or other supported banks."
      icon={FileSpreadsheet}
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!file || loading}
            onClick={handleUpload}
            className="bg-lime text-gray-900 shadow-[0_4px_14px_rgba(232,255,87,0.35)] hover:bg-lime/90 hover:text-gray-900"
          >
            {loading ? 'Uploading…' : 'Upload CSV'}
          </Button>
        </>
      }
    >
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-surface/50 px-6 py-10 transition-all hover:border-lime/50 hover:bg-lime/5">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Upload size={22} className="text-primary" />
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {file ? file.name : 'Choose a CSV file'}
        </span>
        <span className="mt-1 text-xs text-muted">Click to browse · .csv only</span>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>
    </AppFormModal>
  );
}
