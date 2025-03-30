import { GitHub } from '@actions/github/lib/utils';
import { PullRequest } from '../../domain/pullRequest/PullRequest';
import { PullRequestRepository } from './../../application/repository/PullRequestRepository';
import { PullRequestBody } from './../../domain/pullRequest/pullRequestBody/PullRequestBody';
import { IssueLinkSection } from './../../domain/pullRequest/pullRequestBody/issueLinkSection/IssueLinkSection';

/**
 * プルリクエストのデータストア
 * GitHub APIを使用してプルリクエストの操作を行います
 */
export class PullRequestDataStore implements PullRequestRepository {
  private readonly client: InstanceType<typeof GitHub>['rest']['pulls'];
  private readonly issuesClient: InstanceType<typeof GitHub>['rest']['issues'];

  constructor(client: InstanceType<typeof GitHub>) {
    this.client = client.rest.pulls;
    this.issuesClient = client.rest.issues;
  }

  /**
   * プルリクエストを更新します
   * @param pullRequest - 更新するプルリクエスト
   */
  update = async (
    pullRequest: PullRequest,
  ): Promise<
    ReturnType<InstanceType<typeof GitHub>['rest']['pulls']['update']>
  > =>
    this.client.update({
      body: pullRequest.body.value,
      pull_number: pullRequest.number,
      owner: pullRequest.owner,
      repo: pullRequest.repo,
    });

  /**
   * プルリクエストを取得します
   * @param number - プルリクエスト番号
   * @param owner - リポジトリオーナー
   * @param repo - リポジトリ名
   */
  get = async (number: number, owner: string, repo: string) => {
    const data = (
      await this.client.get({
        pull_number: number,
        owner,
        repo,
      })
    ).data;
    return new PullRequest(
      data.title,
      new PullRequestBody(data.body),
      data.number,
      owner,
      repo,
    );
  };

  /**
   * プルリクエストにコメントを作成します
   * @param pullRequest - プルリクエスト
   * @param issueLinkSection - イシューリンクセクション
   */
  createComment = async (
    pullRequest: PullRequest,
    issueLinkSection: IssueLinkSection,
  ): Promise<void> => {
    await this.issuesClient.createComment({
      body: issueLinkSection.createText(),
      repo: pullRequest.repo,
      owner: pullRequest.owner,
      issue_number: pullRequest.number,
    });
  };

  /**
   * イシューにユーザーをアサインします
   * @param pullRequest - プルリクエスト
   * @param issueNumber - イシュー番号
   * @param assignee - アサインするユーザー名
   */
  assignIssueToUser = async (
    pullRequest: PullRequest,
    issueNumber: number,
    assignee: string,
  ): Promise<void> => {
    try {
      console.log(
        `Assigning user ${assignee} to issue #${issueNumber} in ${pullRequest.owner}/${pullRequest.repo}`,
      );
      await this.issuesClient.addAssignees({
        repo: pullRequest.repo,
        owner: pullRequest.owner,
        issue_number: issueNumber,
        assignees: [assignee],
      });
      console.log(
        `Successfully assigned user ${assignee} to issue #${issueNumber}`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(`Failed to assign user to issue: ${errorMessage}`);
      console.error(
        `Issue: #${issueNumber}, Owner: ${pullRequest.owner}, Repo: ${pullRequest.repo}, Assignee: ${assignee}`,
      );
      // エラーはここでハンドリングするだけで上位に伝播させないようにする
      // アサイン機能は付加的な機能なので、失敗しても全体の処理を中断させない
    }
  };
}
