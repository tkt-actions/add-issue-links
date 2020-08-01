import { PullRequestBody } from './PullRequestBody';
import { Position } from '../../position/Position';
import { Resolve } from '../../resolve/Resolve';
import { container } from 'tsyringe';

interface IPullRequestBody {
  value: string;
  addIntoTop(str: string): void;
  addIntoBottom(str: string): void;
  addRelatedIssueSection(
    issueNumber: number,
    position: Position,
    resolve: Resolve,
  );
}

describe('PullRequestBody', () => {
  let pullRequestBody: IPullRequestBody;
  beforeAll(() => {
    // pullRequestBody = PullRequestBody("description");
  });
  it('addIntoTopOfBody', () => {
    pullRequestBody.addIntoTop('top');
    expect(pullRequestBody.value).toBe('top\n\ndescription');
  });

  it('addIntoBottomOfBody', () => {
    pullRequestBody.addIntoBottom('bottom');
    expect(pullRequestBody.value).toBe('description\n\nbottom');
  });

  describe('addRelatedIssueNumberToBody', () => {
    it('into top', () => {
      pullRequestBody.addRelatedIssueSection(
        12,
        Position.top(),
        Resolve.true(),
      );
      expect(pullRequestBody.value).toBe(
        `# Related Issue\n\n- Resolve #12\n\ndescription`,
      );
    });
    it('into bottom', () => {
      pullRequestBody.addRelatedIssueSection(
        12,
        Position.bottom(),
        Resolve.false(),
      );
      expect(pullRequestBody.value).toBe(
        `description\n\n# Related Issue\n\n- #12`,
      );
    });
  });
});
