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
    onClick(event: any): void {
        if (!this.recording) {
            return;
        }
        console.log(event);

        this.events.push({
            label: 'browser.click(\'\')\n'
        });
        this.ref.detectChanges();
    }

    elementToXPath(startEl: ElementRef) {

        // algorithm magic!
        // create an very specific XPath following these rules
        const addSegment = (elem: ElementRef): string => {
            return elem.nativeElement.tagName;
            // add:
            // * element tag name,
            // * ids,
            // * classes with nouns,
            // * indexes when all siblings are homogeneous, i.e. <li> and <tr><td>
        };
        // use a stack to start for easy debugging
        const pathStack = [];
        let currentEl = startEl;
        // as we traverse parents of evt.target DOM element
        do {
            pathStack.push(addSegment(currentEl));
            currentEl = startEl.nativeElement.parent;
        } while (currentEl);
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
