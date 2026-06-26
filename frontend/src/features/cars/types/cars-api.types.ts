export interface CarImage {
  secure_url: string;
  public_id: string;
  _id: string;
}

export interface CarOwner {
  _id: string;
  userName: string;
  email: string;
  phone: string;
  role: string;
}

export interface RawCar {
  _id: string;
  carbrand: string;
  carname: string;
  carmodel: string;
  year: number;
  location: string;
  distance: string;
  carprice: number;
  fuel: string;
  seatCount: number;
  Body_Type: string;
  Transmission: string;
  owner: CarOwner | null;
  carimage: CarImage[];
  isavailable: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllCarsRawResponse {
  success: boolean;
  message: string;
  totalCars: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: RawCar[];
}

export interface AddCarRequest {
  carbrand: string;
  carname: string;
  carmodel: string;
  year: number;
  location: string;
  distance: string;
  carprice: number;
  fuel: string;
  seatCount: number;
  Body_Type: string;
  Transmission: string;
}

export interface UpdateCarRequest extends Partial<AddCarRequest> {}
