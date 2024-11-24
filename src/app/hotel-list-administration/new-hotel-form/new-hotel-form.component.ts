import { Component, inject, OnInit } from '@angular/core';
import { FormControl, 
  FormGroup,
 Validators,
ReactiveFormsModule ,
AbstractControl,
FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../all-available-hotel/hotel.service';
import { HotelProduct } from '../../interface/hotel-product';
import { map } from 'rxjs';
import {MatCheckboxModule} from '@angular/material/checkbox';
@Component({
  selector: 'app-new-hotel-form',
  standalone: true,
  imports: [
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './new-hotel-form.component.html',
  styleUrl: './new-hotel-form.component.css'
})
export class NewHotelFormComponent implements OnInit{
  newHotel!: FormGroup;
hotelService = inject(HotelService)



  constructor(
    private fb:FormBuilder,
    private route: ActivatedRoute,
    private router:Router
  ){}

ngOnInit(): void {
  this.newHotel = this.fb.group({
    name:['' ,Validators.required],
    price: [0,[Validators.required,Validators.min(0)]],
    image_url:['',Validators.required],
    description:['',Validators.required],
    isPickable:[true],
  })
}
generateRandomId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

onSubmit() {
  if(this.newHotel.valid){
    const updatedHotel:HotelProduct = {
      ...this.newHotel.value,
      image_url: this.newHotel.value.image_url
      .split(',').map((url:string) => {
        url.trim()
      })
    };
    this.hotelService.createHotel( updatedHotel).subscribe({
      next: () => {
        console.log('hotel succesfully updated')
  this.router.navigate(['/hotellist']);

      },
      error: (err) => {
        console.log('error updating:', err)
      }
    })
  }
}
}
