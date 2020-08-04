const LinkStyleValue = {
  Body: 'body',
  Comment: 'comment',
} as const;
type LinkStyleValue = typeof LinkStyleValue[keyof typeof LinkStyleValue];

const isLinkStyleValue = (value: string): value is LinkStyleValue =>
  typeof value === 'string' &&
  Object.values(LinkStyleValue).includes(value as LinkStyleValue);

export class LinkStyle {
  static build = (value: string): LinkStyle | undefined =>
    isLinkStyleValue(value) ? new LinkStyle(value) : undefined;

  static body = (): LinkStyle => new LinkStyle(LinkStyleValue.Body);

  static comment = (): LinkStyle => new LinkStyle(LinkStyleValue.Comment);

  constructor(private readonly value: LinkStyleValue) {}

  getIsBody = (): boolean => this.value === LinkStyleValue.Body;
  getIsComment = (): boolean => this.value === LinkStyleValue.Comment;
}
