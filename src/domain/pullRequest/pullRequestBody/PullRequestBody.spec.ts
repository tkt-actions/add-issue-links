import { PullRequestBody } from './PullRequestBody';

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
});
