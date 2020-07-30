import { PullRequest } from './PullRequest';
import { PullRequestBody } from './pullRequestBody/PullRequestBody';
import { Position } from '../position/Position';

describe('PullRequest', () => {
  describe('addRelatedIssueNumberToBody', () => {
    it('into top', () => {
      const pr = new PullRequest(
        'title',
        new PullRequestBody('some description'),
        3,
        'tktcorporation',
        'pr-action',
      );
      pr.body.addRelatedIssueSection(12, Position.top());
      expect(pr.body.value).toBe(
        `# Related Issue\n\n- Resolve #12\n\nsome description`,
      );
    });
    it('into bottom', () => {
      const pr = new PullRequest(
        'title',
        new PullRequestBody('some description'),
        3,
        'tktcorporation',
        'pr-action',
      );
      pr.body.addRelatedIssueSection(12, Position.bottom());
      expect(pr.body.value).toBe(
        `some description\n\n# Related Issue\n\n- Resolve #12`,
      );
    });
  });
});
