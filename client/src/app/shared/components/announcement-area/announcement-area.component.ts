import {Component, OnInit} from '@angular/core';
import {BulletingBoardService} from "../../../services/bulleting-board.service";
import {MultimediaService} from "../../../services/multimedia.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {Observable, tap} from "rxjs";
import {SafeResourceUrl} from "@angular/platform-browser";
import {LatestNewsService} from "../../../services/latest-news.service";

@Component({
  selector: 'app-announcement-area',
  templateUrl: './announcement-area.component.html',
  styleUrls: ['./announcement-area.component.scss']
})
export class AnnouncementAreaComponent implements OnInit{
  bulletinsDataStore:any[] =[];
  filteredBulletins: any

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


}
