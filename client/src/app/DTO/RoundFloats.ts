import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundFloats'
})
export class RoundFloats implements PipeTransform {
  transform(value: number): string {
    if (!value) return '';

    const parsedValue = Math.round(Math.abs(value) * 100) / 100;

    return `${parsedValue}`;
  }
}
