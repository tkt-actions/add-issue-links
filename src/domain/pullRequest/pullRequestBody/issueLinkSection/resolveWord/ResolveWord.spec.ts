import { ResolveWord } from './ResolveWord';

describe('ResolveWord', () => {
  it('initialize with no args', () => {
    expect(new ResolveWord().value).toBe('Resolve');
  });
  it('initialize with args', () => {
    expect(new ResolveWord('ResolveWord').value).toBe('ResolveWord');
  });
});
