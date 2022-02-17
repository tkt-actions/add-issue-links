import { IssueLink } from './IssueLinkText';
import { Resolve } from './../../../../resolve/Resolve';
import { Repository } from './../../../../repository/Repository';
import { ResolveWord } from '../resolveWord/ResolveWord';

describe('IssueLink', () => {
  describe('resolve false', () => {
    let issueLink: IssueLink;
    beforeAll(() => {
      issueLink = new IssueLink(332, Resolve.false(), new ResolveWord());
    });
    it('createText', () => {
      expect(issueLink.createText()).toBe('#332');
    });
  });
  describe('resolve true', () => {
    let issueLink: IssueLink;
    beforeAll(() => {
      issueLink = new IssueLink(
        332,
        Resolve.true(),
        new ResolveWord(),
        Repository.build('sample/name'),
      );
    });
    it('createText', () => {
      expect(issueLink.createText()).toBe('Resolve sample/name#332');
    });
  });
});
