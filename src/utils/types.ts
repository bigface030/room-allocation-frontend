export type Guest = {
  adult: number;
  child: number;
};

export type Room = {
  roomPrice: number;
  adultPrice: number;
  childPrice: number;
  capacity: number;
};

export type AllocatedRoom = {
  adult: number;
  child: number;
  price: number;
};
