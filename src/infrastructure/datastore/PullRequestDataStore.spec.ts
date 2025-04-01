import { PullRequestDataStore } from './PullRequestDataStore';
import { PullRequest } from '../../domain/pullRequest/PullRequest';
import { PullRequestBody } from '../../domain/pullRequest/pullRequestBody/PullRequestBody';
import { IssueLinkSection } from '../../domain/pullRequest/pullRequestBody/issueLinkSection/IssueLinkSection';
import { Header } from '../../domain/pullRequest/pullRequestBody/issueLinkSection/header/Header';
import { IssueLink } from '../../domain/pullRequest/pullRequestBody/issueLinkSection/issueLink/IssueLinkText';
import { Resolve } from '../../domain/resolve/Resolve';
import { ResolveWord } from '../../domain/pullRequest/pullRequestBody/issueLinkSection/resolveWord/ResolveWord';

describe('PullRequestDataStore', () => {
  const mockClient = {
    rest: {
      pulls: {
        update: jest.fn(),
        get: jest.fn(),
      },
      issues: {
        createComment: jest.fn(),
        addAssignees: jest.fn(),
      },
    },
  };

  const pullRequest = new PullRequest(
    'title',
    new PullRequestBody('body'),
    1,
    'owner',
    'repo',
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('プルリクエストを更新する', async () => {
      const dataStore = new PullRequestDataStore(mockClient as any);
      await dataStore.update(pullRequest);

      expect(mockClient.rest.pulls.update).toHaveBeenCalledWith({
        body: 'body',
        pull_number: 1,
        owner: 'owner',
        repo: 'repo',
      });
    });
  });

  describe('get', () => {
    it('プルリクエストを取得する', async () => {
      const mockData = {
        title: 'title',
        body: 'body',
        number: 1,
        user: {
          login: 'owner',
        },
        base: {
          repo: {
            name: 'repo',
          },
        },
      };
      mockClient.rest.pulls.get.mockResolvedValue({ data: mockData });

      const dataStore = new PullRequestDataStore(mockClient as any);
      const result = await dataStore.get(1, 'owner', 'repo');

      expect(mockClient.rest.pulls.get).toHaveBeenCalledWith({
        pull_number: 1,
        owner: 'owner',
        repo: 'repo',
      });
      expect(result.title).toBe(pullRequest.title);
      expect(result.body.value).toBe(pullRequest.body.value);
      expect(result.number).toBe(pullRequest.number);
      expect(result.owner).toBe(pullRequest.owner);
      expect(result.repo).toBe(pullRequest.repo);
    });
  });

  describe('createComment', () => {
    it('プルリクエストにコメントを作成する', async () => {
      const issueLinkSection = new IssueLinkSection(
        [new IssueLink(1, Resolve.false(), new ResolveWord())],
        new Header('# Related Issue'),
      );

      const dataStore = new PullRequestDataStore(mockClient as any);
      await dataStore.createComment(pullRequest, issueLinkSection);

      expect(mockClient.rest.issues.createComment).toHaveBeenCalledWith({
        body: '# Related Issue\n\n- #1',
        repo: 'repo',
        owner: 'owner',
        issue_number: 1,
      });
    });
  });

  describe('assignIssueToUser', () => {
    it('イシューにユーザーをアサインする', async () => {
      const dataStore = new PullRequestDataStore(mockClient as any);
      await dataStore.assignIssueToUser('owner', 'repo', 1, 'username');

      expect(mockClient.rest.issues.addAssignees).toHaveBeenCalledWith({
        repo: 'repo',
        owner: 'owner',
        issue_number: 1,
        assignees: ['username'],
      });
    });
  });
});
