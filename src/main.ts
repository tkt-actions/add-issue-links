import * as core from '@actions/core';
import { getOctokit, context } from '@actions/github';
import { BranchIssueNumNotFound } from './domain/error/BranchIssueNumNotFound';
import { PullRequestDataStore } from './infrastructure/datastore/PullRequestDataStore';
import { PullRequestRecordService } from './application/service/PullRequestRecordService';
import { BranchQueryService } from './application/service/BranchQueryService';
import { Position } from './domain/position/Position';
import { Resolve } from './domain/resolve/Resolve';
import { Repository } from './domain/repository/Repository';
import { PullRequestRecordCoordinator } from './application/coordinator/PullRequestRecordCoordinator';
import { PullRequestQueryService } from './application/service/PullRequestQueryService';
import { LinkStyle } from './domain/linkStyle/LinkStyle';
import { ResolveWord } from './domain/pullRequest/pullRequestBody/issueLinkSection/resolveWord/ResolveWord';

async function run(): Promise<void> {
  try {
    const withInput = {
      token: core.getInput('repo-token', { required: true }),
      branchPrefix: core.getInput('branch-prefix', { required: false }),
      position: core.getInput('position', { required: false }),
      resolve: core.getInput('resolve', { required: false }),
      resolveWord: core.getInput('resolve-word', { required: false }),
      repository: core.getInput('repository', { required: false }),
      linkStyle: core.getInput('link-style', { required: false }),
    };

    core.debug(Object.values(withInput).toString());

    const issueNumber = new BranchQueryService(context)
      .getBranch()
      .getIssueNumber(withInput.branchPrefix);

    new PullRequestRecordCoordinator(
      new PullRequestRecordService(
        new PullRequestDataStore(getOctokit(withInput.token)),
      ),
      new PullRequestQueryService(
        new PullRequestDataStore(getOctokit(withInput.token)),
      ),
    ).addIssueLink(
      context,
      issueNumber,
      Position.build(withInput.position) ?? Position.bottom(),
      Resolve.buildFromString(withInput.resolve) ?? Resolve.false(),
      withInput.resolveWord
        ? new ResolveWord(withInput.resolveWord)
        : new ResolveWord(),
      Repository.build(withInput.repository),
      LinkStyle.build(withInput.linkStyle) ?? LinkStyle.body(),
    );

    core.info(
      `Added issue #${issueNumber} reference to pull request ${withInput.repository}#${issueNumber}.`,
    );
  } catch (error) {
    if (error instanceof BranchIssueNumNotFound)
      return core.info(`BranchIssueNumNotFound: ${error.message}`);
    if (error instanceof Error) return core.setFailed(error);
    return core.setFailed('uncaught error occurred');
  }
}

run();
