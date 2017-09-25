import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from '../../../imports/search.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'bc-recording',
    templateUrl: './recording.component.html',
    styleUrls: [ './recording.component.scss' ]
})
export class RecordingComponent {

    recording = false;
    events: Array<any> = [];

    constructor(public ref: ChangeDetectorRef) {

    }

    @HostListener('document:click', [ '$event' ])
    onClick(event: MouseEvent): void {
        if (!this.recording) {
            return;
        }
        console.log(event);
        const path = this.elementToXPath((event as any).path);
        this.events.push({
            label: `browser.click('${path}')`
        });
        this.ref.detectChanges();
    }

    elementToXPath(path: Array<EventTarget>): string {

        // algorithm magic!
        // create an very specific XPath following these rules
        const addSegment = (elem: EventTarget): string => {
            // add:
            // * element tag name,
            const tag = (elem as any).tagName;
            // * ids,
            let id: string | boolean = false;
            if (typeof (elem as any).getAttribute === 'function') {
                id = (elem as any).getAttribute('id');
            }
            // * classes with nouns (extra credit dictionary or service integration?),
            let className: string | boolean = false;
            if (typeof (elem as any).getAttribute === 'function') {
                className = ((elem as any).getAttribute('class') || '').split(/\s/)[ 0 ];
            }

            return `${tag ? tag : ''}${id
                    ? `[@id="${id}"]` : ''}${className
                    ? `[contains(@class, "${className}")]` : ''}`;

            // * indexes when all siblings are homogeneous, i.e. <li> and <tr><td>
        };
        // use a stack to start for easy debugging
        const pathStack = [];
        // as we traverse parents of evt.target DOM element
        for (const currentEl of path) {
            pathStack.unshift(addSegment(currentEl));
        }

        // flatten the XPath stack using '/'
        return pathStack.join('/');
        // minimize XPath by splitting up every combination and checking only 1 element is matched for click
        // replace match with an extra / to create // between unnecessary segments
        // prioritize by button/input, ids, classes, attributes? (extra credit), index
        // sort by smallest and return shortest path matching 1 DOM element
    }

    convertXPathToCss() {
        // if matched xpath is simple enough, convert it to CSS
    }

}
