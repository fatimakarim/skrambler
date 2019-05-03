import { Pipe, PipeTransform } from '@angular/core';
import { SkramblerUtils } from '../skramblerUtils';

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform
{
    transform(mainArr: any[], searchText: string, property: string): any
    {
        return SkramblerUtils.filterArrayByString(mainArr, searchText);
    }
}
