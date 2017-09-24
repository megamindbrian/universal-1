import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from '../../../imports/search.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'bc-search',
    templateUrl: './search.component.html',
    styleUrls: [ './search.component.scss' ]
})
export class SearchComponent implements OnInit, OnDestroy {
    index = 0;
    results: Array<any> = [];
    resultsSub: Subscription;
    query = '';

    constructor(public service: SearchService,
                public ref: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.resultsSub = this.service.results(this.query).subscribe(r => {
            this.results = (r as Array<any>);
            this.ref.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.resultsSub.unsubscribe();
    }

    search(): void {
        this.service.search(this.query).subscribe(r => {
            console.log(r);
        });
    }
}
