export class Repository {
  static build = (str: string) => {
    const match = Repository.matchFields(str);
    if (!match) return undefined;
    const fields = Repository.extractFields(match);
    if (!fields) return undefined;
    return new Repository(fields?.username, fields?.repositoryName);
  };
  constructor(private username: string, private repositoryName: string) {}

  get owner(): string {
    return this.username;
  }

  get repo(): string {
    return this.repositoryName;
  }

  createText = () => this.username + '/' + this.repositoryName;

  private static readonly fieldsRegex = /^(.+)\/(.+)$/;
  private static matchFields = (str: string) =>
    str.match(Repository.fieldsRegex);
  private static extractFields = (
    match: RegExpMatchArray,
  ): {
    username: string;
    repositoryName: string;
  } | null => {
    const username = match[1];
    const repositoryName = match[2];
    if (!username || !repositoryName) return null;
    return {
      username,
      repositoryName,
    };
  };
}
