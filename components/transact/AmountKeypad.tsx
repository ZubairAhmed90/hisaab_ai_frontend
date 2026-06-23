'use client';

import { Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

export function AmountKeypad({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const press = (key: string) => {
    if (key === '.' && value.includes('.')) return;
    if (value === '0' && key !== '.') {
      onChange(key);
      return;
    }
    onChange(value + key);
  };

  const backspace = () => onChange(value.slice(0, -1));

  return (
    <div className="grid grid-cols-3 gap-2 px-1">
      {KEYS.map((key) => (
        <Button
          key={key}
          type="button"
          variant="outline"
          className="h-14 rounded-2xl text-xl font-semibold"
          onClick={() => press(key)}
        >
          {key}
        </Button>
      ))}
      <Button type="button" variant="outline" className="h-14 rounded-2xl" onClick={backspace}>
        <Delete size={22} />
      </Button>
    </div>
  );
}
