import { PullRequestRepository } from '../repository/PullRequestRepository';
import { Position } from './../../domain/position/Position';
import { Resolve } from './../../domain/resolve/Resolve';
import { IssueLinkSection } from './../../domain/pullRequest/pullRequestBody/issueLinkSection/IssueLinkSection';
import { IssueLink } from './../../domain/pullRequest/pullRequestBody/issueLinkSection/issueLink/IssueLinkText';
import { Repository } from './../../domain/repository/Repository';
import { PullRequest } from './../../domain/pullRequest/PullRequest';
import { ResolveWord } from 'src/domain/pullRequest/pullRequestBody/issueLinkSection/resolveWord/ResolveWord';
import { Header } from 'src/domain/pullRequest/pullRequestBody/issueLinkSection/header/Header';
import { AssignIssueToPullRequestCreator } from '../../domain/assign/AssignIssueToPullRequestCreator';
import * as core from '@actions/core';

/**
 * プルリクエストの記録サービス
 * プルリクエストに関連する操作を提供します
 */
export class PullRequestRecordService {
  constructor(private readonly pullRequestRepository: PullRequestRepository) {}

  /**
   * プルリクエストにコメントとしてイシュー番号を追加します
   * @param pullRequest - プルリクエスト
   * @param header - ヘッダー
   * @param issueNumber - イシュー番号
   * @param resolve - 解決状態
   * @param resolveWord - 解決を示す単語
   * @param repository - リポジトリ
   */
  addRelatedIssueNumberAsComment = async (
    pullRequest: PullRequest,
    header: Header,
    issueNumber: number,
    resolve: Resolve,
    resolveWord: ResolveWord,
    repository: Repository | undefined,
  ) =>
    this.pullRequestRepository.createComment(
      pullRequest,
      new IssueLinkSection(
        [new IssueLink(issueNumber, resolve, resolveWord, repository)],
        header,
      ),
    );

  /**
   * プルリクエストの本文にイシュー番号を追加します
   * @param pullRequest - プルリクエスト
   * @param issueNumber - イシュー番号
   * @param position - 追加位置
   * @param header - ヘッダー
   * @param resolve - 解決状態
   * @param resolveWord - 解決を示す単語
   * @param repository - リポジトリ
   */
  addRelatedIssueNumberToBody = async (
    pullRequest: PullRequest,
    issueNumber: number,
    position: Position,
    header: Header,
    resolve: Resolve,
    resolveWord: ResolveWord,
    repository: Repository | undefined,
  ) => {
    pullRequest.body.addRelatedIssueSection(
      new IssueLinkSection(
        [new IssueLink(issueNumber, resolve, resolveWord, repository)],
        header,
      ),
      position,
    );
    return await this.pullRequestRepository.update(pullRequest);
  };

  /**
   * プルリクエストの作成者をイシューにアサインします
   * @param pullRequest - プルリクエスト
   * @param issueNumber - イシュー番号
   * @param assign - アサイン設定
   * @param creator - プルリクエスト作成者
   */
  assignIssueToPullRequestCreator = async (
    pullRequest: PullRequest,
    issueNumber: number,
    assign: AssignIssueToPullRequestCreator,
    creator: string,
  ): Promise<void> => {
    core.debug(
      `アサイン処理開始: イシュー #${issueNumber}, 作成者: ${creator}`,
    );
    core.debug(
      `PR情報: owner=${pullRequest.owner}, repo=${pullRequest.repo}, number=${pullRequest.number}`,
    );
    core.debug(`アサイン設定: ${assign.isTrue ? '有効' : '無効'}`);

    if (assign.isTrue) {
      core.debug(
        `アサイン処理実行: ユーザー ${creator} をイシュー #${issueNumber} にアサイン`,
      );
      try {
        await this.pullRequestRepository.assignIssueToUser(
          pullRequest,
          issueNumber,
          creator,
        );
        core.debug(
          `アサイン処理成功: ユーザー ${creator} をイシュー #${issueNumber} にアサイン完了`,
        );
      } catch (error) {
        core.debug(
          `アサイン処理失敗: ${
            error instanceof Error ? error.message : '不明なエラー'
          }`,
        );
        throw error;
      }
    } else {
      core.debug('アサイン設定が無効のためスキップ');
    }
  };
}
