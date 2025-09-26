import { Pipe, PipeTransform } from '@angular/core';
import { Payment } from '../interfaces/models.interface';

@Pipe({
  name: 'filterByStatus',
  standalone: true
})
export class FilterByStatusPipe implements PipeTransform {
  transform(payments: Payment[], status: string): Payment[] {
    return payments.filter(payment => payment.status === status);
  }
}