export class Resolve {
  private static readonly trueStrings = ['true', 'True', 'TRUE', '1'];
  private static readonly falseStrings = ['false', 'False', 'FALSE', '0'];

  static true = () => new Resolve(true);
  static false = () => new Resolve(false);

  static buildFromBoolean = (value: boolean) => new Boolean(value);

  static buildFromString = (value: string): Resolve | undefined => {
    if (Resolve.trueStrings.includes(value)) return Resolve.true();
    if (Resolve.falseStrings.includes(value)) return Resolve.false();
  };

  constructor(private _value: boolean) {}

  get isTrue(): boolean {
    return this._value;
  }
}
