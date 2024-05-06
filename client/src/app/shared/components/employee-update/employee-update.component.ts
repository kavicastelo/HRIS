import {ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EmployeesService} from "../../../services/employees.service";
import {NGXLogger} from "ngx-logger";
import {DepartmentService} from "../../../services/department.service";
import {MultimediaService} from "../../../services/multimedia.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {Observable, tap} from "rxjs";
import {SafeResourceUrl} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.scss']
})
export class EmployeeUpdateComponent {
  employeeForm: FormGroup | any;
  organizationId: any;
  departmentId:any
  departmentDataStore:any;
  selectedDepartment:any;
  employeeDataStore:any;
  employee:any;
  userId:any;
  chosenPhoto: File | any;

  constructor(private formBuilder: FormBuilder,
              private employeeService: EmployeesService,
              private logger: NGXLogger,
              private departmentService:DepartmentService,
              private multimediaService: MultimediaService,
              private changeDetectorRef: ChangeDetectorRef,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private cookieService: AuthService) { }

  async ngOnInit(): Promise<any> {

    this.initForm()

    this.loadAllDepartments().subscribe(()=>{
      //TODO: do something
    })

    this.loadAllUsers().subscribe(()=>{
      this.getUser()
    })
  }

  initForm(){
    this.employeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      jobData: this.formBuilder.group({
        position: ['', Validators.required],
        department: [sessionStorage.getItem('dep'), Validators.required],
        salary: ['', Validators.required],
        doj: ['', Validators.required],
      }),
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      nic: ['', Validators.required],
      photo: [null],
      status: ['', Validators.required]
    });
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
          this.patchValues()
        }
      })
    })
  }

  patchValues() {
    const firstName = this.employee[0].name;
    this.employeeForm.get('name')?.setValue(firstName.split(' ')[0]);
    this.employeeForm.get('lname')?.setValue(firstName.split(' ')[1]);
    this.employeeForm.get('dob')?.setValue(this.employee[0].dob);
    this.employeeForm.get('nic')?.setValue(this.employee[0].nic);
    this.employeeForm.get('gender')?.setValue(this.employee[0].gender);
    this.employeeForm.get('address')?.setValue(this.employee[0].address);
    this.employeeForm.get('email')?.setValue(this.employee[0].email);
    this.employeeForm.get('phone')?.setValue(this.employee[0].phone);

    // Access the jobData group within employeeForm and set its values
    const jobData = this.employeeForm.get('jobData') as FormGroup;
    jobData.get('department')?.setValue(this.employee[0].jobData.department);
    this.changeDetectorRef.detectChanges();
    jobData.get('position')?.setValue(this.employee[0].jobData.position);
    jobData.get('doj')?.setValue(this.employee[0].jobData.doj);
    jobData.get('salary')?.setValue(this.employee[0].jobData.salary);

    this.employeeForm.get('status')?.setValue(this.employee[0].status);
    this.selectedDepartment = this.employee[0].jobData.department
  }

  convertToSafeUrl(url:any):SafeResourceUrl{
    return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
  }

  onSubmit() {
    sessionStorage.setItem('orgId', this.cookieService.organization())
    sessionStorage.setItem('updatingUserId', this.userId)
    if (this.employeeForm.valid) {
      const jobData = this.employeeForm.get('jobData').value;
      this.employeeForm.patchValue({ jobData: null });

      const formData = new FormData();
      for (const key in this.employeeForm.value) {
        if (this.employeeForm.value.hasOwnProperty(key)) {
          formData.append(key, this.employeeForm.value[key]);
        }
      }

      // Append jobData fields to the formData
      const stringifiedJobData = typeof jobData === 'object' ? JSON.stringify(jobData) : jobData;
      sessionStorage.setItem('jobData', stringifiedJobData);
      formData.append('jobData', stringifiedJobData);

      this.departmentDataStore.forEach((d:any) => {
        if (d.name == this.selectedDepartment){
          sessionStorage.setItem('depId', d.id);
        }
      })

      this.employeeService.updateFullEmployeeById(this.userId, formData);
      location.reload()
    } else {
      this.snackBar.open("Some required fields are missing!","OK",{duration:2000})
    }
  }

  loadAllDepartments(): Observable<any> {
    return this.departmentService.getAllDepartments().pipe(
        tap(data => this.departmentDataStore = data)
    );
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
        this.employeeForm.patchValue({ photo: this.chosenPhoto });
        this.onFileSelected()
      }
      else{
        alert("Your Image is too large. Select under 5MB")
      }
    }
  }

  onFileSelected() {
    const reader = new FileReader();

    const imgtag: any = document.getElementById("empAddProfile");
    imgtag.title = this.chosenPhoto?.name;

    reader.onload = function(event) {
      imgtag.src = event.target?.result;
    };

    reader.readAsDataURL(this.chosenPhoto);
  }

  defaultPhoto() {
    this.chosenPhoto = null;
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
          this.employeeForm.patchValue({ photo: this.chosenPhoto });

          // Display the default image in the UI
          const imgtag: any = document.getElementById("empAddProfile");
          imgtag.src = URL.createObjectURL(defaultImageFile);
        })
        .catch(error => {
          console.error('Failed to load default image:', error);
        });
  }
}
