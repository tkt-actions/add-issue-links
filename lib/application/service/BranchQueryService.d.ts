import { Branch } from 'src/domain/Branch';
import { Context } from '@actions/github/lib/context';
export declare class BranchQueryService {
    private readonly context;
    constructor(context: Context);
    getBranch: () => Branch;
}
