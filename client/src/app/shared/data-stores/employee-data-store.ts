import {EmployeeModel} from "../data-models/Employee.model";

export var employeeDataStore: EmployeeModel[] = [
  {
    id: 1,
    name: 'John butler',
    email: 'john23@gmail.com',
    phone: '1234567890',
    address: '123 Main St',
    organizationId: '65dcf69ffc3e7c696d16aa57',
    departmentId: '65dcf6ea090f1d3b06e84805',
    channels: [{
      id: '65dcf6ea090f1d3b06e84806',
      name: 'HR DepartmentOfficial Channel',
      description: "This is official channel for HR Department. Please do not try to edit",
      departmentId: "65dcf6ea090f1d3b06e84805",
      photo: ""
    }],
    jobData: {
      position: 'Manager',
      department: 'HR Department',
      salary: '120000',
      doj: '2021-03-26',
    },
    gender: 'male',
    dob: '1994-02-20',
    photo: '1',
    status: 'onboarding',
    level: '1'
  }
]
