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
  selector: 'app-edit-form-hotel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  templateUrl: './edit-form-hotel.component.html',
  styleUrl: './edit-form-hotel.component.css'
})
export class EditFormHotelComponent implements OnInit{
  hotelForm!: FormGroup;
  hotelId!: number;
product:HotelProduct[]=[]
hotelService = inject(HotelService)
constructor(
  private fb:FormBuilder,
  private route: ActivatedRoute,
  private router:Router
){}

ngOnInit(): void {
  this.route.params.subscribe((params) => {
    this.hotelId = +params['id'];
    this.loadHotelData(this.hotelId);
    
  });
  this.hotelForm = this.fb.group({
    name:['' ,Validators.required],
    price: [0,[Validators.required,Validators.min(0)]],
    image_url:['',Validators.required],
    description:['',Validators.required],
    isPickable:[true],
  })
  
}

loadHotelData(id: number): void {
  this.hotelService.fetchDataFromApi().pipe(
    map((data: HotelProduct[]) => {
      return data.find((product) => product.id === id);
    })
  ).subscribe({
    next: (hotel: HotelProduct | undefined) => {
      if (hotel) {
        this.hotelForm.patchValue({
          name: hotel.name,
          price: hotel.price,
          image_url: hotel.image_url.join(', '),  
          description: hotel.description,
          isPickable: hotel.isPickable
        });
      } else {
        console.log('Hotel not found!');
      }
    },
    error: (err) => {
      console.log('Error loading Hotel Data', err);
    }
  });
}

onSubmit(){
  if(this.hotelForm.valid){
    const updatedHotel:HotelProduct = {
      ...this.hotelForm.value,
      image_url: this.hotelForm.value.image_url
      .split(',').map((url:string) => {
        url.trim()
      })
    };
    this.hotelService.updateHotel(this.hotelId, updatedHotel).subscribe({
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
