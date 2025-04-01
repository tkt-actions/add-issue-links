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
import { AssignIssueToPullRequestCreator } from '../../domain/assign/AssignIssueToPullRequestCreator';
import * as core from '@actions/core';

describe('PullRequestRecordService', () => {
  const mockRepository: PullRequestRepository = {
    update: jest.fn(),
    get: jest.fn(),
    createComment: jest.fn(),
    assignIssueToUser: jest.fn(),
    createPlainTextComment: jest.fn(),
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
      expect(mockRepository.createPlainTextComment).not.toHaveBeenCalled();
    });

    it('アサイン中にエラーが発生した場合、警告ログと警告コメントを出力し、エラーをスローしない', async () => {
      const service = new PullRequestRecordService(mockRepository);
      const issueNumber = 999;
      const assign = AssignIssueToPullRequestCreator.true();
      const creator = 'test-user';
      const assignError = new Error('Issue not found');

      (mockRepository.assignIssueToUser as jest.Mock).mockRejectedValueOnce(
        assignError,
      );

      const warningSpy = jest.spyOn(core, 'warning');
      const errorSpy = jest.spyOn(core, 'error');

      await expect(
        service.assignIssueToPullRequestCreator(
          pullRequest,
          issueNumber,
          assign,
          creator,
        ),
      ).resolves.not.toThrow();

      expect(mockRepository.assignIssueToUser).toHaveBeenCalledWith(
        pullRequest,
        issueNumber,
        creator,
      );
      expect(warningSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Failed to assign issue #${issueNumber} to ${creator}. Error: ${assignError.message}`,
        ),
      );
      expect(mockRepository.createPlainTextComment).toHaveBeenCalledWith(
        pullRequest,
        expect.stringContaining(`⚠ Warning: Issue #${issueNumber} not found`),
      );
      expect(errorSpy).not.toHaveBeenCalled();

      warningSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('アサイン中およびコメント投稿中にエラーが発生した場合、警告とエラーログを出力し、エラーをスローしない', async () => {
      const service = new PullRequestRecordService(mockRepository);
      const issueNumber = 999;
      const assign = AssignIssueToPullRequestCreator.true();
      const creator = 'test-user';
      const assignError = new Error('Issue not found');
      const commentError = new Error('Failed to post comment');

      (mockRepository.assignIssueToUser as jest.Mock).mockRejectedValueOnce(
        assignError,
      );
      (
        mockRepository.createPlainTextComment as jest.Mock
      ).mockRejectedValueOnce(commentError);

      const warningSpy = jest.spyOn(core, 'warning');
      const errorSpy = jest.spyOn(core, 'error');

      await expect(
        service.assignIssueToPullRequestCreator(
          pullRequest,
          issueNumber,
          assign,
          creator,
        ),
      ).resolves.not.toThrow();

      expect(mockRepository.assignIssueToUser).toHaveBeenCalledWith(
        pullRequest,
        issueNumber,
        creator,
      );
      expect(warningSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Failed to assign issue #${issueNumber} to ${creator}. Error: ${assignError.message}`,
        ),
      );
      expect(mockRepository.createPlainTextComment).toHaveBeenCalledWith(
        pullRequest,
        expect.stringContaining(`⚠ Warning: Issue #${issueNumber} not found`),
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Failed to post warning comment to PR #${pullRequest.number}. Error: ${commentError.message}`,
        ),
      );

      warningSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });
});
