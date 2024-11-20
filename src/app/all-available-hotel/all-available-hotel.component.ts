import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ToomanCurrencyPipe } from '../pipe/tooman-currency.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImageSliderComponent } from '../image-slider/image-slider.component';

import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { combineLatest, Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { HotelProduct } from '../interface/hotel-product';
import { HotelService } from './hotel.service';
import { CommentInterface } from '../interface/comment';
import { CommentService } from '../services/comment.service';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LoadingSignalService } from '../services/UI/loading-signal.service';
import { LoadingCardComponent } from '../dialog/loading-card/loading-card.component';


@Component({
  selector: 'app-all-available-hotel',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSortModule,
    MatInputModule,
    MatOptionModule,
    FlexLayoutModule,
    MatIconModule,
    ToomanCurrencyPipe,
    ImageSliderComponent,
    MatPaginator,
    LoadingCardComponent

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
  templateUrl: './all-available-hotel.component.html',
  styleUrl: './all-available-hotel.component.css'
})
export class AllAvailableHotelComponent {
  products: HotelProduct[] = []
  filteredProducts: HotelProduct[] = []
  sortOrder: string = ""
private hotelService = inject(HotelService)
allComments: CommentInterface[]= [];

pageSize: number = 10; 
pageIndex: number = 0;
paginatedProducts: any[] = [];


loadingSignalService= inject(LoadingSignalService)
isLoading$: Observable<boolean>;



  constructor(
    private http: HttpClient, 
    private router: Router,
    private commentService:CommentService) {
      this.isLoading$ = this.loadingSignalService.loading$;
     }



  ngOnInit(): void {
   
    combineLatest([
      this.hotelService.fetchDataFromApi(),
      this.commentService.getComments()
    ]).subscribe(
      ([products, comments]) => {
        this.products = products;
        this.allComments = comments;

        this.populateCommentsForProducts();
        console.log(this.allComments)
console.log(this.filteredProducts)
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
    this.paginateProducts();


  }




  applyFilter(event: Event): void {
    let searchTerm = (event.target as HTMLInputElement).value;
    searchTerm = searchTerm.toLowerCase();

    this.filteredProducts = this.products.filter(
      product => product.name.toLowerCase().includes(searchTerm)
    )

    this.sortProducts(this.sortOrder)
  }

  sortProducts(sortValue: string){
    this.sortOrder = sortValue;

    if(this.sortOrder === "priceLowHigh"){
      this.filteredProducts.sort((a,b) => a.price - b.price)
    } else if(this.sortOrder === "priceHighLow"){
      this.filteredProducts.sort((a,b) => b.price - a.price)
    }
  }
  viewDetails(productId: number) {
    this.router.navigate(['/selected', productId]); 
  }

  getAverageStars(comments: CommentInterface[]): number {
    if (!comments || comments.length === 0) {
      return 0;
    }

    const totalStars = comments.reduce((sum, comment) => sum + comment.stars, 0);
    return totalStars / comments.length;
  }
  populateCommentsForProducts(): void {
    console.log('Products:', this.products);
    console.log('Comments:', this.allComments);
  
    if (this.products.length > 0 && this.allComments.length > 0) {
      console.log('Both products and comments arrays are populated.');
  
      this.filteredProducts = this.products.map(product => {
        const productComments = this.allComments.filter(comment => comment.hotelId === product.id);
        
        console.log(`Product ID: ${product.id}`);
        console.log(`Filtered Comments for Product ${product.id}:`, productComments);
  
        return {
          ...product,
          comments: productComments,
        };
      });
  
      console.log('Filtered Products with Comments:', this.filteredProducts);
    } else {
      console.log('No products or comments found, using the original products list.');
      this.filteredProducts = this.products;
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.paginateProducts();
  }

  paginateProducts() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }
}  
