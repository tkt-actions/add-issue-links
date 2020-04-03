import {BaseError} from './BaseError'

export class BranchIssueNumNotFound extends BaseError {
  constructor(e?: string) {
    super(e)
  }
}
