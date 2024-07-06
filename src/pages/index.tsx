import { Inter } from 'next/font/google';

import RoomAllocation from '@/components/roomAllocation';
import { AllocatedRoom } from '@/utils/types';

const inter = Inter({ subsets: ['latin'] });

// Update test case here
const guest = { adult: 4, child: 2 };
const rooms = [
  { roomPrice: 1000, adultPrice: 200, childPrice: 100, capacity: 4 },
  { roomPrice: 0, adultPrice: 500, childPrice: 500, capacity: 4 },
];

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <RoomAllocation
        guest={guest}
        rooms={rooms}
        onChange={(result: AllocatedRoom[]) => {
          console.log(result);
        }}
      />
    </main>
  );
}
