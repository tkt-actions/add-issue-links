import { Position } from './Position';

describe('Position', () => {
  it('build top', () => {
    const position = Position.build('top');
    expect(position?.getIsBottom()).toBeFalsy();
    expect(position?.getIsTop()).toBeTruthy();
  });
  it('build bottom', () => {
    const position = Position.build('bottom');
    expect(position?.getIsBottom()).toBeTruthy();
    expect(position?.getIsTop()).toBeFalsy();
  });
  it('build undefined', () => {
    const position = Position.build('aaa');
    expect(position).toBeUndefined();
  });
});
