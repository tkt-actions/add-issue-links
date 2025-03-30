import { PullRequestRecordService } from '../service/PullRequestRecordService';
import { PullRequestQueryService } from '../service/PullRequestQueryService';
import { Context } from '@actions/github/lib/context';
import { PullRequest } from './../../domain/pullRequest/PullRequest';
import { Resolve } from './../../domain/resolve/Resolve';
import { Repository } from './../../domain/repository/Repository';
import { LinkStyle } from './../../domain/linkStyle/LinkStyle';
import { Position } from 'src/domain/position/Position';
import { ResolveWord } from 'src/domain/pullRequest/pullRequestBody/issueLinkSection/resolveWord/ResolveWord';
import { Header } from 'src/domain/pullRequest/pullRequestBody/issueLinkSection/header/Header';
import { AssignIssueToPullRequestCreator } from '../../domain/assign/AssignIssueToPullRequestCreator';
import * as core from '@actions/core';

/**
 * プルリクエストの記録をコーディネートするクラス
 * プルリクエストに関連する操作を調整します
 */
export class PullRequestRecordCoordinator {
  constructor(
    private readonly recordService: PullRequestRecordService,
    private readonly queryService: PullRequestQueryService,
  ) {}

  /**
   * プルリクエストにイシューリンクを追加します
   * @param context - GitHub Actionsのコンテキスト
   * @param issueNumber - イシュー番号
   * @param position - 追加位置
   * @param header - ヘッダー
   * @param resolve - 解決状態
   * @param resolveWord - 解決を示す単語
   * @param repository - リポジトリ
   * @param linkStyle - リンクスタイル
   */
  addIssueLink = async (
    context: Context,
    issueNumber: number,
    position: Position,
    header: Header,
    resolve: Resolve,
    resolveWord: ResolveWord,
    repository: Repository | undefined,
    linkStyle: LinkStyle,
  ): Promise<void> => {
    const pullRequest = await this.queryService.findOne(context);
    await this.addIssueLinkByPullRequest(
      pullRequest,
      issueNumber,
      position,
      header,
      resolve,
      resolveWord,
      repository,
      linkStyle,
    );
  };

  /**
   * プルリクエストにイシューリンクを追加します
   * @param pullRequest - プルリクエスト
   * @param issueNumber - イシュー番号
   * @param position - 追加位置
   * @param header - ヘッダー
   * @param resolve - 解決状態
   * @param resolveWord - 解決を示す単語
   * @param repository - リポジトリ
   * @param linkStyle - リンクスタイル
   */
  addIssueLinkByPullRequest = async (
    pullRequest: PullRequest,
    issueNumber: number,
    position: Position,
    header: Header,
    resolve: Resolve,
    resolveWord: ResolveWord,
    repository: Repository | undefined,
    linkStyle: LinkStyle,
  ): Promise<void> => {
    if (linkStyle.getIsBody())
      await this.recordService.addRelatedIssueNumberToBody(
        pullRequest,
        issueNumber,
        position,
        header,
        resolve,
        resolveWord,
        repository,
      );
    if (linkStyle.getIsComment())
      await this.recordService.addRelatedIssueNumberAsComment(
        pullRequest,
        header,
        issueNumber,
        resolve,
        resolveWord,
        repository,
      );
  };

  /**
   * プルリクエストの作成者をイシューにアサインします
   * @param context - GitHub Actionsのコンテキスト
   * @param issueNumber - イシュー番号
   * @param assign - アサイン設定
   */
  assignIssueToPullRequestCreator = async (
    context: Context,
    issueNumber: number,
    assign: AssignIssueToPullRequestCreator,
  ): Promise<void> => {
    const pullRequest = await this.queryService.findOne(context);
    // PRの作成者情報を取得
    const prCreator = context.payload.pull_request?.user?.login;
    core.debug(`PR作成者情報: ${prCreator}`);

    if (!prCreator) {
      core.warning(
        'PR作成者情報が取得できませんでした。アサイン処理をスキップします。',
      );
      return;
    }

    await this.assignIssueToPullRequestCreatorByPullRequest(
      pullRequest,
      issueNumber,
      assign,
      prCreator,
    );
  };

  /**
   * プルリクエストの作成者をイシューにアサインします
   * @param pullRequest - プルリクエスト
   * @param issueNumber - イシュー番号
   * @param assign - アサイン設定
   * @param creator - プルリクエスト作成者
   */
  assignIssueToPullRequestCreatorByPullRequest = async (
    pullRequest: PullRequest,
    issueNumber: number,
    assign: AssignIssueToPullRequestCreator,
    creator: string,
  ): Promise<void> => {
    await this.recordService.assignIssueToPullRequestCreator(
      pullRequest,
      issueNumber,
      assign,
      creator,
    );
  };
}
