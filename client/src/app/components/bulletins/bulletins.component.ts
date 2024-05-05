import {Component, OnInit} from '@angular/core';
import {DepartmentService} from "../../services/department.service";
import {MultimediaService} from "../../services/multimedia.service";
import {BulletingBoardService} from "../../services/bulleting-board.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, tap} from "rxjs";
import {SafeResourceUrl} from "@angular/platform-browser";
import {LatestNewsService} from "../../services/latest-news.service";

@Component({
  selector: 'app-bulletins',
  templateUrl: './bulletins.component.html',
  styleUrls: ['./bulletins.component.scss']
})
export class BulletinsComponent implements OnInit{

  bulletinBg: File | any;
  titleImg: File | any;
  bulletinForm: FormGroup | any;
  bulletinsDataStore:any[] = [];
  filteredBulletins: any

  newsDataStore:any[] = [];
  filteredNews: any

  departmentDataStore:any;
  selectedDepartment:any;

  fontChecked:any;
  fontCheckDisabled = true;

  maxNewsDisplayed: number = 3;
  showAllNews: boolean = false;

  newsForm = new FormGroup({
    newsReUrl: new FormControl(null,[Validators.required]),
    newsDes: new FormControl(null,[Validators.required])
  })

  constructor(private departmentService:DepartmentService,
              private formBuilder: FormBuilder,
              private bulletinService: BulletingBoardService,
              private newsService: LatestNewsService,
              private multimediaService: MultimediaService,
              private route: ActivatedRoute,
              private cookieService: AuthService) {
  }
  async ngOnInit(): Promise<any> {
    this.initBulletinForm()

    this.loadAllDepartments().subscribe(()=>{
      //TODO: do something
    })

    this.loadAllBulletins().subscribe(()=>{
      this.filterBulletins()
    })

    this.loadAllNews().subscribe(()=>{
      this.filterNews()
    })
  }

  initBulletinForm(){
    this.bulletinForm = this.formBuilder.group({
      depId: ['', Validators.required],
      title: ['', Validators.required],
      msg: ['', Validators.required],
      reUrl: ['', Validators.required],
      action: ['', Validators.required],
      stringBg: [''],
      bgPhoto: [null],
      titlePhoto: [null]
    })
  }

  addBulletin(){
    sessionStorage.setItem('orgId', this.cookieService.organization())
    sessionStorage.setItem('bulletin-color', this.fontChecked)
    if (this.bulletinForm) {

      const formData = new FormData();
      for (const key in this.bulletinForm.value) {
        if (this.bulletinForm.value.hasOwnProperty(key)) {
          formData.append(key, this.bulletinForm.value[key]);
        }
      }

      this.bulletinService.uploadBulletin(formData);
      this.bulletinForm.reset();
      this.titleImg = null;
      this.bulletinBg = null;
      this.loadAllBulletins().subscribe(()=>{
        this.filterBulletins()
      })
    } else {
      // Handle form validation errors
    }
  }

  chooseBulletinBg(): void {
    this.bulletinBg = null // clear the photo input field before assign a value
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg';
    input.onchange = (event: any) => {
      this.handleBulletinBg(event);
    };
    input.click();
  }

  handleBulletinBg(event: any): void {
    const maxSize = 1024 * 1024;

    const file = event.target.files[0];
    if (file.size <= maxSize){
      this.bulletinBg = file
      this.bulletinForm.patchValue({ bgPhoto: file });
      this.onBulletinBgSelected();
      this.fontCheckDisabled = false;
    }
    else{
      alert("Your Image is too large. Select under 1MB")
    }
  }

  onBulletinBgSelected(): void {
    const bulletinCard: any = document.getElementById("bulletinCard");

    if (this.bulletinBg) {
      const url = `url('${URL.createObjectURL(this.bulletinBg)}')`;
      bulletinCard.style.backgroundImage = url;
    }
  }

  chooseBulletinTitle(): void {
    this.titleImg = null // clear the photo input field before assign a value
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      this.handleBulletinTitle(event);
    };
    input.click();
  }

  handleBulletinTitle(event:any): void {
    const maxSize = 1024 * 1024;

    const file = event.target.files[0];
    if (file.size <= maxSize){
      this.titleImg = file
      this.bulletinForm.patchValue({ titlePhoto: file });
      this.onTitleBgSelected();
    }
    else{
      alert("Your Image is too large. Select under 1MB")
    }
  }

  onTitleBgSelected(): void {
    const reader = new FileReader();

    const imgtag: any = document.getElementById("titleImage");
    imgtag.title = this.titleImg?.name;

    reader.onload = function(event) {
      imgtag.src = event.target?.result;
    };

    reader.readAsDataURL(this.titleImg);
  }

  chooseDefaultImage(url: string) {
    this.bulletinForm.patchValue({stringBg:url})
    this.fontCheckDisabled = false;
  }

  loadAllDepartments(): Observable<any> {
    return this.departmentService.getAllDepartments().pipe(
        tap(data => this.departmentDataStore = data)
    );
  }

  loadAllBulletins(): Observable<any> {
    return this.bulletinService.getAllBulletinBoards().pipe(
        tap(data => this.bulletinsDataStore = data)
    );
  }

  filterBulletins(): any[]{
    const organization = this.cookieService.organization();
    this.filteredBulletins = this.bulletinsDataStore.filter((data:any) => data.organizationId == organization? this.filteredBulletins = [data]: this.filteredBulletins = null)
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

  addNews(){
    if (this.newsForm.valid){
      this.newsService.saveNews({
        organizationId: this.cookieService.organization(),
        description: this.newsForm.value.newsDes,
        redirectUrl: this.newsForm.value.newsReUrl,
        timestamp: new Date()
      }).subscribe(data=>{
        this.newsForm.reset();
        this.loadAllNews().subscribe(()=>{
          this.filterNews();
        })
      }, error => {
        console.log(error)
      })
    }
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
}
