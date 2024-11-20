import { UserType } from "./user-type";

export interface Reservation {
    user: UserType | null;
    dateRange: (Date | null)[];
    familyMembers: { firstName: string; lastName: string }[];
    hotelId:number| null;
reservationId:number;
    status:'pending'| 'apporoved'| 'rejected';
    
}
