// capitalize.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalize', pure: true, standalone: true})
export class CapitalizePipe implements PipeTransform {
  transform(value?: string | null): string {
    if (!value) return 'UNKNOWN';
    const s = value.toString().trim();
    if (!s) return 'UNKNOWN';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }
}