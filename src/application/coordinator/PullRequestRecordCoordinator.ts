import { PullRequestRecordService } from '../service/PullRequestRecordService';
import { PullRequestQueryService } from '../service/PullRequestQueryService';
import { Context } from '@actions/github/lib/context';
import { PullRequest } from './../../domain/pullRequest/PullRequest';
import { Resolve } from './../../domain/resolve/Resolve';
import { Repository } from './../../domain/repository/Repository';
import { LinkStyle } from './../../domain/linkStyle/LinkStyle';
import { Position } from 'src/domain/position/Position';
import { ResolveWord } from 'src/domain/pullRequest/pullRequestBody/issueLinkSection/resolveWord/ResolveWord';
import { info } from '@actions/core';

export class PullRequestRecordCoordinator {
  constructor(
    private readonly recordService: PullRequestRecordService,
    private readonly queryService: PullRequestQueryService,
  ) {}

  // TODO: coordinator と service の切り分け、usecase 層を置くべきなのか、要検討
  addIssueLink = async (
    context: Context,
    issueNumber: number,
    position: Position,
    resolve: Resolve,
    resolveWord: ResolveWord,
    repository: Repository | undefined,
    linkStyle: LinkStyle,
  ): Promise<void> => {
    const pullRequest = await this.queryService.findOne(context);
    info(`resolveWord.value: ${resolveWord.value}`);
    await this.addIssueLinkByPullRequest(
      pullRequest,
      issueNumber,
      position,
      resolve,
      resolveWord,
      repository,
      linkStyle,
    );
  };

  addIssueLinkByPullRequest = async (
    pullRequest: PullRequest,
    issueNumber: number,
    position: Position,
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
        resolve,
        resolveWord,
        repository,
      );
    if (linkStyle.getIsComment())
      await this.recordService.addRelatedIssueNumberAsComment(
        pullRequest,
        issueNumber,
        resolve,
        resolveWord,
        repository,
      );
  };
}
