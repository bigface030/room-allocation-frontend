import { AllocatedRoom, Guest, Room } from '@/utils/types';
import CustomInputNumber from './customInputNumber';

interface RoomAllocationProps {
  guest: Guest;
  rooms: Room[];
  onChange: (result: AllocatedRoom[]) => void;
}

const RoomAllocation = () => {
  return (
    <div className="w-6/12 p-4 bg-white rounded">
      <div>
        <div className="text-2xl text-black font-bold">住客人數：7 位大人，3 位小孩 / 3 房</div>
        <div className="bg-blue-50 p-5 rounded text-gray-500 mt-4">
          尚未分配人數：4 位大人，3 位小孩
        </div>
      </div>
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="mt-4">
            {index > 0 ? <div className="h-px mt-4 bg-gray-300" /> : null}
            <div className="text-black mt-4">房間：1 人</div>
            <div className="flex justify-between mt-4">
              <div>
                <div className="text-black">大人</div>
                <div className="text-sm text-gray-400">年齡 20+</div>
              </div>
              <CustomInputNumber />
            </div>
            <div className="flex justify-between mt-4">
              <div>
                <div className="text-black">小孩</div>
              </div>
              <CustomInputNumber />
            </div>
          </div>
        ))}
    </div>
  );
};

export default RoomAllocation;
