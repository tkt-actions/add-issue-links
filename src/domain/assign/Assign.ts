export class Assign {
  private constructor(private readonly value: boolean) {}

  static true = (): Assign => new Assign(true);
  static false = (): Assign => new Assign(false);

  static buildFromString(value: string | undefined): Assign | undefined {
    if (value === undefined) return undefined;
    return value.toLowerCase() === 'true' ? Assign.true() : Assign.false();
  }

  get isTrue(): boolean {
    return this.value;
  }
}
