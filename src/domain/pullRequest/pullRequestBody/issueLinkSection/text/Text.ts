export const TextMapping = {
  lineBreak: '\n',
  blank: '',
  whitespace: ' ',
  resolve: 'Resolve',
  listPrefix: '- ' /* ここで whitespace を呼べないものか */,
} as const;
export type TextMapping = typeof TextMapping[keyof typeof TextMapping];
