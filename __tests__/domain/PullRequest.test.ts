import {PullRequest} from '../../src/domain/PullRequest'

describe('PullRequest', () => {
  it('addIntoTopOfBody', () => {
    const pr = new PullRequest(
      'title',
      'description',
      2,
      'tktcorporation',
      'pr-action'
    )
    expect(pr.addIntoTopOfBody('top').body).toBe('top\ndescription')
  })

  it('updateBody', () => {
    const pr = new PullRequest(
      'title',
      'some description',
      3,
      'tktcorporation',
      'pr-action'
    )
    expect(pr.updateBody('updated').body).toBe('updated')
  })
  it('addRelatedIssueNumberToBody', () => {
    const pr = new PullRequest(
      'title',
      'some description',
      3,
      'tktcorporation',
      'pr-action'
    )
    expect(pr.addRelatedIssueNumberToBody(12).body).toBe(
      `Issue\n- Resolve #12\nsome description`
    )
  })
})
