'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES } from '@/lib/categories';
import { getCategoryEmoji } from '@/lib/utils';

// Reusable category dropdown for forms
export function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as string)}>
      <SelectTrigger>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORIES.map((cat) => (
          <SelectItem key={cat} value={cat}>
            {getCategoryEmoji(cat)} {cat}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
