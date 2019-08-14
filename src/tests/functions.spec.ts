import { MediatorData, prepareMediatorData } from '../public-api';

describe('prepareMediatorData', () => {
  it('should paginate', () => {
    const mediatorData: MediatorData<string> = {
      data: ['A', 'B', 'C', 'D', 'E', 'F'],
      total: 6
    };
    const actual = prepareMediatorData(mediatorData.data, undefined, undefined, 1, 2);
    const expected: MediatorData<string> = {
      data: ['C', 'D'],
      total: 6
    };
    expect(actual).toEqual(expected);
  });

  it('should sort', () => {
    const mediatorData: MediatorData<{ id: number }> = {
      data: new Array(3).fill(0).map((_, i) => ({ id: i })),
      total: 3
    };
    const actual = prepareMediatorData(mediatorData.data, 'id', 'desc', undefined, undefined);
    const expected: MediatorData<{ id: number }> = {
      data: new Array(3)
        .fill(0)
        .map((_, i) => ({ id: i }))
        .reverse(),
      total: 3
    };
    expect(actual).toEqual(expected);
  });

  it('should leave unchanged if all undefined', () => {
    const mediatorData: MediatorData<string> = {
      data: ['A', 'B', 'C', 'D', 'E', 'F'],
      total: 6
    };
    const actual = prepareMediatorData(mediatorData.data);
    const expected: MediatorData<string> = {
      data: ['A', 'B', 'C', 'D', 'E', 'F'],
      total: 6
    };
    expect(actual).toEqual(expected);
  });
});
