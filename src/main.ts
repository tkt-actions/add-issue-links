import * as core from '@actions/core'
import * as github from '@actions/github'
import {getIssueNumber} from './utils'
import {PullRequestRepository} from './repository/PullRequestRepository'
import {BranchIssueNumNotFound} from './domain/error/BranchIssueNumNotFound'

async function run(): Promise<void> {
  try {
    // Get the issue number based on branch name
    const branchName = github.context.payload.pull_request?.head.ref
    const branchPrefix = core.getInput('branch-prefix', {required: true})

    const issueNumber = getIssueNumber(branchName, branchPrefix)

    const token = core.getInput('repo-token', {required: true})
    const client = new github.GitHub(token)

    const {repo, issue} = github.context

    const prRepository = new PullRequestRepository(client)
    const pr = await prRepository.get(issue.number, repo.owner, repo.repo)
    const response = await prRepository.update(
      pr.addRelatedIssueNumberToBody(issueNumber)
    )

    core.info(
      `Added issue #${issueNumber} reference to pull request #${issue.number}.\n${response.data.html_url}`
    )
  } catch (error) {
    if (error instanceof BranchIssueNumNotFound) return core.info(error.message)
    core.setFailed(error.message)
  }
}

run()
