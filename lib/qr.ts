export type PayQrPayload = {
  v: 1;
  type: 'hisaab_pay';
  name: string;
  uid: number;
  account: string;
  amount?: number;
};

export function buildAccountId(uid: number) {
  return `HA-${String(uid).padStart(6, '0')}`;
}

export function buildPayQrPayload(
  user: { id?: number; name?: string; account_number?: string | null },
  amount?: number,
): PayQrPayload {
  const uid = user.id ?? 0;
  return {
    v: 1,
    type: 'hisaab_pay',
    name: user.name || 'HisaabAI User',
    uid,
    // Prefer real DB account_number so QR matches Balance card (e.g. HA-746991)
    account: user.account_number || buildAccountId(uid),
    ...(amount && amount > 0 ? { amount } : {}),
  };
}

export function encodePayQr(payload: PayQrPayload): string {
  return JSON.stringify(payload);
}

export function parsePayQr(raw: string): PayQrPayload | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('{')) {
    try {
      const data = JSON.parse(trimmed) as PayQrPayload;
      if (data.type === 'hisaab_pay' && data.v === 1 && data.name) return data;
    } catch {
      /* fall through */
    }
  }

  if (trimmed.startsWith('hisaabai://pay')) {
    try {
      const url = new URL(trimmed.replace('hisaabai://', 'https://hisaab.ai/'));
      const name = url.searchParams.get('name');
      const uid = Number(url.searchParams.get('uid') || 0);
      const amount = url.searchParams.get('amount');
      if (name && uid) {
        return {
          v: 1,
          type: 'hisaab_pay',
          name,
          uid,
          account: buildAccountId(uid),
          ...(amount ? { amount: Number(amount) } : {}),
        };
      }
    } catch {
      /* fall through */
    }
  }

  return null;
}

export function qrToSendParams(payload: PayQrPayload) {
  return {
    merchantName: payload.name,
    amount: payload.amount ? String(payload.amount) : '',
    qrAccount: payload.account,
    qrUid: String(payload.uid),
  };
}
