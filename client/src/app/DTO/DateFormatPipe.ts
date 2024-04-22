import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
    transform(date: string): string {
        if (!date) return '';

        const parsedDate = new Date(date);
        const year = parsedDate.getFullYear();
        const month = this.addLeadingZero(parsedDate.getMonth() + 1);
        const day = this.addLeadingZero(parsedDate.getDate());

        return `${year}-${month}-${day}`;
    }

    private addLeadingZero(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }
}
