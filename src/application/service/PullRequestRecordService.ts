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
    if (assign.isTrue) {
      await this.pullRequestRepository.assignIssueToUser(
        pullRequest,
        issueNumber,
        creator,
      );
    }
  };
}
