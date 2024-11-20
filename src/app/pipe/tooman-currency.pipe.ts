import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toomanCurrency',
  standalone: true
})
export class ToomanCurrencyPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null) return '';

    const formattedValue = value.toLocaleString('fa-IR');
    
    return `${formattedValue} تومان`;
  }

}
