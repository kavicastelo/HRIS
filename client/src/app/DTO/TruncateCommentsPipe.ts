import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncateComments'
})
export class TruncateCommentsPipe implements PipeTransform {
    transform(comments: any[], maxLength: number): any[] {
        if (!comments || !Array.isArray(comments)) {
            return [];
        }
        return comments.slice(0, maxLength);
    }
}
