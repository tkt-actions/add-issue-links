import { Branch } from './../../domain/Branch';
import { Context } from '@actions/github/lib/context';

export class BranchQueryService {
  constructor(private readonly context: Context) {}
  getBranch = (): Branch => {
    const branchName = this.context.payload.pull_request?.head.ref;
    return new Branch(branchName);
  };
}
