import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
    transform(timestamp: string): string {
        if (!timestamp) return '';

        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = this.addLeadingZero(date.getMinutes());
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;

        return `${formattedHours}:${minutes} ${ampm}`;
    }

    private addLeadingZero(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }
}
