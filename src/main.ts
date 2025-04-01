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

    // contextのデバッグ情報を追加
    core.debug('GitHub Context情報:');
    core.debug(`Repository: ${context.repo.owner}/${context.repo.repo}`);
    core.debug(`Event: ${context.eventName}`);
    core.debug(`Action: ${context.action}`);
    core.debug(`Ref: ${context.ref}`);
    core.debug(`SHA: ${context.sha}`);

    if (context.payload.pull_request) {
      core.debug('Pull Request情報:');
      core.debug(`Number: ${context.payload.pull_request.number}`);
      core.debug(`Title: ${context.payload.pull_request.title}`);
      core.debug(
        `Creator: ${context.payload.pull_request.user?.login || 'Unknown'}`,
      );
      core.debug(
        `Head Ref: ${context.payload.pull_request.head?.ref || 'Unknown'}`,
      );
      core.debug(
        `Base Ref: ${context.payload.pull_request.base?.ref || 'Unknown'}`,
      );

      // プロジェクト固有のブランチ情報
      const branchName = context.payload.pull_request.head?.ref || '';
      core.debug(`ブランチ名: ${branchName}`);
      core.debug(`ブランチプレフィックス: ${withInput.branchPrefix}`);

      // プレフィックスとブランチ名からイシュー番号の抽出テスト
      const testRegex = new RegExp(`^${withInput.branchPrefix}(\\d+)(-|$)`);
      const testMatch = branchName.match(testRegex);
      core.debug(`正規表現テスト: ${testRegex}`);
      core.debug(`マッチ結果: ${JSON.stringify(testMatch)}`);

      if (testMatch && testMatch[1]) {
        core.debug(`正規表現で抽出されたイシュー番号: ${testMatch[1]}`);
      } else {
        core.debug(`正規表現でイシュー番号を抽出できませんでした`);
      }
    }

    // イシュー番号の取得
    const branchQueryService = new BranchQueryService(context);
    const branch = branchQueryService.getBranch();
    core.debug(`Branch取得結果: ${JSON.stringify(branch)}`);

    const issueNumber = branch.getIssueNumber(withInput.branchPrefix);

    core.debug(`抽出されたイシュー番号: ${issueNumber}`);
    core.debug(`イシュー番号の型: ${typeof issueNumber}`);

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

    core.debug(`PR追加操作完了: イシュー#${issueNumber}をPRに追加`);

    // 作成者のアサイン機能を呼び出し
    core.debug(
      `アサイン機能の呼び出し準備: イシュー#${issueNumber}にPR作成者をアサイン`,
    );
    core.debug(`アサイン設定: ${withInput.assignPrCreatorToIssue}`);

    coordinator.assignIssueToPullRequestCreator(
      context,
      issueNumber,
      AssignIssueToPullRequestCreator.buildFromString(
        withInput.assignPrCreatorToIssue,
      ) ?? AssignIssueToPullRequestCreator.false(),
      Repository.build(withInput.repository),
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
