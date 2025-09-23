// Rolagem de d20 com Boons/Banes de Shadow of the Demon Lord
export type SotdlRollResult = {
  d20: number;
  netBoons: number; // boons - banes
  boonBaneDice: number[];
  boonBaneApplied: number; // maior d6 aplicado, sinal conforme boon/bane
  modifier: number;
  total: number;
  breakdown: string;
};

function d(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollD20WithBoons(opts: {
  boons?: number;
  banes?: number;
  modifier?: number;
}): SotdlRollResult {
  const boons = Math.max(0, Math.floor(opts.boons ?? 0));
  const banes = Math.max(0, Math.floor(opts.banes ?? 0));
  const modifier = Math.floor(opts.modifier ?? 0);

  const d20 = d(20);
  const net = boons - banes;

  let pool: number[] = [];
  let applied = 0;

  if (net !== 0) {
    pool = Array.from({ length: Math.abs(net) }, () => d(6));
    const highest = Math.max(...pool);
    applied = net > 0 ? highest : -highest;
  }

  const total = d20 + applied + modifier;

  const bbText =
    net === 0
      ? "sem boons/banes"
      : `${net > 0 ? `+${net} boon(s)` : `${Math.abs(net)} bane(s)`} [${pool.join(", ")}] => ${
          applied > 0 ? `+${applied}` : applied
        }`;

  const modText =
    modifier !== 0
      ? modifier > 0
        ? ` + ${modifier}`
        : ` - ${Math.abs(modifier)}`
      : "";
  const breakdown = `d20(${d20}) + ${bbText}${modText} = ${total}`;

  return {
    d20,
    netBoons: net,
    boonBaneDice: pool,
    boonBaneApplied: applied,
    modifier,
    total,
    breakdown,
  };
}
