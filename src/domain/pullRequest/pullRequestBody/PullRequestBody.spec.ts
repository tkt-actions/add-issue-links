import { PullRequestBody } from './PullRequestBody';
import { Position } from '../../position/Position';
import { Resolve } from '../../resolve/Resolve';
import { Repository } from '../../../domain/repository/Repository';
import { IssueLinkSection } from './issueLinkSection/IssueLinkSection';
import { IssueLink } from './issueLinkSection/issueLink/IssueLinkText';
import { ResolveWord } from './issueLinkSection/resolveWord/ResolveWord';

// interface IPullRequestBody {
//   value: string;
//   addIntoTop(str: string): void;
//   addIntoBottom(str: string): void;
//   addRelatedIssueSection(
//     issueLinkSection: IssueLinkSection,
//     position: Position,
//   ): void;
// }

describe('PullRequestBody', () => {
  it('addIntoTopOfBody', () => {
    const pullRequestBody = new PullRequestBody('description');
    pullRequestBody.addIntoTop('top');
    expect(pullRequestBody.value).toBe('top\n\ndescription');
  });

  it('addIntoBottomOfBody', () => {
    const pullRequestBody = new PullRequestBody('description');
    pullRequestBody.addIntoBottom('bottom');
    expect(pullRequestBody.value).toBe('description\n\nbottom');
  });

  describe('addRelatedIssueNumberToBody', () => {
    it('into top', () => {
      const pullRequestBody = new PullRequestBody('description');
      pullRequestBody.addRelatedIssueSection(
        new IssueLinkSection([
          new IssueLink(12, Resolve.true(), new ResolveWord()),
        ]),
        Position.top(),
      );
      expect(pullRequestBody.value).toBe(
        `# Related Issue\n\n- Resolve #12\n\ndescription`,
      );
    });
    it('into bottom', () => {
      const pullRequestBody = new PullRequestBody('description');
      pullRequestBody.addRelatedIssueSection(
        new IssueLinkSection([
          new IssueLink(12, Resolve.false(), new ResolveWord()),
        ]),
        Position.bottom(),
      );
      expect(pullRequestBody.value).toBe(
        `description\n\n# Related Issue\n\n- #12`,
      );
    });
  });
  describe('Repository option', () => {
    const pullRequestBody = new PullRequestBody('description');
    pullRequestBody.addRelatedIssueSection(
      new IssueLinkSection([
        new IssueLink(
          12,
          Resolve.false(),
          new ResolveWord(),
          Repository.build('owner/sample'),
        ),
      ]),
      Position.bottom(),
    );
    expect(pullRequestBody.value).toBe(
      `description\n\n# Related Issue\n\n- owner/sample#12`,
    );
  });
});
