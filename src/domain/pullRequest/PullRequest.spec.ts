import { PullRequest } from './PullRequest';
import { PullRequestBody } from './pullRequestBody/PullRequestBody';
import { Position } from '../position/Position';
import { IssueLink } from './pullRequestBody/issueLinkSection/issueLink/IssueLinkText';
import { Resolve } from '../resolve/Resolve';
import { IssueLinkSection } from './pullRequestBody/issueLinkSection/IssueLinkSection';
import { Repository } from '../repository/Repository';

describe('PullRequest', () => {
  describe('bottom', () => {
    it('into bottom', () => {
      const pr = new PullRequest(
        'title',
        new PullRequestBody('some description'),
        3,
        'tktcorporation',
        'pr-action',
      );
      pr.body.addRelatedIssueSection(
        new IssueLinkSection([
          new IssueLink(12, Resolve.true(), Repository.build('owner/sample')),
        ]),
        Position.bottom(),
      );
      expect(pr.body.value).toBe(
        `some description\n\n# Related Issue\n\n- Resolve owner/sample#12`,
      );
    });
    it('into bottom of blank', () => {
      const pr = new PullRequest(
        'title',
        new PullRequestBody(''),
        3,
        'tktcorporation',
        'pr-action',
      );
      pr.body.addRelatedIssueSection(
        new IssueLinkSection([
          new IssueLink(12, Resolve.true(), Repository.build('owner/sample')),
        ]),
        Position.bottom(),
      );
      expect(pr.body.value).toBe(
        `# Related Issue\n\n- Resolve owner/sample#12`,
      );
    });
    it('into bottom of null', () => {
      const pr = new PullRequest(
        'title',
        new PullRequestBody(null),
        3,
        'tktcorporation',
        'pr-action',
      );
      pr.body.addRelatedIssueSection(
        new IssueLinkSection([
          new IssueLink(12, Resolve.true(), Repository.build('owner/sample')),
        ]),
        Position.bottom(),
      );
      expect(pr.body.value).toBe(
        `# Related Issue\n\n- Resolve owner/sample#12`,
      );
    });
  });
  describe('top', () => {
    it('into top', () => {
      const pr = new PullRequest(
        'title',
        new PullRequestBody('some description'),
        3,
        'tktcorporation',
        'pr-action',
      );
      pr.body.addRelatedIssueSection(
        new IssueLinkSection([
          new IssueLink(12, Resolve.true(), Repository.build('owner/sample')),
        ]),
        Position.top(),
      );
      expect(pr.body.value).toBe(
        `# Related Issue\n\n- Resolve owner/sample#12\n\nsome description`,
      );
    });
    it('into top of blank', () => {
      const pr = new PullRequest(
        'title',
        new PullRequestBody(''),
        3,
        'tktcorporation',
        'pr-action',
      );
      pr.body.addRelatedIssueSection(
        new IssueLinkSection([
          new IssueLink(12, Resolve.true(), Repository.build('owner/sample')),
        ]),
        Position.top(),
      );
      expect(pr.body.value).toBe(
        `# Related Issue\n\n- Resolve owner/sample#12`,
      );
    });
    it('into top of null', () => {
      const pr = new PullRequest(
        'title',
        new PullRequestBody(null),
        3,
        'tktcorporation',
        'pr-action',
      );
      pr.body.addRelatedIssueSection(
        new IssueLinkSection([
          new IssueLink(12, Resolve.true(), Repository.build('owner/sample')),
        ]),
        Position.top(),
      );
      expect(pr.body.value).toBe(
        `# Related Issue\n\n- Resolve owner/sample#12`,
      );
    });
  });
});
