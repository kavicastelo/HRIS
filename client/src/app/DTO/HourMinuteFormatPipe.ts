import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'hourMinuteFormat'
})
export class HourMinuteFormatPipe implements PipeTransform {

    transform(hours: number): string {
        const hrs = Math.floor(hours);
        const mins = Math.round((hours - hrs) * 60);
        return `${hrs}hrs ${mins}mins`;
    }
}
