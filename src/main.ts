import * as core from '@actions/core';
import * as github from '@actions/github';
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

async function run(): Promise<void> {
  try {
    const withInput = {
      token: core.getInput('repo-token', { required: true }),
      branchPrefix: core.getInput('branch-prefix', { required: false }),
      position: core.getInput('position', { required: false }),
      resolve: core.getInput('resolve', { required: false }),
      repository: core.getInput('repository', { required: false }),
      linkStyle: core.getInput('link-style', { required: false }),
    };

    core.debug(Object.values(withInput).toString());

    const issueNumber = new BranchQueryService(github.context)
      .getBranch()
      .getIssueNumber(withInput.branchPrefix);

    new PullRequestRecordCoordinator(
      new PullRequestRecordService(
        new PullRequestDataStore(new github.GitHub(withInput.token)),
      ),
      new PullRequestQueryService(
        new PullRequestDataStore(new github.GitHub(withInput.token)),
      ),
    ).addIssueLink(
      github.context,
      issueNumber,
      Position.build(withInput.position) ?? Position.bottom(),
      Resolve.buildFromString(withInput.resolve) ?? Resolve.false(),
      Repository.build(withInput.repository),
      LinkStyle.build(withInput.linkStyle) ?? LinkStyle.body(),
    );

    core.info(
      `Added issue #${issueNumber} reference to pull request ${withInput.repository}#${issueNumber}.`,
    );
  } catch (error) {
    if (error instanceof BranchIssueNumNotFound) return core.setFailed(error);
    if (error instanceof Error) return core.setFailed(error);
    return core.setFailed('uncaught error occurred');
  }
}

run();
