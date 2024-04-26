import {Component, OnInit} from '@angular/core';
import {DepartmentService} from "../../services/department.service";
import {MultimediaService} from "../../services/multimedia.service";
import {BulletingBoardService} from "../../services/bulleting-board.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, tap} from "rxjs";

@Component({
  selector: 'app-bulletins',
  templateUrl: './bulletins.component.html',
  styleUrls: ['./bulletins.component.scss']
})
export class BulletinsComponent implements OnInit{

  bulletinBg: File | any;
  titleImg: File | any;
  bulletinForm: FormGroup | any;

  departmentDataStore:any;
  selectedDepartment:any;

  fontChecked:any;
  fontCheckDisabled = true;

  constructor(private departmentService:DepartmentService,
              private formBuilder: FormBuilder,
              private bulletinService: BulletingBoardService,
              private route: ActivatedRoute,
              private cookieService: AuthService) {
  }
  ngOnInit(): void {
    this.initBulletinForm()

    this.loadAllDepartments().subscribe(()=>{
      //TODO: do something
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

  loadAllDepartments(): Observable<any> {
    return this.departmentService.getAllDepartments().pipe(
        tap(data => this.departmentDataStore = data)
    );
  }

  chooseDefaultImage(url: string) {
    this.bulletinForm.patchValue({stringBg:url})
    this.fontCheckDisabled = false;
  }
}
