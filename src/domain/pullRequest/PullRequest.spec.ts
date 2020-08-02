import { PullRequest } from './PullRequest';
import { PullRequestBody } from './pullRequestBody/PullRequestBody';
import { Position } from '../position/Position';
import { IssueLink } from './pullRequestBody/issueLinkSection/issueLink/IssueLinkText';
import { Resolve } from '../resolve/Resolve';
import { IssueLinkSection } from './pullRequestBody/issueLinkSection/IssueLinkSection';
import { Repository } from '../repository/Repository';

describe('PullRequest', () => {
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
});
