'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type QrScannerProps = {
  onScan: (data: string) => void;
  className?: string;
};

export function QrScanner({ onScan, className }: QrScannerProps) {
  const [error, setError] = useState('');
  const [active, setActive] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = 'hisaab-qr-reader';

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        /* ignore */
      }
      scannerRef.current = null;
    }
    setActive(false);
  };

  const startCamera = async () => {
    setError('');
    await stopScanner();
    const scanner = new Html5Qrcode(regionId);
    scannerRef.current = scanner;
    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 280, height: 280 } },
        (decoded) => {
          onScan(decoded);
          stopScanner();
        },
        () => {},
      );
      setActive(true);
    } catch {
      setError('Camera unavailable. Upload a QR image instead.');
    }
  };

  const handleFile = async (file: File) => {
    setError('');
    await stopScanner();
    const scanner = new Html5Qrcode(regionId);
    scannerRef.current = scanner;
    try {
      const result = await scanner.scanFile(file, false);
      onScan(result);
    } catch {
      setError('Could not read QR from image. Try another photo.');
    } finally {
      scanner.clear();
      scannerRef.current = null;
    }
  };

  useEffect(() => () => {
    stopScanner();
  }, []);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative min-h-[360px] overflow-hidden rounded-2xl bg-sidebar lg:min-h-[420px]">
        <div id={regionId} className="h-full min-h-[360px] w-full [&>video]:!object-cover lg:min-h-[420px]" />
        {!active ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-sidebar to-primary/90 p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
              <Camera size={36} className="text-lime" />
            </div>
            <p className="max-w-xs text-center text-sm text-white/80">
              Click &quot;Open camera&quot; to scan a payment QR code
            </p>
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-64 w-64 rounded-2xl border-2 border-lime shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] lg:h-72 lg:w-72" />
          </div>
        )}
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="flex gap-3">
        <Button className="h-11 flex-1 gap-2 rounded-xl" onClick={startCamera}>
          <Camera size={18} /> {active ? 'Restart camera' : 'Open camera'}
        </Button>
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <span className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-medium hover:bg-surface">
            <Upload size={18} /> Upload image
          </span>
        </label>
      </div>
    </div>
  );
}
