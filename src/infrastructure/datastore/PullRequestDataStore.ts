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
   * プルリクエストにプレーンテキストのコメントを作成します
   * @param pullRequest - プルリクエスト
   * @param body - コメント本文
   */
  createPlainTextComment = async (
    pullRequest: PullRequest,
    body: string,
  ): Promise<void> => {
    if (!body) {
      console.log('コメント本文が空のため、コメント作成をスキップします。');
      return;
    }

    await this.issuesClient.createComment({
      owner: pullRequest.owner,
      repo: pullRequest.repo,
      issue_number: pullRequest.number, // PRの番号を使用
      body: body, // 受け取った本文をそのまま使用
    });
  };

  /**
   * イシューにユーザーをアサインします
   * @param owner - リポジトリオーナー
   * @param repo - リポジトリ名
   * @param issueNumber - イシュー番号
   * @param assignee - アサインするユーザー名
   */
  assignIssueToUser = async (
    owner: string,
    repo: string,
    issueNumber: number,
    assignee: string,
  ): Promise<void> => {
    try {
      console.log(
        `Assigning user ${assignee} to issue #${issueNumber} in ${owner}/${repo}`,
      );

      // デバッグ情報を追加
      console.log('API呼び出し情報:');
      console.log({
        endpoint: 'issues.addAssignees',
        params: {
          repo: repo,
          owner: owner,
          issue_number: issueNumber,
          assignees: [assignee],
        },
      });

      // GitHub API呼び出し前にHTTPリクエスト詳細をログ出力
      console.log(
        `GitHub API URL: https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/assignees`,
      );
      console.log(`GitHub User Agent: @actions/github`);

      await this.issuesClient.addAssignees({
        repo: repo,
        owner: owner,
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

      // エラーオブジェクトの詳細情報を出力
      if (error instanceof Error) {
        console.error('エラー詳細:');
        console.error(`名前: ${error.name}`);
        console.error(`メッセージ: ${error.message}`);
        console.error(`スタック: ${error.stack}`);

        // レスポンスの情報がある場合は出力
        const anyError = error as any;
        if (anyError.response) {
          console.error('APIレスポンス情報:');
          console.error(`ステータス: ${anyError.response.status}`);
          console.error(`ステータステキスト: ${anyError.response.statusText}`);
          console.error(
            `データ: ${JSON.stringify(anyError.response.data, null, 2)}`,
          );
          console.error(
            `ヘッダー: ${JSON.stringify(anyError.response.headers, null, 2)}`,
          );
        }
      }

      // リポジトリやイシュー番号をより明確に出力
      console.error(
        `Issue: #${issueNumber}, Owner: ${owner}, Repo: ${repo}, Assignee: ${assignee}`,
      );
      throw error;
    }
  };
}
