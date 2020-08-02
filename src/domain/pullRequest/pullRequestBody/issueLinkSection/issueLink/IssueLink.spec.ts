import { IssueLink } from './IssueLinkText';
import { Resolve } from './../../../../resolve/Resolve';
import { Repository } from './../../../../repository/Repository';

describe('IssueLink', () => {
  describe('resolve false', () => {
    let issueLink: IssueLink;
    beforeAll(() => {
      issueLink = new IssueLink(332, Resolve.false());
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
        Repository.build('sample/name'),
      );
    });
    it('createText', () => {
      expect(issueLink.createText()).toBe('Resolve sample/name#332');
    });
  });
});
