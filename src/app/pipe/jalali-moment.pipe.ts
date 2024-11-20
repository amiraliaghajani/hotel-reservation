import { Pipe, PipeTransform } from '@angular/core';
import moment from 'jalali-moment';
@Pipe({
  name: 'jalali',
  standalone: true
})
export class JalaliMomentPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let MomentDate = moment(value, 'YYYY/MM/DD');
    return MomentDate.locale('fa').format('YYYY/M/D');
  }

}
