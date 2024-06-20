import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EmployeesService} from "../../../services/employees.service";
import {NGXLogger} from "ngx-logger";
import {DepartmentService} from "../../../services/department.service";
import {AuthService} from "../../../services/auth.service";
import {Observable, tap} from "rxjs";
import {MultimediaService} from "../../../services/multimedia.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {
  CreateDepartmentDialogComponent
} from "../../dialogs/create-department-dialog/create-department-dialog.component";

@Component({
  selector: 'app-employee-register',
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.scss']
})
export class EmployeeRegisterComponent implements OnInit{
  employeeForm: FormGroup | any;
  organizationId: any;
  departmentId:any
  departmentDataStore:any[] = [];
  filteredDepartments:any[] = [];
  selectedDepartment:any[] = [];
  employeeDataStore:any[] = [];
  employee:any;
  userId:any;
  chosenPhoto: File | any;

  constructor(private formBuilder: FormBuilder,
              private employeeService: EmployeesService,
              private logger: NGXLogger,
              private departmentService:DepartmentService,
              private multimediaService: MultimediaService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private cookieService: AuthService) { }

  async ngOnInit(): Promise<any> {
    this.organizationId = this.cookieService.organization();

    this.initForm()

    this.defaultPhoto()

    await this.loadAllDepartments().subscribe(()=>{
      //TODO: do something
    })

    await this.loadAllUsers().subscribe(()=>{
      this.getUser()
    })
  }

  initForm(){
    this.employeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      telephone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      zip: [''],
      jobData: this.formBuilder.group({
        employementType: ['', Validators.required],
        position: ['', Validators.required], // designation
        jobGrade: ['', Validators.required],
        personalGrade: ['', Validators.required],
        supervisor: ['', Validators.required],
        businessUnit: ['', Validators.required],
        department: [sessionStorage.getItem('dep'), Validators.required],
        location: ['', Validators.required],
        branch: ['', Validators.required],
        salary: ['', Validators.required],
        doj: ['', Validators.required],
      }),
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      nic: ['', Validators.required],
      photo: [null],
      status: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      nationality: ['', Validators.required],
      religion: ['', Validators.required],
      dateOfRetirement: ['', Validators.required],
      dateOfExit: ['', Validators.required],
      exitReason: ['', Validators.required],
      dateOfContractEnd: ['', Validators.required]
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
        }
      })
    })
  }

  onSubmit() {
    sessionStorage.setItem('orgId', this.cookieService.organization())
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
        if(d.name == this.selectedDepartment){
          sessionStorage.setItem('depId', d.id);
        }
      })

      this.employeeDataStore.forEach((e:any) =>{
        if(e.email == this.employeeForm.value.email){
          sessionStorage.setItem('isExists', "1");
        }
      })
      if (sessionStorage.getItem('isExists') != "1"){
        this.employeeService.uploadEmployeeData(formData);
        this.employeeForm.reset();
      } else {
        this.snackBar.open("User Already Exists!!", "OK", {duration:3000})
      }
      sessionStorage.removeItem('isExists');

    } else {
      this.snackBar.open("Some required fields are missing!","OK",{duration:3000})
    }
  }

  loadAllDepartments(): Observable<any> {
    return this.departmentService.getAllDepartments().pipe(
        tap(data => this.departmentDataStore = data)
    );
  }

  filterDepartments():any[]{
    this.filteredDepartments = this.departmentDataStore.filter((dep:any) => dep.organizationId == this.organizationId)

    return this.filteredDepartments;
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
    // Check if default photo already loaded
    if (this.chosenPhoto) {
      return;
    }

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

  addDepartment() {
    const data = {
      organizationId: this.organizationId
    }
    this.toggleDialog('','',data,CreateDepartmentDialogComponent)
  }

  toggleDialog(title:any, msg:any, data: any, component:any) {
    const _popup = this.dialog.open(component, {
      width: '350px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        data: data,
        title: title,
        msg: msg
      }
    });
    _popup.afterClosed().subscribe(item => {
      this.loadAllDepartments().subscribe(()=>{
        this.filterDepartments()
      })
    })
  }
}
