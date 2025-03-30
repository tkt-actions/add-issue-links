import { GitHub } from '@actions/github/lib/utils';
import { PullRequest } from '../../domain/pullRequest/PullRequest';
import { IssueLinkSection } from './../../domain/pullRequest/pullRequestBody/issueLinkSection/IssueLinkSection';

/**
 * プルリクエストのリポジトリインターフェース
 */
export interface PullRequestRepository {
  /**
   * プルリクエストを更新します
   * @param pullRequest - 更新するプルリクエスト
   */
  update(
    pullRequest: PullRequest,
  ): Promise<
    ReturnType<InstanceType<typeof GitHub>['rest']['pulls']['update']>
  >;

  /**
   * プルリクエストを取得します
   * @param number - プルリクエスト番号
   * @param owner - リポジトリオーナー
   * @param repo - リポジトリ名
   */
  get(number: number, owner: string, repo: string): Promise<PullRequest>;

  /**
   * プルリクエストにコメントを作成します
   * @param pullRequest - プルリクエスト
   * @param issueLink - イシューリンクセクション
   */
  createComment(
    pullRequest: PullRequest,
    issueLink: IssueLinkSection,
  ): Promise<void>;

  /**
   * イシューにユーザーをアサインします
   * @param pullRequest - プルリクエスト
   * @param issueNumber - イシュー番号
   * @param assignee - アサインするユーザー名
   */
  assignIssueToUser(
    pullRequest: PullRequest,
    issueNumber: number,
    assignee: string,
  ): Promise<void>;
}
