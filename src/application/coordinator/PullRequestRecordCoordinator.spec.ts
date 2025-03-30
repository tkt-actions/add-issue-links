import { PullRequestRecordCoordinator } from './PullRequestRecordCoordinator';
import { PullRequestRecordService } from '../service/PullRequestRecordService';
import { PullRequestQueryService } from '../service/PullRequestQueryService';
import { Context } from '@actions/github/lib/context';
import { PullRequest } from '../../domain/pullRequest/PullRequest';
import { PullRequestBody } from '../../domain/pullRequest/pullRequestBody/PullRequestBody';
import { IssueLinkSection } from '../../domain/pullRequest/pullRequestBody/issueLinkSection/IssueLinkSection';
import { Header } from '../../domain/pullRequest/pullRequestBody/issueLinkSection/header/Header';
import { IssueLink } from '../../domain/pullRequest/pullRequestBody/issueLinkSection/issueLink/IssueLinkText';
import { Resolve } from '../../domain/resolve/Resolve';
import { ResolveWord } from '../../domain/pullRequest/pullRequestBody/issueLinkSection/resolveWord/ResolveWord';
import { Position } from '../../domain/position/Position';
import { Repository } from '../../domain/repository/Repository';
import { LinkStyle } from '../../domain/linkStyle/LinkStyle';
import { AssignIssueToPullRequestCreator } from '../../domain/assign/AssignIssueToPullRequestCreator';
import { PullRequestRepository } from '../repository/PullRequestRepository';

describe('PullRequestRecordCoordinator', () => {
  const mockRepository: PullRequestRepository = {
    update: jest.fn(),
    get: jest.fn(),
    createComment: jest.fn(),
    assignIssueToUser: jest.fn(),
  };

  const mockRecordService = new PullRequestRecordService(mockRepository);
  jest.spyOn(mockRecordService, 'addRelatedIssueNumberAsComment');
  jest.spyOn(mockRecordService, 'addRelatedIssueNumberToBody');
  jest.spyOn(mockRecordService, 'assignIssueToPullRequestCreator');

  const mockQueryService = new PullRequestQueryService(mockRepository);
  jest.spyOn(mockQueryService, 'findOne');

  const pullRequest = new PullRequest(
    'title',
    new PullRequestBody('body'),
    1,
    'owner',
    'repo',
  );

  const context = {
    repo: {
      owner: 'owner',
      repo: 'repo',
    },
    issue: {
      number: 1,
    },
  } as Context;

  beforeEach(() => {
    jest.clearAllMocks();
    (mockQueryService.findOne as jest.Mock).mockResolvedValue(pullRequest);
  });

  describe('addIssueLink', () => {
    it('プルリクエストにイシューリンクを追加する', async () => {
      const coordinator = new PullRequestRecordCoordinator(
        mockRecordService,
        mockQueryService,
      );
      const issueNumber = 1;
      const position = Position.bottom();
      const header = new Header('# Related Issue');
      const resolve = Resolve.false();
      const resolveWord = new ResolveWord();
      const repository = undefined;
      const linkStyle = LinkStyle.body();

      await coordinator.addIssueLink(
        context,
        issueNumber,
        position,
        header,
        resolve,
        resolveWord,
        repository,
        linkStyle,
      );

      expect(mockQueryService.findOne).toHaveBeenCalledWith(context);
      expect(
        mockRecordService.addRelatedIssueNumberToBody,
      ).toHaveBeenCalledWith(
        pullRequest,
        issueNumber,
        position,
        header,
        resolve,
        resolveWord,
        repository,
      );
    });
  });

  describe('assignIssueToPullRequestCreator', () => {
    it('プルリクエストの作成者をイシューにアサインする', async () => {
      const coordinator = new PullRequestRecordCoordinator(
        mockRecordService,
        mockQueryService,
      );
      const issueNumber = 1;
      const assign = AssignIssueToPullRequestCreator.true();

      await coordinator.assignIssueToPullRequestCreator(
        context,
        issueNumber,
        assign,
      );

      expect(mockQueryService.findOne).toHaveBeenCalledWith(context);
      expect(
        mockRecordService.assignIssueToPullRequestCreator,
      ).toHaveBeenCalledWith(pullRequest, issueNumber, assign, 'owner');
    });
  });
});
