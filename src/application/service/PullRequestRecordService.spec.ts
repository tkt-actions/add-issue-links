import { PullRequestRecordService } from './PullRequestRecordService';
import { PullRequestRepository } from '../repository/PullRequestRepository';
import { PullRequest } from '../../domain/pullRequest/PullRequest';
import { PullRequestBody } from '../../domain/pullRequest/pullRequestBody/PullRequestBody';
import { IssueLinkSection } from '../../domain/pullRequest/pullRequestBody/issueLinkSection/IssueLinkSection';
import { Header } from '../../domain/pullRequest/pullRequestBody/issueLinkSection/header/Header';
import { IssueLink } from '../../domain/pullRequest/pullRequestBody/issueLinkSection/issueLink/IssueLinkText';
import { Resolve } from '../../domain/resolve/Resolve';
import { ResolveWord } from '../../domain/pullRequest/pullRequestBody/issueLinkSection/resolveWord/ResolveWord';
import { Position } from '../../domain/position/Position';
import { Repository } from '../../domain/repository/Repository';
import { AssignIssueToPullRequestCreator } from '../../domain/assign/AssignIssueToPullRequestCreator';

describe('PullRequestRecordService', () => {
  const mockRepository: PullRequestRepository = {
    update: jest.fn(),
    get: jest.fn(),
    createComment: jest.fn(),
    assignIssueToUser: jest.fn(),
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

  describe('addRelatedIssueNumberAsComment', () => {
    it('プルリクエストにコメントとしてイシュー番号を追加する', async () => {
      const service = new PullRequestRecordService(mockRepository);
      const header = new Header('# Related Issue');
      const issueNumber = 1;
      const resolve = Resolve.false();
      const resolveWord = new ResolveWord();
      const repository = undefined;

      await service.addRelatedIssueNumberAsComment(
        pullRequest,
        header,
        issueNumber,
        resolve,
        resolveWord,
        repository,
      );

      const expectedIssueLinkSection = new IssueLinkSection(
        [new IssueLink(issueNumber, resolve, resolveWord, repository)],
        header,
      );

      expect(mockRepository.createComment).toHaveBeenCalledWith(
        pullRequest,
        expect.objectContaining({
          header: expect.objectContaining({ _value: header.value }),
          issueLinks: expect.arrayContaining([
            expect.objectContaining({
              issueNumber,
              resolve: expect.objectContaining({ _value: resolve.isTrue }),
              resolveWord: expect.objectContaining({
                value: resolveWord.value,
              }),
              repository: undefined,
            }),
          ]),
        }),
      );
    });
  });

  describe('addRelatedIssueNumberToBody', () => {
    it('プルリクエストの本文にイシュー番号を追加する', async () => {
      const service = new PullRequestRecordService(mockRepository);
      const issueNumber = 1;
      const position = Position.bottom();
      const header = new Header('# Related Issue');
      const resolve = Resolve.false();
      const resolveWord = new ResolveWord();
      const repository = undefined;

      await service.addRelatedIssueNumberToBody(
        pullRequest,
        issueNumber,
        position,
        header,
        resolve,
        resolveWord,
        repository,
      );

      expect(mockRepository.update).toHaveBeenCalledWith(pullRequest);
      expect(pullRequest.body.value).toBe('body\n\n# Related Issue\n\n- #1');
    });
  });

  describe('assignIssueToPullRequestCreator', () => {
    it('アサインが有効な場合、プルリクエストの作成者をイシューにアサインする', async () => {
      const service = new PullRequestRecordService(mockRepository);
      const issueNumber = 1;
      const assign = AssignIssueToPullRequestCreator.true();
      const creator = 'username';

      await service.assignIssueToPullRequestCreator(
        pullRequest,
        issueNumber,
        assign,
        creator,
      );

      expect(mockRepository.assignIssueToUser).toHaveBeenCalledWith(
        pullRequest,
        issueNumber,
        creator,
      );
    });

    it('アサインが無効な場合、アサインを行わない', async () => {
      const service = new PullRequestRecordService(mockRepository);
      const issueNumber = 1;
      const assign = AssignIssueToPullRequestCreator.false();
      const creator = 'username';

      await service.assignIssueToPullRequestCreator(
        pullRequest,
        issueNumber,
        assign,
        creator,
      );

      expect(mockRepository.assignIssueToUser).not.toHaveBeenCalled();
    });
  });
});
