import { Component } from '@angular/core';
import {Observable, tap} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BulletingBoardService} from "../../../services/bulleting-board.service";
import {LatestNewsService} from "../../../services/latest-news.service";
import {MultimediaService} from "../../../services/multimedia.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-latest-news',
  templateUrl: './latest-news.component.html',
  styleUrls: ['./latest-news.component.scss']
})
export class LatestNewsComponent {

  newsDataStore:any[] = [];
  filteredNews: any

  maxNewsDisplayed: number = 3;
  showAllNews: boolean = false;

  newsForm = new FormGroup({
    newsReUrl: new FormControl(null,[Validators.required]),
    newsDes: new FormControl(null,[Validators.required])
  })

  constructor(private bulletinService: BulletingBoardService,
              private newsService: LatestNewsService,
              private multimediaService: MultimediaService,
              private route: ActivatedRoute,
              private cookieService: AuthService) {
  }

  async ngOnInit(): Promise<any> {

    this.loadAllNews().subscribe(()=>{
      this.filterNews()
    })
  }

  loadAllNews(): Observable<any> {
    return this.newsService.getAllNews().pipe(
      tap(data => this.newsDataStore = data)
    );
  }

  filterNews(): any[]{
    const organization = this.cookieService.organization();
    this.filteredNews = this.newsDataStore.filter((data:any) => data.organizationId == organization? this.filteredNews = [data]: this.filteredNews = null)
    this.filteredNews.sort((a:any, b:any) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    return this.filteredNews;
  }

  toggleNews() {
    this.showAllNews = !this.showAllNews;
    if (this.showAllNews) {
      this.maxNewsDisplayed = Infinity;
    } else {
      this.maxNewsDisplayed = 3;
    }
  }

  openURL(url: string): void {
    if (url) {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.click();
    }
  }
}
