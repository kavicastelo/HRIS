import {Component, OnInit} from '@angular/core';
import {BulletingBoardService} from "../../../services/bulleting-board.service";
import {MultimediaService} from "../../../services/multimedia.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {Observable, tap} from "rxjs";
import {SafeResourceUrl} from "@angular/platform-browser";
import {LatestNewsService} from "../../../services/latest-news.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-announcement-area',
  templateUrl: './announcement-area.component.html',
  styleUrls: ['./announcement-area.component.scss']
})
export class AnnouncementAreaComponent implements OnInit{
  bulletinsDataStore:any[] =[];
  filteredBulletins: any

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
    this.loadAllBulletins().subscribe(()=>{
      this.filterBulletins()
    })

    this.loadAllNews().subscribe(()=>{
      this.filterNews()
    })
  }

  loadAllBulletins(): Observable<any> {
    return this.bulletinService.getAllBulletinBoards().pipe(
        tap(data => this.bulletinsDataStore = data)
    );
  }

  filterBulletins(): any[]{
    const organization = this.cookieService.organization();
    const department = this.cookieService.department();
    this.filteredBulletins = this.bulletinsDataStore.filter((data:any) => data.organizationId == organization? this.filteredBulletins = [data]: this.filteredBulletins = null);
    this.filteredBulletins = this.bulletinsDataStore.filter((data:any) => data.departmentId == department? this.filteredBulletins = [data]: this.filteredBulletins = null);
    this.filteredBulletins.sort((a:any, b:any) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    return this.filteredBulletins;
  }

  convertToSafeUrl(url:any):SafeResourceUrl{
    if (url.indexOf("/9j/")){
      return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
    }
    else{
      return this.multimediaService.convertToSafeUrl(url,'image/png')
    }
  }

  getBackgroundStyle(bulletin: any): any {
    let style: any = {};

    if (bulletin.stringBg !== '') {
      style['background-image'] = `url(${bulletin.stringBg})`;
    } else if (bulletin.backgroundImage) {
      style['background-image'] = `url(data:image/jpeg;base64,${bulletin.backgroundImage})`;
    }
    return style;
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
