import { PullRequestBody } from './PullRequestBody';
import { Position } from '../../position/Position';
import { Resolve } from '../../resolve/Resolve';
import { Repository } from '../../../domain/repository/Repository';
import { IssueLinkSection } from './issueLinkSection/IssueLinkSection';
import { IssueLink } from './issueLinkSection/issueLink/IssueLinkText';
import { ResolveWord } from './issueLinkSection/resolveWord/ResolveWord';
import { Header } from './issueLinkSection/header/Header';

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
        new IssueLinkSection(
          [new IssueLink(12, Resolve.true(), new ResolveWord())],
          new Header('# Related Issue'),
        ),
        Position.top(),
      );
      expect(pullRequestBody.value).toBe(
        `# Related Issue\n\n- Resolve #12\n\ndescription`,
      );
    });
    it('into bottom', () => {
      const pullRequestBody = new PullRequestBody('description');
      pullRequestBody.addRelatedIssueSection(
        new IssueLinkSection(
          [new IssueLink(12, Resolve.false(), new ResolveWord())],
          new Header('# Related Issue'),
        ),
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
      new IssueLinkSection(
        [
          new IssueLink(
            12,
            Resolve.false(),
            new ResolveWord(),
            Repository.build('owner/sample'),
          ),
        ],
        new Header('# Related Issue'),
      ),
      Position.bottom(),
    );
    expect(pullRequestBody.value).toBe(
      `description\n\n# Related Issue\n\n- owner/sample#12`,
    );
  });
  describe('Header option', () => {
    const pullRequestBody = new PullRequestBody('description');
    pullRequestBody.addRelatedIssueSection(
      new IssueLinkSection(
        [
          new IssueLink(
            12,
            Resolve.false(),
            new ResolveWord(),
            Repository.build('owner/sample'),
          ),
        ],
        new Header('## Issue Number'),
      ),
      Position.bottom(),
    );
    expect(pullRequestBody.value).toBe(
      `description\n\n## Issue Number\n\n- owner/sample#12`,
    );
  });
});
