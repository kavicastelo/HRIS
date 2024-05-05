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
import {AuthService} from "../../../../services/auth.service";
import {DateFormatPipe} from "../../../../DTO/DateFormatPipe";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  employeeDataStore:any;
  employee: any
  userId: any;
  chosenPhoto: File | any;

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
              private cookieService: AuthService,
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
    const doj:any = new Date(this.employee[0].jobData.doj).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    this.editProfileForm.get('firstname')?.setValue(firstName.split(' ')[0]);
    this.editProfileForm.get('lastname')?.setValue(firstName.split(' ')[1]);
    this.editProfileForm.get('dob')?.setValue(this.employee[0].dob);
    this.editProfileForm.get('nic')?.setValue(this.employee[0].nic);
    this.editProfileForm.get('address')?.setValue(this.employee[0].address);
    this.editProfileForm.get('email')?.setValue(this.employee[0].email);
    this.editProfileForm.get('phone')?.setValue(this.employee[0].phone);
    this.editProfileForm.get('department')?.setValue(this.employee[0].jobData.department);
    this.editProfileForm.get('doj')?.setValue(doj);
    this.editProfileForm.get('status')?.setValue(this.employee[0].status);
  }

  navigateBetweenTabs(path: string) {
    this.router.navigate([`/profile/${this.userId}/${path}/${this.userId}`]);
  }

  convertToSafeUrl(url:any):SafeResourceUrl{
    return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
  }

  updateEmployee() {
    const formData: any = new FormData();
    formData.append('id', this.employee[0].id)
    formData.append('name', this.editProfileForm.value.firstname+" "+this.editProfileForm.value.lastname)
    formData.append('email', this.editProfileForm.value.email)
    formData.append('phone', this.editProfileForm.value.phone)
    formData.append('address', this.editProfileForm.value.address)
    formData.append('organizationId', this.employee[0].organizationId)
    formData.append('departmentId', this.employee[0].departmentId)
    formData.append('channels', this.employee[0].channels)
    formData.append('jobData', this.employee[0].jobData)
    formData.append('gender', this.employee[0].gender)
    formData.append('dob', this.employee[0].dob)
    formData.append('nic', this.employee[0].nic)
    formData.append('photo', this.chosenPhoto)
    formData.append('status', this.employee[0].status)
    formData.append('level', this.employee[0].level)
    this.employeeService.updateEmployeeById(this.employee[0].id,formData)

    location.reload();
  }

  choosePhoto(): void {
    this.chosenPhoto = null // clear the photo input field before assign a value
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg';
    input.onchange = (event: any) => {
      this.handleFileInput(event);
    };
    input.click();
  }

  handleFileInput(event: any): void {
    const maxSize = 5 * 1024 * 1024;
    // Extract the chosen image file
    const files = event.target.files;
    if (files.length > 0) {
      if (files[0].size <= maxSize){
        this.chosenPhoto = files[0];
        this.onFileSelected()
      }
      else{
        alert("Your Image is too large. Select under 5MB")
      }
    }
  }

  onFileSelected() {
    const reader = new FileReader();

    const imgtag: any = document.getElementById("empProfile");
    imgtag.title = this.chosenPhoto?.name;

    reader.onload = function(event) {
      imgtag.src = event.target?.result;
    };

    reader.readAsDataURL(this.chosenPhoto);
  }

  removePhoto() {
    // Create a path to the default image file in the assets folder
    const defaultImagePath = 'assets/imgs/shared/default_profile.jpg';

    // Load the default image file
    fetch(defaultImagePath)
        .then(response => response.blob())
        .then(blob => {
          // Create a File object from the blob
          const defaultImageFile = new File([blob], 'default_profile.jpg', { type: 'image/jpeg' });

          // Assign the default image file to the chosenPhoto variable
          this.chosenPhoto = defaultImageFile;

          // Display the default image in the UI
          const imgtag: any = document.getElementById("empProfile");
          imgtag.src = URL.createObjectURL(defaultImageFile);
        })
        .catch(error => {
          console.error('Failed to load default image:', error);
        });
  }
}
