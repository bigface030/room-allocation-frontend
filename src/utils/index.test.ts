import { getDefaultRoomAllocation } from '.';
import { AllocatedRoom, Room } from './types';

describe('getDefaultRoomAllocation', () => {
  test('handle zero-guest with zero-room case', () => {
    const guests = { adult: 0, child: 0 };
    const rooms: Room[] = [];
    const expected: AllocatedRoom[] = [];
    const result = getDefaultRoomAllocation(guests, rooms);
    expect(result).toEqual(expected);
  });
  test('should not allocate any room for only one child', () => {
    const guests = { adult: 0, child: 1 };
    const rooms = [{ roomPrice: 150, adultPrice: 50, childPrice: 25, capacity: 2 }];
    const expected = [{ adult: 0, child: 0, price: 0 }];
    const result = getDefaultRoomAllocation(guests, rooms);
    expect(result).toEqual(expected);
  });
  test('should allocate at least one adult in a room with children', () => {
    const guests = { adult: 1, child: 1 };
    const rooms = [
      { roomPrice: 75, adultPrice: 50, childPrice: 25, capacity: 2 },
      { roomPrice: 0, adultPrice: 150, childPrice: 10, capacity: 2 },
    ];
    const expected = [
      { adult: 1, child: 1, price: 150 },
      { adult: 0, child: 0, price: 0 },
    ];
    const result = getDefaultRoomAllocation(guests, rooms);
    expect(result).toEqual(expected);
  });
  test('should return the allocation with the lowest total price', () => {
    const guests = { adult: 2, child: 2 };
    const rooms = [
      { roomPrice: 150, adultPrice: 60, childPrice: 30, capacity: 3 },
      { roomPrice: 100, adultPrice: 50, childPrice: 25, capacity: 4 },
    ];
    const expected = [
      { adult: 0, child: 0, price: 0 },
      { adult: 2, child: 2, price: 250 },
    ];
    const result = getDefaultRoomAllocation(guests, rooms);
    expect(result).toEqual(expected);
  });
});
