import { IssueLink } from './IssueLinkText';
import { Resolve } from './../../../../resolve/Resolve';

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
      issueLink = new IssueLink(332, Resolve.true());
    });
    it('createText', () => {
      expect(issueLink.createText()).toBe('Resolve #332');
    });
  });
});
