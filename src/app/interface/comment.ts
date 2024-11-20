export interface CommentInterface {
commentId:number;
userId:number;
hotelId:number;
date:Date;
status:'pending'| 'approved'| 'rejected';
stars: 1|2|3|4|5;
title:string;
description:string;
}
