import { LogoutButton } from '@/components/shared/LogoutButton';

type Props = {
  title: string;
  subtitle?: string;
};

/** Page title row with greeting on the left and logout button on the right */
export function PageGreeting({ title, subtitle }: Props) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      <LogoutButton />
    </div>
  );
}
