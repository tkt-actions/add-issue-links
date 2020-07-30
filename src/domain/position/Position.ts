const PositionValue = {
  Top: 'top',
  Bottom: 'bottom',
} as const;
type PositionValue = typeof PositionValue[keyof typeof PositionValue];

const isPositionValue = (value: string): value is PositionValue =>
  typeof value === 'string' &&
  Object.values(PositionValue).includes(value as PositionValue);

export class Position {
  static build = (value: string): Position | undefined =>
    isPositionValue(value) ? new Position(value) : undefined;

  constructor(private readonly value: PositionValue) {}

  getIsTop = (): boolean => this.value === PositionValue.Top;
  getIsBottom = (): boolean => this.value === PositionValue.Bottom;
}
