import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EmployeesService} from "../../../services/employees.service";
import {NGXLogger} from "ngx-logger";
import {DepartmentService} from "../../../services/department.service";

@Component({
  selector: 'app-employee-register',
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.scss']
})
export class EmployeeRegisterComponent {
  employeeForm: FormGroup | any;

  departmentForm = new FormGroup({
    name: new FormControl(null,[
      Validators.required
    ]),
    description: new FormControl(null,[
      Validators.required
    ]),
    organizationId: new FormControl(null,[
      Validators.required
    ])
  })

  constructor(private formBuilder: FormBuilder, private employeeService: EmployeesService, private logger: NGXLogger, private departmentService:DepartmentService) { }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      organizationId: ['', Validators.required],
      departmentId: ['', Validators.required],
      channels: ['', Validators.required],
      jobData: this.formBuilder.group({
        position: ['', Validators.required],
        department: ['', Validators.required],
        salary: ['', Validators.required],
        doj: ['', Validators.required],
      }),
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      nic: ['', Validators.required],
      photo: [null, Validators.required],
      status: ['', Validators.required],
      level: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.employeeForm) {
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

      this.employeeService.uploadEmployeeData(formData);
    } else {
      // Handle form validation errors
    }
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    this.employeeForm.patchValue({ photo: file });
  }

  addDepartment() {
    if (this.departmentForm.valid) {
      this.departmentService.addDepartment({
        name: this.departmentForm.value.name,
        description: this.departmentForm.value.description,
        organizationId: this.departmentForm.value.organizationId
      }).subscribe(() => {
        this.departmentForm.reset();
        this.logger.info('Department added successfully');
      }, error => {
        this.logger.error(error);
      })
    }
  }
}
