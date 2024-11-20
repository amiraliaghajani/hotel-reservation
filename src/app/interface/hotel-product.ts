import { CommentInterface } from "./comment";

export interface HotelProduct {

        id: number 
        name: string 
        price: number
        image_url: string[];
        description:string
        isPickable:boolean
        comments?: CommentInterface[];   
        // dont delete comment its for allHotel component
}
