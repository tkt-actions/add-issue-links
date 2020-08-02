import { Repository } from './Repository';

describe('Repository', () => {
  describe('new', () => {
    let repository: Repository;
    beforeAll(() => {
      repository = new Repository('sample', 'name');
    });
    it('createText', () => {
      expect(repository.createText()).toBe('sample/name');
    });
  });
  describe('build', () => {
    let repository: Repository | undefined;
    beforeAll(() => {
      repository = Repository.build('sample/name');
    });
    it('createText', () => {
      expect(repository).toBeDefined();
      if (repository === undefined) return;
      expect(repository.createText()).toBe('sample/name');
    });
  });
});
