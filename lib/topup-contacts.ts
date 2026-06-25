const TOPUP_CONTACTS_KEY = 'hisaab_topup_contacts';

const COLORS = ['#1D9E75', '#D85A30', '#534AB7', '#185FA5', '#B45309', '#6D28D9'];

export type TopupContact = {
  id: number;
  name: string;
  initials: string;
  color: string;
  phone: string;
  operatorId: number;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

function pickColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function readJson<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeJson<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadTopupContacts(): TopupContact[] {
  return readJson<TopupContact>(TOPUP_CONTACTS_KEY);
}

export function saveTopupContact(input: { name: string; phone: string; operatorId: number }) {
  const list = loadTopupContacts();
  const phone = input.phone.replace(/\D/g, '');
  const name = input.name.trim() || phone;
  const existing = list.find((c) => c.phone.replace(/\D/g, '') === phone);
  if (existing) {
    existing.name = name;
    existing.operatorId = input.operatorId;
    writeJson(TOPUP_CONTACTS_KEY, list);
    return existing;
  }
  const next: TopupContact = {
    id: Date.now(),
    name,
    initials: getInitials(name),
    color: pickColor(phone),
    phone: input.phone,
    operatorId: input.operatorId,
  };
  writeJson(TOPUP_CONTACTS_KEY, [...list, next]);
  return next;
}
