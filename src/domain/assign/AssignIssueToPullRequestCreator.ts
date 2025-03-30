/**
 * プルリクエスト作成者をイシューにアサインするかどうかを制御するドメインモデル
 *
 * このクラスは、プルリクエストが作成された際に、関連付けられたイシューに対して
 * プルリクエストの作成者をアサインするかどうかを制御します。
 *
 * @example
 * ```typescript
 * // デフォルトはfalse
 * const assign = AssignIssueToPullRequestCreator.false();
 *
 * // 文字列から作成
 * const assign = AssignIssueToPullRequestCreator.buildFromString('true');
 * ```
 */
export class AssignIssueToPullRequestCreator {
  private constructor(private readonly value: boolean) {}

  /**
   * アサインを有効にするインスタンスを作成します
   * @returns アサインが有効なインスタンス
   */
  static true = (): AssignIssueToPullRequestCreator => new AssignIssueToPullRequestCreator(true);

  /**
   * アサインを無効にするインスタンスを作成します
   * @returns アサインが無効なインスタンス
   */
  static false = (): AssignIssueToPullRequestCreator => new AssignIssueToPullRequestCreator(false);

  /**
   * 文字列からインスタンスを作成します
   * @param value - 文字列値（'true' または 'false'）
   * @returns 文字列値に対応するインスタンス。値が未定義の場合はundefined
   */
  static buildFromString(value: string | undefined): AssignIssueToPullRequestCreator | undefined {
    if (value === undefined) return undefined;
    return value.toLowerCase() === 'true'
      ? AssignIssueToPullRequestCreator.true()
      : AssignIssueToPullRequestCreator.false();
  }

  /**
   * アサインが有効かどうかを取得します
   * @returns アサインが有効な場合はtrue、無効な場合はfalse
   */
  get isTrue(): boolean {
    return this.value;
  }
}
