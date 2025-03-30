import { AssignIssueToPullRequestCreator } from './AssignIssueToPullRequestCreator';

describe('AssignIssueToPullRequestCreator', () => {
  describe('true', () => {
    it('アサインが有効なインスタンスを作成する', () => {
      const assign = AssignIssueToPullRequestCreator.true();
      expect(assign.isTrue).toBe(true);
    });
  });

  describe('false', () => {
    it('アサインが無効なインスタンスを作成する', () => {
      const assign = AssignIssueToPullRequestCreator.false();
      expect(assign.isTrue).toBe(false);
    });
  });

  describe('buildFromString', () => {
    it('trueの文字列からアサインが有効なインスタンスを作成する', () => {
      const assign = AssignIssueToPullRequestCreator.buildFromString('true');
      expect(assign?.isTrue).toBe(true);
    });

    it('falseの文字列からアサインが無効なインスタンスを作成する', () => {
      const assign = AssignIssueToPullRequestCreator.buildFromString('false');
      expect(assign?.isTrue).toBe(false);
    });

    it('大文字小文字を区別しない', () => {
      const assign = AssignIssueToPullRequestCreator.buildFromString('TRUE');
      expect(assign?.isTrue).toBe(true);
    });

    it('未定義の場合はundefinedを返す', () => {
      const assign = AssignIssueToPullRequestCreator.buildFromString(undefined);
      expect(assign).toBeUndefined();
    });
  });
});
