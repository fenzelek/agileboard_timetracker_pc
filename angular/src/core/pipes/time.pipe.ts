import { Pipe, PipeTransform } from '@angular/core';
import { parseTime } from '../timeStore/helpers';
import { Time } from '../timeStore/model';


@Pipe({
  name: 'time',
  pure: false,
})
export class TimePipe implements PipeTransform {

  /**
   * @param time Time in seconds or Time instance
   */
  transform(time: Time | number, format?: 'h:mm' | 'h:mm:ss' | 'hm'): string {
    if (typeof time === 'number')
      time = parseTime(time);

    return parseTimeToDisplay(time, format);
  }

}


export function parseTimeToDisplay(time: Time, format: 'h:mm' | 'h:mm:ss' | 'hm') {
  if (!time) return '';

  if (format === 'hm')
    return `${time.hours}h ${time.minutes}m`;


  let result = '';

  // hours
  result += `${time.hours}:`;

  // minutes
  if (time.minutes < 10)
    result += '0';

  result += `${time.minutes}`;

  // seconds
  if (format === 'h:mm:ss') {
    result += ':';

    if (time.seconds < 10)
      result += '0';
  
    result += time.seconds;
  }

  return result;
}
