import {Component} from '@angular/core';
import {ThemeService} from "../../../../services/theme.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, tap} from "rxjs";
import {EmployeesService} from "../../../../services/employees.service";
import {MultimediaService} from "../../../../services/multimedia.service";
import {SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  employeeDataStore:any;
  employee: any
  userId: any;

  editProfileForm = new FormGroup({
    avatar: new FormControl(null),
    firstname: new FormControl(null, [
        Validators.required
      ]
    ),
    lastname: new FormControl(null),
    dob: new FormControl({value:null, disabled: true}),
    nic: new FormControl({value:null, disabled: true}),
    address: new FormControl(null, [
      Validators.required
    ]),
    email: new FormControl(null, [
      Validators.required
    ]),
    phone: new FormControl(null, [
      Validators.required
    ]),
    department: new FormControl({value:null, disabled: true}),
    doj: new FormControl({value:null, disabled: true}),
    status: new FormControl({value:null, disabled: true}),
  })

  constructor(private themeService: ThemeService,
              private employeeService: EmployeesService,
              private multimediaService: MultimediaService,
              private dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute,
              private logger: NGXLogger) {
  }

  async ngOnInit(): Promise<any> {
    await this.loadAllUsers().subscribe(()=>{
      this.getUser();
      this.patchValues();
    })
  }

  loadAllUsers(): Observable<any>{
    return this.employeeService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  getUser() {
    this.employeeDataStore.forEach((emp:any) => {
      this.route.paramMap.subscribe(params => {
        this.userId = params.get('id');

        if (emp.id == this.userId) {
          this.employee = [emp];
        }
      })
    })
  }

  patchValues() {
    const firstName = this.employee[0].name;
    this.editProfileForm.get('firstname')?.setValue(firstName.split(' ')[0]);
    this.editProfileForm.get('lastname')?.setValue(firstName.split(' ')[1]);
    this.editProfileForm.get('dob')?.setValue(this.employee[0].dob);
    this.editProfileForm.get('nic')?.setValue(this.employee[0].nic);
    this.editProfileForm.get('address')?.setValue(this.employee[0].address);
    this.editProfileForm.get('email')?.setValue(this.employee[0].email);
    this.editProfileForm.get('phone')?.setValue(this.employee[0].phone);
    this.editProfileForm.get('department')?.setValue(this.employee[0].jobData.department);
    this.editProfileForm.get('doj')?.setValue(this.employee[0].jobData.doj);
    this.editProfileForm.get('status')?.setValue(this.employee[0].status);
  }

  navigateBetweenTabs(path: string) {
    this.router.navigate([`/profile/${this.userId}/${path}/${this.userId}`]);
  }

  convertToSafeUrl(url:any):SafeResourceUrl{
    return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
  }
}
