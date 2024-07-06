import { calculateRoomCost } from '.';
import { Guest, Room, AllocatedRoom } from './types';

const getDefaultRoomAllocation = (guest: Guest, rooms: Room[]): AllocatedRoom[] => {
  const { adult: adultCount, child: childCount } = guest;

  const dp = Array.from({ length: rooms.length + 1 }, () =>
    Array.from({ length: adultCount + 1 }, () => Array(childCount + 1).fill(Infinity)),
  );

  const path = Array.from({ length: rooms.length + 1 }, () =>
    Array.from({ length: adultCount + 1 }, () => Array(childCount + 1).fill(null)),
  );

  dp[0][0][0] = 0;

  for (let i = 1; i <= rooms.length; i++) {
    const room = rooms[i - 1];
    for (let j = 0; j <= adultCount; j++) {
      for (let k = 0; k <= childCount; k++) {
        dp[i][j][k] = dp[i - 1][j][k];
        for (let a = 0; a <= room.capacity; a++) {
          for (let c = 0; c <= room.capacity - a; c++) {
            if (a === 0 && c > 0) continue;
            if (j >= a && k >= c) {
              const cost = calculateRoomCost(room, a, c);
              if (dp[i][j][k] > dp[i - 1][j - a][k - c] + cost) {
                dp[i][j][k] = dp[i - 1][j - a][k - c] + cost;
                path[i][j][k] = { adults: a, children: c, prevAdults: j - a, prevChildren: k - c };
              }
            }
          }
        }
      }
    }
  }

  let allocation = [];
  let currentAdults = adultCount;
  let currentChildren = childCount;

  for (let i = rooms.length; i > 0; i--) {
    const room = rooms[i - 1];
    if (path[i][currentAdults][currentChildren]) {
      const { adults, children, prevAdults, prevChildren } =
        path[i][currentAdults][currentChildren];
      allocation.push({
        adult: adults,
        child: children,
        price: calculateRoomCost(room, adults, children),
      });
      currentAdults = prevAdults;
      currentChildren = prevChildren;
    } else {
      allocation.push({ adult: 0, child: 0, price: 0 });
    }
  }

  return allocation.reverse();
};

export default getDefaultRoomAllocation;
