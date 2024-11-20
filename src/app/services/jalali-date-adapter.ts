import { Inject, Injectable, Optional } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'jalali-moment';

@Injectable()
export class JalaliDateAdapter extends DateAdapter<moment.Moment> {

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) private matDateLocale: string) {
    super();
    this.setLocale(matDateLocale || 'fa'); // Set the default locale to Persian (fa)
  }

  override getYear(date: moment.Moment): number {
    return date.jYear();
  }

  override getMonth(date: moment.Moment): number {
    return date.jMonth();
  }

  override getDate(date: moment.Moment): number {
    return date.jDate();
  }

  override getDayOfWeek(date: moment.Moment): number {
    return date.day();
  }

  override getMonthNames(): string[] {
    return moment.localeData('fa').jMonths();
  }

  override getDateNames(): string[] {
    const dates = Array(31);
    return dates.fill(0).map((_, i) => String(i + 1));
  }

  override getDayOfWeekNames(): string[] {
    return moment.localeData('fa').weekdays();
  }

  override getYearName(date: moment.Moment): string {
    return String(date.jYear());
  }

  override getFirstDayOfWeek(): number {
    return moment.localeData('fa').firstDayOfWeek();
  }

  override getNumDaysInMonth(date: moment.Moment): number {
    return date.daysInMonth();
  }

  override clone(date: moment.Moment): moment.Moment {
    return date.clone();
  }

  override createDate(year: number, month: number, date: number): moment.Moment {
    // Moment month is zero-indexed, but Jalali is not. Adjust accordingly.
    return moment(`${year}-${month + 1}-${date}`, 'jYYYY-jM-jD').locale('fa').startOf('day');
  }

  override today(): moment.Moment {
    return moment().locale('fa');
  }

  override parse(value: any, parseFormat: any): moment.Moment | null {
    if (value && typeof value === 'string') {
      return moment(value, parseFormat, 'fa').locale('fa');
    }
    return value ? moment(value).locale('fa') : null;
  }

  override format(date: moment.Moment, displayFormat: string): string {
    return date.locale('fa').format(displayFormat);
  }

  override addCalendarDays(date: moment.Moment, days: number): moment.Moment {
    return date.clone().add(days, 'days');
  }

  override addCalendarMonths(date: moment.Moment, months: number): moment.Moment {
    return date.clone().add(months, 'jMonth');
  }
  
  

  override addCalendarYears(date: moment.Moment, years: number): moment.Moment {
    return date.clone().add(years, 'jYear');
  }

  override toIso8601(date: moment.Moment): string {
    return date.toISOString();
  }

  fromIso8601(isoString: string): moment.Moment | null {
    return moment(isoString).locale('fa');
  }
  

  override isDateInstance(obj: any): boolean {
    return moment.isMoment(obj);
  }

  override isValid(date: moment.Moment): boolean {
    return date.isValid();
  }

  override invalid(): moment.Moment {
    return moment.invalid();
  }

}
