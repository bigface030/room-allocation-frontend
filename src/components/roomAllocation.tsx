import { useCallback, useEffect, useMemo, useState } from 'react';

import CustomInputNumber from './customInputNumber';
import { AllocatedRoom, Guest, Room } from '@/utils/types';
import { calculateRoomCost, getDefaultRoomAllocation } from '@/utils';

interface RoomAllocationProps {
  guest: Guest;
  rooms: Room[];
  onChange?: (result: AllocatedRoom[]) => void;
}

const updateGuestInRoom = (val: { [key: string]: number }, index: number) => {
  return (result: AllocatedRoom, i: number) => {
    if (i === index) {
      return { ...result, ...val };
    }
    return result;
  };
};

const updatePriceBy = (rooms: Room[]) => {
  return (result: AllocatedRoom, index: number) => {
    return {
      ...result,
      price: calculateRoomCost(rooms[index], result.adult, result.child),
    };
  };
};

const RoomAllocation: React.FC<RoomAllocationProps> = ({ guest, rooms, onChange }) => {
  const defaultAllocation = useMemo(() => getDefaultRoomAllocation(guest, rooms), [guest, rooms]);
  const [currentAllocation, setCurrentAllocation] = useState(defaultAllocation);

  const handleChange = useCallback(
    (e: InputEvent) => {
      const inputElement = e.target as HTMLInputElement;

      const [index, key] = inputElement.name.split('_');
      const roomIndex = Number(index);
      const updatedGuest = { [key]: Number(inputElement.value) };

      setCurrentAllocation((prevAllocation) =>
        prevAllocation.map(updateGuestInRoom(updatedGuest, roomIndex)).map(updatePriceBy(rooms)),
      );
    },
    [setCurrentAllocation, rooms],
  );

  useEffect(() => {
    onChange?.(currentAllocation);
  }, [onChange, currentAllocation]);

  const remainAdult = guest.adult - currentAllocation.reduce((acc, val) => acc + val.adult, 0);
  const remainChild = guest.child - currentAllocation.reduce((acc, val) => acc + val.child, 0);

  const maxAdultFor = (room: AllocatedRoom) => remainAdult + room.adult;
  const maxChildFor = (room: AllocatedRoom) => (room.adult > 0 ? remainChild + room.child : 0);
  const minAdultFor = (room: AllocatedRoom) => (room.child > 0 ? 1 : 0);
  const minChildFor = (_: AllocatedRoom) => 0;

  return (
    <div className="w-6/12 p-4 bg-white rounded">
      <div>
        <div className="text-2xl text-black font-bold">{`住客人數：${guest.adult} 位大人，${guest.child} 位小孩 / ${rooms.length} 房`}</div>
        <div className="bg-blue-50 p-5 rounded text-gray-500 mt-4">
          {`尚未分配人數：${remainAdult} 位大人，${remainChild} 位小孩`}
        </div>
      </div>
      {currentAllocation.map((currentRoom, currentRoomIndex) => (
        <div key={currentRoomIndex} className="mt-4">
          {currentRoomIndex > 0 ? <div className="h-px mt-4 bg-gray-300" /> : null}
          <div className="text-black mt-4">房間：1 人</div>
          <div className="flex justify-between mt-4">
            <div>
              <div className="text-black">大人</div>
              <div className="text-sm text-gray-400">年齡 20+</div>
            </div>
            <CustomInputNumber
              name={`${currentRoomIndex}_adult`}
              value={defaultAllocation[currentRoomIndex].adult}
              max={maxAdultFor(currentRoom)}
              min={minAdultFor(currentRoom)}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between mt-4">
            <div>
              <div className="text-black">小孩</div>
            </div>
            <CustomInputNumber
              name={`${currentRoomIndex}_child`}
              value={defaultAllocation[currentRoomIndex].child}
              max={maxChildFor(currentRoom)}
              min={minChildFor(currentRoom)}
              onChange={handleChange}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomAllocation;
