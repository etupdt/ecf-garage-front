import { Pipe, PipeTransform } from '@angular/core';
import { Filter } from 'src/app/interface/filter.interface';
import { Car } from 'src/app/models/car.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(cars: Car[], ...args: unknown[]): Car[] {

    const filters = args[0] as Filter[]

    return cars.filter((car: Car) => {

      let returnValue = true

      filters.forEach(filter => {

        switch (filter.name) {

          case 'Prix' : {
            if (car.price < filter.startValue || car.price > filter.endValue)
              returnValue = false
            break
          }

          case 'Kilométrage' : {
            if (car.kilometer < filter.startValue || car.kilometer > filter.endValue)
              returnValue = false
            break
          }

          case 'Année' : {
            if (car.year < filter.startValue || car.year > filter.endValue)
              returnValue = false
            break
          }

        }

      })

      return returnValue

    });

  }

}
