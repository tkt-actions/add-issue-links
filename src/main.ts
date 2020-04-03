import * as core from '@actions/core'
import * as github from '@actions/github'
import {getIssueNumber} from './utils'
import {PullRequestRepository} from './repository/PullRequestRepository'

async function run(): Promise<void> {
  try {
    // Get the issue number based on branch name
    const branchName = github.context.payload.pull_request?.head.ref
    const branchPrefix = core.getInput('branch-prefix', {required: true})
    const pattern = new RegExp(`${branchPrefix}([0-9]+)`)

    const issueNumber = getIssueNumber(branchName, pattern)

    // Skip process to add an issue reference to a pull request
    if (issueNumber === 0) {
      core.info('Skiped process to add an issue reference to a pull request.')
      return
    }

    const token = core.getInput('repo-token', {required: true})
    const client = new github.GitHub(token)

    const {repo, issue} = github.context

    const prRepository = new PullRequestRepository(client)
    const pr = await prRepository.get(issueNumber, repo.owner, repo.repo)
    const response = await prRepository.update(
      pr.addRelatedIssueNumberToBody(issueNumber)
    )

    core.info(
      `Added issue #${issueNumber} reference to pull request #${issue.number}.\n${response.data.html_url}`
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
