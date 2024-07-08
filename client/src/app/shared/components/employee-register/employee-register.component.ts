import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EmployeesService} from "../../../services/employees.service";
import {NGXLogger} from "ngx-logger";
import {DepartmentService} from "../../../services/department.service";
import {AuthService} from "../../../services/auth.service";
import {Observable, Subscription, tap} from "rxjs";
import {MultimediaService} from "../../../services/multimedia.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {
  CreateDepartmentDialogComponent
} from "../../dialogs/create-department-dialog/create-department-dialog.component";
import {ShiftsService} from "../../../services/shifts.service";
import {CreateShiftDialogComponent} from "../../dialogs/create-shift-dialog/create-shift-dialog.component";
import {OrganizationService} from "../../../services/organization.service";

@Component({
  selector: 'app-employee-register',
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeRegisterComponent implements OnInit, OnDestroy{
  private subscriptions: Subscription = new Subscription();
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
  shiftId:any
  shiftDataStore:any[] = [];
  filteredShifts:any[] = [];
  selectedShift:any[] = [];
  organization:any

  weekendFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6; // TODO: uncomment this line to add weekends to blocklist
    return true
  };

  constructor(private formBuilder: FormBuilder,
              private employeeService: EmployeesService,
              private organizationService: OrganizationService,
              private logger: NGXLogger,
              private departmentService:DepartmentService,
              private multimediaService: MultimediaService,
              private shiftService: ShiftsService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private cookieService: AuthService) { }

  ngOnInit(): void {
    this.organizationId = this.cookieService.organization();

    this.defaultPhoto()
    this.initForm()

    this.subscriptions.add(this.loadAllDepartments().subscribe());
    this.subscriptions.add(this.loadAllUsers().subscribe(() => this.getUser()));
    this.subscriptions.add(this.loadAllShifts().subscribe(() => this.filterShifts()));
    this.subscriptions.add(this.loadOrganization().subscribe());
  }

  ngOnDestroy(){
    // Unsubscribe from all subscriptions
    this.subscriptions.unsubscribe();
    this.clearImage();
  }

  initForm(){
    this.employeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      mname: [''],
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
      shift: ['', Validators.required],
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
      const shift = this.employeeForm.get('shift').value;
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

      const stringifiedShift = typeof shift === 'object' ? JSON.stringify(shift) : shift;
      sessionStorage.setItem('shift', stringifiedShift);
      formData.append('shift', stringifiedShift);

      sessionStorage.setItem('annual', this.organization.annualLeave);
      sessionStorage.setItem('sick', this.organization.sickLeave);
      sessionStorage.setItem('maternity', this.organization.maternityLeave);
      sessionStorage.setItem('paternity', this.organization.paternityLeave);
      sessionStorage.setItem('casual', this.organization.casualLeave);
      sessionStorage.setItem('noPay', this.organization.noPayLeave);

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

  loadOrganization(): Observable<any> {
    return this.organizationService.getOrganizationById(this.organizationId).pipe(
      tap(data => this.organization = data)
    );
  }

  filterDepartments():any[]{
    this.filteredDepartments = this.departmentDataStore.filter((dep:any) => dep.organizationId == this.organizationId)

    return this.filteredDepartments;
  }

  loadAllShifts(): Observable<any> {
    return this.shiftService.getAllShifts().pipe(
      tap(data => this.shiftDataStore = data)
    );
  }

  filterShifts():any[]{
    this.filteredShifts = this.shiftDataStore.filter((dep:any) => dep.organizationId == this.organizationId)

    return this.filteredShifts;
  }

  choosePhoto(): void {
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
    const files = event.target.files;
    if (files.length > 0 && files[0].size <= maxSize) {
      this.clearImage();  // Clear the previous image
      this.chosenPhoto = files[0];
      this.employeeForm.patchValue({ photo: this.chosenPhoto });
      this.onFileSelected();
    } else {
      alert("Your Image is too large. Select under 5MB");
    }
  }

  onFileSelected() {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const imgtag: any = document.getElementById("empAddProfile");
      imgtag.src = event.target?.result;
    };
    if (typeof this.chosenPhoto !== 'string') {
      reader.readAsDataURL(this.chosenPhoto);
    }
  }

  clearImage() {
    if (this.chosenPhoto) {
      URL.revokeObjectURL(this.chosenPhoto);
      this.chosenPhoto = null;
      const imgtag: any = document.getElementById("empAddProfile");
      if (imgtag) {
        imgtag.src = '';
      }
    }
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
        // Revoke previous object URL if any
        if (this.chosenPhoto) {
          URL.revokeObjectURL(this.chosenPhoto);
        }

        // Create a File object from the blob
        const defaultImageFile = new File([blob], 'default_profile.jpg', { type: 'image/jpeg' });

        // Assign the default image file to the chosenPhoto variable
        this.chosenPhoto = defaultImageFile;
        this.employeeForm.patchValue({ photo: this.chosenPhoto });

        // Display the default image in the UI
        const imgtag: any = document.getElementById("empAddProfile");
        imgtag.src = URL.createObjectURL(this.chosenPhoto);
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

  addShift() {
    const data = {
      organizationId: this.organizationId
    }
    this.toggleDialog('','',data,CreateShiftDialogComponent)
  }

  toggleDialog(title:any, msg:any, data: any, component:any) {
    const _popup = this.dialog.open(component, {
      maxHeight: '80vh',
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
      this.loadAllShifts().subscribe(()=>{
        this.filterShifts()
      })
    })
  }
}
