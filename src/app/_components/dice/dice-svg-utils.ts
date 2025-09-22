/**
 * dice-svg-utils.ts
 *
 * Funções utilitárias para geração de SVGs de dados.
 *
 * - getD6Dots(value): retorna posições dos pontos para d6
 * - getD20PolygonPoints(size): retorna string de pontos para polígono d20
 *
 * Utilizado por: DiceD6, DiceD20
 */

export function getD6Dots(value: number): [number, number][] {
  const dots: [number, number][][] = [
    [],
    [[27, 27]],
    [[15, 15], [39, 39]],
    [[15, 15], [27, 27], [39, 39]],
    [[15, 15], [39, 15], [15, 39], [39, 39]],
    [[15, 15], [39, 15], [27, 27], [15, 39], [39, 39]],
    [[15, 15], [39, 15], [15, 27], [39, 27], [15, 39], [39, 39]],
  ];
  return dots[value] || [];
}
export function getD20PolygonPoints(size: number = 54): string {
  return Array.from({ length: 20 }, (_, i) => {
    const angle = ((2 * Math.PI) / 20) * i - Math.PI / 2;
    return `${size / 2 + (size / 2.1) * Math.cos(angle)},${size / 2 + (size / 2.1) * Math.sin(angle)}`;
  }).join(" ");
}