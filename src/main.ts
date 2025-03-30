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
import { Header } from './domain/pullRequest/pullRequestBody/issueLinkSection/header/Header';
import { AssignIssueToPullRequestCreator } from './domain/assign/AssignIssueToPullRequestCreator';

async function run(): Promise<void> {
  try {
    const withInput = {
      token: core.getInput('repo-token', { required: true }),
      branchPrefix: core.getInput('branch-prefix', { required: false }),
      position: core.getInput('position', { required: false }),
      header: core.getInput('header', { required: false }),
      resolve: core.getInput('resolve', { required: false }),
      resolveWord: core.getInput('resolve-word', { required: false }),
      repository: core.getInput('repository', { required: false }),
      linkStyle: core.getInput('link-style', { required: false }),
      assignPrCreatorToIssue: core.getInput('assign-pr-creator-to-issue', {
        required: false,
      }),
    };

    core.debug(Object.values(withInput).toString());

    const issueNumber = new BranchQueryService(context)
      .getBranch()
      .getIssueNumber(withInput.branchPrefix);

    const coordinator = new PullRequestRecordCoordinator(
      new PullRequestRecordService(
        new PullRequestDataStore(getOctokit(withInput.token)),
      ),
      new PullRequestQueryService(
        new PullRequestDataStore(getOctokit(withInput.token)),
      ),
    );

    coordinator.addIssueLink(
      context,
      issueNumber,
      Position.build(withInput.position) ?? Position.bottom(),
      withInput.header
        ? new Header(withInput.header)
        : new Header('# Related Issue'),
      Resolve.buildFromString(withInput.resolve) ?? Resolve.false(),
      withInput.resolveWord
        ? new ResolveWord(withInput.resolveWord)
        : new ResolveWord(),
      Repository.build(withInput.repository),
      LinkStyle.build(withInput.linkStyle) ?? LinkStyle.body(),
    );

    // 作成者のアサイン機能を呼び出し
    coordinator.assignIssueToPullRequestCreator(
      context,
      issueNumber,
      AssignIssueToPullRequestCreator.buildFromString(
        withInput.assignPrCreatorToIssue,
      ) ?? AssignIssueToPullRequestCreator.false(),
    );

    core.info(
      `Added issue #${issueNumber} reference to pull request ${withInput.repository}#${issueNumber}.`,
    );

    if (
      AssignIssueToPullRequestCreator.buildFromString(
        withInput.assignPrCreatorToIssue,
      )?.isTrue
    ) {
      core.info(`Assigned the pull request creator to issue #${issueNumber}.`);
    }
  } catch (error) {
    if (error instanceof BranchIssueNumNotFound)
      return core.info(`BranchIssueNumNotFound: ${error.message}`);
    if (error instanceof Error) return core.setFailed(error);
    return core.setFailed('An uncaught error occurred');
  }
}

run();
