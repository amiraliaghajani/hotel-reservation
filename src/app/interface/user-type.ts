export interface UserType {
    id: number;
    persianFirstName:string;
    persianLastName:string;
    englishFirstName:string;
    englishLastName:string;
    emailAddress:string;
    password:string;
    phoneNumber:string;
    internalPhoneNumber:number;
    grade:string;
    unit:string;
    accessType: "user"| "admin"| "superAdmin";
    imageUrl: string;
}
