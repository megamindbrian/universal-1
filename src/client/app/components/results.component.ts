import { SearchService } from '../../../imports/search.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as Prism from 'prismjs';

@Component({
    selector: 'bc-results',
    template: `
        <pre [class]="'language-'+(r.lang||'javascript')" *ngFor="let r of results" [innerHTML]="highlight(r.code)">
        </pre>
    `,
    styleUrls: [ './results.component.scss' ]
})
export class ResultsComponent implements OnInit, OnDestroy {
    query = '';
    results: Array<any> = [];
    private resultsSub: Subscription;

    constructor(public service: SearchService,
                public ref: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.resultsSub = this.service.results(this.query).subscribe(r => {
            this.results = [ (r as Array<any>)[ 0 ] ];
            this.ref.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.resultsSub.unsubscribe();
    }

    highlight(code: string): string {
        return Prism.highlight(code, Prism.languages.javascript);
    }
}

