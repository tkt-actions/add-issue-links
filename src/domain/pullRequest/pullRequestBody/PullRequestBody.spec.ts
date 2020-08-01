import { PullRequestBody } from './PullRequestBody';
import { Position } from '../../position/Position';

describe('PullRequestBody', () => {
  it('addIntoTopOfBody', () => {
    const prb = new PullRequestBody('description');
    prb.addIntoTop('top');
    expect(prb.value).toBe('top\n\ndescription');
  });

  it('addIntoBottomOfBody', () => {
    const prb = new PullRequestBody('description');
    prb.addIntoBottom('bottom');
    expect(prb.value).toBe('description\n\nbottom');
  });

  describe('addRelatedIssueNumberToBody', () => {
    it('into top', () => {
      const prb = new PullRequestBody('description');
      prb.addRelatedIssueSection(12, Position.top());
      expect(prb.value).toBe(`# Related Issue\n\n- Resolve #12\n\ndescription`);
    });
    it('into bottom', () => {
      const prb = new PullRequestBody('description');
      prb.addRelatedIssueSection(12, Position.bottom());
      expect(prb.value).toBe(`description\n\n# Related Issue\n\n- Resolve #12`);
    });
  });
});
