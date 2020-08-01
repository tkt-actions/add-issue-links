import * as core from '@actions/core';
import * as github from '@actions/github';
import { BranchIssueNumNotFound } from './domain/error/BranchIssueNumNotFound';
import { PullRequestDataStore } from './infrastructure/datastore/PullRequestDataStore';
import { PullRequestRecordService } from './application/service/PullRequestRecordService';
import { BranchQueryService } from './application/service/BranchQueryService';
import { Position } from './domain/position/Position';
import { Resolve } from './domain/resolve/Resolve';

async function run(): Promise<void> {
  try {
    const withInput = {
      token: core.getInput('repo-token', { required: true }),
      branchPrefix: core.getInput('branch-prefix', { required: true }),
      position: core.getInput('position', { required: false }),
      resolve: core.getInput('resolve', { required: false }),
    };

    const issueNumber = new BranchQueryService(github.context)
      .getBranch()
      .getIssueNumber(withInput.branchPrefix);

    const prUpdateResult = await new PullRequestRecordService(
      new PullRequestDataStore(new github.GitHub(withInput.token)),
    ).addRelatedIssueNumberToBody(
      issueNumber,
      Position.build(withInput.position) ?? Position.bottom(),
      Resolve.buildFromString(withInput.resolve) ?? Resolve.false(),
      github.context,
    );

    core.info(
      `Added issue #${issueNumber} reference to pull request #${prUpdateResult.data.number}.\n${prUpdateResult.data.html_url}`,
    );
  } catch (error) {
    if (error instanceof BranchIssueNumNotFound)
      return core.info(error.message);
    core.setFailed(error.message);
  }
}

run();
