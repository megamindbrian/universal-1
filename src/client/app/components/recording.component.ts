import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import * as Prism from 'prismjs';

@Component({
    selector: 'bc-recording',
    templateUrl: './recording.component.html',
    styleUrls: [
        './result.component.scss',
        './recording.component.scss'
    ]
})
export class RecordingComponent {
    eventOutput: string;

    recording = false;
    events: Array<any> = [
        `
    this.waitForVisible('bc-funnel-billing');
    library.setCardholderName(browser, 'Selenium Test');
    library.setCardNumber(browser, '4111111111111111');
    this.keys('Tab');
    this.keys('Enter');
    this.waitForVisible('[id="md-option-0"]');
    this.click('[id="md-option-0"]');
    library.setCVV(browser, '5454');
    this.keys('Tab');
    this.keys('Enter');
    this.waitForVisible('[id="md-option-6"]');
    this.click('[id="md-option-6"]');
    this.keys('Tab');
    this.keys('Enter');
    this.waitForVisible('[id="md-option-20"]');
    this.click('[id="md-option-20"]');
    library.setAddress(browser, '12345');
    this.keys('Tab');
    this.keys('Enter');
    this.waitForVisible('[id="md-option-46"]');
    this.click('[id="md-option-277"]');
    library.setState(browser, 'Arizona');
    library.setCity(browser, 'Scottsdale');
    library.setZipCode(browser, '85258');
    `.split('\n').map(s => ({
            label: s.trim()
        }))
    ];

    static getArrayXPath(selector: string, ctx?: Node): Array<Node> {
        if (typeof ctx === 'undefined') {
            ctx = document;
        }
        const iterator = document.evaluate(
                selector,
                ctx, void 0,
                XPathResult.ORDERED_NODE_ITERATOR_TYPE, void 0);
        const co: Array<Node> = [];
        let m = iterator.iterateNext();
        while (m) {
            co.push(m);
            m = iterator.iterateNext();
        }

        return co;
    }

    static convertXPathToCss(path: string): string {
        // if matched xpath is simple enough, convert it to CSS
        // DIV[contains(@class, "product-tile")]/parent::*/DIV[2]//MD-CARD[contains(@class, "mat-card")]/parent::*/MD-CARD[1]
        return path
                .replace(/\/([a-z-]+)\[@id="(.*?)"]/ig, '/$1#$2')
                .replace(/\/([^\/]+)\[contains\(@class, "(.*?)"\)]/ig, '/$1.$2')
                .replace(/\/parent::[a-z-]+\/[a-z-]+\[([0-9]+)]/ig, ':nth-child($1)')
                .replace(/^\/\//ig, '')
                .replace(/\/\//ig, ' ')
                .replace(/\//ig, ' > ');
    }

    constructor(public ref: ChangeDetectorRef) {
        this.eventOutput = this.highlight(this.events.map(e => e.label).join(''));

        // TODO: create little indicators on the page using element to XPath with
        //  all visible children showing their ids in the upper right-hand corner with pointer-events: none;
        //  extra credit, make them twinkle slightly
    }

    @HostListener('document:click', [ '$event' ])
    onClick(event: MouseEvent): void {
        if (!this.recording) {
            return;
        }
        console.log(event);
        // Event.target, event.target.childNodes, event.target.classList, event.srcElement, event.toElement
        if (event.type === 'click') {
            const path = this.elementToXPath((event as any).path);
            if (typeof path === 'undefined') {
                return;
            }
            this.events.push({
                label: `browser.click('${RecordingComponent.convertXPathToCss(path)}');\n`
            });
        }

        this.eventOutput = this.highlight(this.events.map(e => e.label).join(''));
        this.ref.detectChanges();
    }

    highlight(code: string): string {
        if (typeof code === 'undefined' || code === null) {
            return '';
        }

        return Prism.highlight(code, Prism.languages.javascript);
    }

    elementToXPath(path: Array<EventTarget>): string {

        // algorithm magic!
        // create an very specific XPath following these rules
        const addSegment = (elem: Node): string => {
            if (typeof elem === 'undefined' || elem === null) {
                return '/';
            }
            // add:
            // * element tag name,
            const tag = elem.nodeName;
            // * ids,
            let id: string | boolean = false;
            if (typeof (elem as any).getAttribute === 'function') {
                id = (elem as any).getAttribute('id');
            }
            // * classes with nouns (extra credit dictionary or service integration?),
            let className: string | boolean = false;
            if (typeof (elem as any).classList !== 'undefined') {
                className = (elem as any).classList[ 0 ];
            }
            // * indexes when all siblings are homogeneous, i.e. <li> and <tr><td>
            let countTypes = 0;
            if (typeof elem.parentElement !== 'undefined' && elem.parentElement !== null) {
                for (let e = 0; e < elem.parentElement.children.length; e++) {
                    const el = elem.parentElement.children[ e ];
                    if (el.nodeName === elem.nodeName) {
                        countTypes += 1;
                    }
                    if (el === elem) {
                        break;
                    }
                }
            }

            return `${tag
                    ? tag : ''}${id
                    ? `[@id="${id}"]` : ''}${className
                    ? `[contains(@class, "${className}")]` : ''}${countTypes > 0
                    ? `/parent::${elem.parentElement.nodeName}/${tag}[${countTypes}]` : ''}`;
        };
        // use a stack to start for easy debugging
        const pathStack = [];
        // as we traverse parents of evt.target DOM element
        for (const currentEl of path) {
            pathStack.unshift(addSegment(currentEl as Node));
            if ((currentEl as Node).nodeName === 'BODY') {
                break;
            }
            if ((currentEl as Node).nodeName === 'APP-ROOT') {
                return;
            }
        }

        // flatten the XPath stack using '/'
        const fullPath = '//*[not(./app-root)]//' + pathStack.join('/');
        const matches = RecordingComponent.getArrayXPath(fullPath);
        if (matches.length !== 1) {
            throw new Error('Can\'t do anything right!');
        }

        // minimize XPath by splitting up every combination and checking only 1 element is matched for click
        const combinations: Array<string> = [];
        // * between 1 to N segments
        for (let i = 1; i < pathStack.length; i++) {
            for (let j = 1; j < i; j++) {
                const segments = ([
                    ...pathStack.slice(j, i),
                    // replace match with an extra / to create // between unnecessary segments
                    '', // added to create // between target element
                    pathStack[ pathStack.length - 1 ]
                ]).join('/');
                combinations.push('//' + segments);
            }
            // * starts from 0 to N
            // *
        }

        // sort by smallest and return shortest path matching 1 DOM element
        const minimal = combinations
                .filter(c => RecordingComponent.getArrayXPath(c).length === 1)
                .sort((a, b) => a.length - b.length);

        return minimal[ 0 ];
        // TODO: prioritize by button/input, ids, classes, attributes? (extra credit), index
    }

}
