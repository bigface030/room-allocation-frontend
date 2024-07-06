import { AllocatedRoom, Room } from './types';

export const calculateRoomCost = (room: Room, adults: number, children: number) => {
  if (adults === 0 && children === 0) return 0;
  return room.roomPrice + adults * room.adultPrice + children * room.childPrice;
};

export const updateGuestInRoom = (val: { [key: string]: number }, index: number) => {
  return (result: AllocatedRoom, i: number) => {
    if (i === index) {
      return { ...result, ...val };
    }
    return result;
  };
};

export const updatePriceBy = (rooms: Room[]) => {
  return (result: AllocatedRoom, index: number) => {
    return {
      ...result,
      price: calculateRoomCost(rooms[index], result.adult, result.child),
    };
  };
};

export const inputEventFor = (input: HTMLInputElement): InputEvent => {
  const inputEvent = new InputEvent('input');
  input.dispatchEvent(inputEvent);
  return inputEvent;
};

export const blurEventFor = (input: HTMLInputElement): FocusEvent => {
  const blurEvent = new FocusEvent('blur');
  input.dispatchEvent(blurEvent);
  return blurEvent;
};
