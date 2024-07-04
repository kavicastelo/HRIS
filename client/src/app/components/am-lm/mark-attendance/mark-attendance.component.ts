import {Component, OnInit} from '@angular/core';
import {EmployeesService} from "../../../services/employees.service";
import {AuthService} from "../../../services/auth.service";
import {Observable, tap} from "rxjs";
import {AttendanceService} from "../../../services/attendance.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationsService} from "../../../services/notifications.service";
import {TimeFormatPipe} from "../../../DTO/TimeFormatPipe";
import {DateFormatPipe} from "../../../DTO/DateFormatPipe";

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss']
})
export class MarkAttendanceComponent implements OnInit{

  userId: any;
  organizationId:any;
  employeeDataStore: any[] = [];
  attendanceDataStore: any[] = [];
  filteredEmployees: any[] = [];
  filteredAttendance: any[] = [];
  employee: any = {
    id:''
  }

  targetInput:any;

  constructor(private employeeService: EmployeesService,
              private cookieService: AuthService,
              private notificationsService: NotificationsService,
              private attendanceService: AttendanceService,
              private snackBar: MatSnackBar) {
  }

  async ngOnInit(): Promise<any> {
    this.organizationId = this.cookieService.organization()
    this.userId = this.cookieService.userID()
    await this.loadAllUsers().subscribe(()=>{
      this.getUser()
    })

    await this.loadAllAttendance().subscribe(()=>{
      this.filterAttendance()
    })
  }

  loadAllUsers(): Observable<any> {
    return this.employeeService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  loadAllAttendance(): Observable<any> {
    return this.attendanceService.getAllAttendance().pipe(
        tap(data => this.attendanceDataStore = data)
    );
  }

  getUser() {
    this.userId = this.cookieService.userID().toString();
    return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
  }

  filterEmployees(): any[]{
    if (this.targetInput === undefined){
      this.filteredEmployees = this.employeeDataStore.filter((data: any) => data.organizationId === this.employee.organizationId)
    }
    this.filteredEmployees.sort((a:any, b:any) => {
      return new Date(b.jobData.doj).getTime() - new Date(a.jobData.doj).getTime()
    })

    return this.filteredEmployees;
  }

  filterAttendance(): any[]{
    this.filteredAttendance = this.attendanceDataStore.filter((data: any) => data.organizationId === this.organizationId)

    return this.filteredAttendance;
  }

  handleSearch(data: any): void {
    this.targetInput = data as HTMLInputElement;
    const value = this.targetInput.value
    if (value) {
      this.filteredEmployees = this.employeeDataStore.filter((data: any) =>
          data.organizationId === this.employee.organizationId && data.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.filteredEmployees = this.employeeDataStore.filter((data: any) => data.organizationId === this.employee.organizationId);
    }
  }

  // async markIn(e: any) {
  //   const attendances = this.filterAttendance();
  //
  //   if (e.workShift !=null && e.workShift.length > 0) {
  //     const shiftDetails = e.workShift[0];
  //
  //     // Convert shift times to Date objects for comparison
  //     const now = new Date();
  //     const earliestInTime = new Date(now);
  //     earliestInTime.setHours(parseInt(shiftDetails.earliestInTime), 0, 0, 0);
  //
  //     const latestOutTime = new Date(now);
  //     latestOutTime.setHours(parseInt(shiftDetails.latestOutTime), 0, 0, 0);
  //
  //     if (now < earliestInTime) {
  //       this.snackBar.open("You cannot mark attendance before the earliest in time", "OK", { duration: 3000 });
  //       return;
  //     }
  //
  //     // Filter out duplicate attendance entries for the current employee
  //     const uniqueAttendances = attendances.filter((attendance: any) =>
  //       attendance.recordInTime != null && attendance.recordOutTime == null && attendance.email == e.email
  //     );
  //
  //     try {
  //       if (uniqueAttendances.length > 0) {
  //         // Mark existing attendance entry
  //         await this.attendanceService.saveAttendance({
  //           id: uniqueAttendances[0].id, // Assuming there's only one unique attendance entry per employee
  //           organizationId: this.organizationId,
  //           name: e.name,
  //           email: e.email,
  //           recordInTime: new Date()
  //         }).toPromise();
  //       } else {
  //         // Mark new attendance entry
  //         await this.attendanceService.saveAttendance({
  //           organizationId: this.organizationId,
  //           name: e.name,
  //           email: e.email,
  //           recordInTime: new Date()
  //         }).toPromise();
  //       }
  //
  //       const notificationData = {
  //         userId: e.id,
  //         notification: this.employee.name + ` marked you are attended to the work at ${new TimeFormatPipe().transform(new Date().toString())} in ${new DateFormatPipe().transform(new Date().toString())}`,
  //         timestamp: new Date(),
  //         router: '/profile/'+this.userId+'/attendance/'+this.userId,
  //         status: true
  //       }
  //
  //       this.pushNotification(notificationData);
  //
  //       this.snackBar.open("Attendance Marked", "OK", {duration:3000});
  //     } catch (error) {
  //       console.error("Error marking attendance:", error);
  //     }
  //   } else {
  //     this.snackBar.open("Please select work shift for this employee", "OK", {duration:3000});
  //   }
  // }
  //
  // async depart(e: any){
  //   const attendances = this.filterAttendance();
  //
  //   // Filter out duplicate attendance entries for the current employee
  //   const uniqueAttendances = attendances.filter((attendance: any) =>
  //       attendance.recordInTime != null && attendance.recordOutTime == null && attendance.email == e.email
  //   );
  //
  //   try {
  //     if (uniqueAttendances.length > 0) {
  //       // calculate late minutes
  //       let lateMinutes:any = 0;
  //       if (this.calculateLateMins(uniqueAttendances[0].recordInTime) < (9 * 60)) {
  //         lateMinutes = (9*60) - this.calculateLateMins(uniqueAttendances[0].recordInTime)
  //       }
  //       // Mark existing attendance entry
  //       await this.attendanceService.departAttendance(uniqueAttendances[0].id,{
  //         organizationId: this.organizationId,
  //         name: e.name,
  //         email: e.email,
  //         recordInTime: uniqueAttendances[0].recordInTime,
  //         recordOutTime: new Date(),
  //         lateMinutes: lateMinutes
  //       }).toPromise();
  //       this.snackBar.open("Departure Marked", "OK", {duration:3000});
  //
  //       const notificationData = {
  //         userId: e.id,
  //         notification: this.employee.name + ` marked you are departure from the work at ${new TimeFormatPipe().transform(new Date().toString())} in ${new DateFormatPipe().transform(new Date().toString())}`,
  //         timestamp: new Date(),
  //         router: '/profile/'+this.userId+'/attendance/'+this.userId,
  //         status: true
  //       }
  //
  //       this.pushNotification(notificationData);
  //
  //     } else {
  //       // Mark new attendance entry
  //       this.snackBar.open("User not attended to mark the departure", "OK", {duration:3000});
  //     }
  //   } catch (error) {
  //     console.error("Error marking attendance:", error);
  //   }
  // }

  async markIn(e: any) {
    const attendances = this.filterAttendance();

    if (e.workShift != null && e.workShift.length > 0) {
      const shiftDetails = e.workShift[0]; // Use shift details from employee data

      // Convert shift start time to a Date object for comparison
      const now = new Date();
      const shiftStartTime = new Date(now);
      const shiftEndTime = new Date(now);

      const [startHour, startPeriod] = shiftDetails.startTime.split(' ');
      const shiftStartHour = parseInt(startHour.split('.')[0]);
      const shiftStartMinute = parseInt(startHour.split('.')[1]) || 0;

      if (startPeriod === 'AM' && shiftStartHour === 12) {
        shiftStartTime.setHours(0, shiftStartMinute, 0, 0); // handle 12 AM case
      } else if (startPeriod === 'PM' && shiftStartHour !== 12) {
        shiftStartTime.setHours(shiftStartHour + 12, shiftStartMinute, 0, 0); // PM case, not 12 PM
      } else {
        shiftStartTime.setHours(shiftStartHour, shiftStartMinute, 0, 0); // AM case or 12 PM case
      }

      const [endHour, endPeriod] = shiftDetails.endTime.split(' ');
      const shiftEndHour = parseInt(endHour.split('.')[0]);
      const shiftEndMinute = parseInt(endHour.split('.')[1]) || 0;

      if (endPeriod === 'AM' && shiftEndHour === 12) {
        shiftEndTime.setHours(0, shiftEndMinute, 0, 0); // handle 12 AM case
      } else if (endPeriod === 'PM' && shiftEndHour !== 12) {
        shiftEndTime.setHours(shiftEndHour + 12, shiftEndMinute, 0, 0); // PM case, not 12 PM
      } else {
        shiftEndTime.setHours(shiftEndHour, shiftEndMinute, 0, 0); // AM case or 12 PM case
      }

      // Calculate earliest in time
      const earliestInTime = new Date(shiftStartTime);
      const latestInTime = new Date(shiftEndTime);
      earliestInTime.setHours(earliestInTime.getHours() - parseInt(shiftDetails.earliestInTime));
      latestInTime.setHours(latestInTime.getHours() + parseInt(shiftDetails.firstHalfDuration) + 1); // Add 1 hour to first half duration for the half day purposes

      if (now < earliestInTime) {
        this.snackBar.open("You cannot mark attendance before the earliest in time", "OK", { duration: 3000 });
        return;
      }

      if (now > latestInTime) {
        this.snackBar.open("You cannot mark attendance after the latest in time", "OK", { duration: 3000 });
        return;
      }

      const uniqueAttendances = attendances.filter((attendance: any) =>
        attendance.recordInTime != null && attendance.recordOutTime == null && attendance.email == e.email
      );

      try {
        if (uniqueAttendances.length > 0) {
          await this.attendanceService.saveAttendance({
            id: uniqueAttendances[0].id,
            organizationId: this.organizationId,
            name: e.name,
            email: e.email,
            recordInTime: now,
            shiftStartTime: shiftDetails.startTime,
            shiftEndTime: shiftDetails.endTime,
            earliestInTime: shiftDetails.earliestInTime,
            latestOutTime: shiftDetails.latestOutTime,
            deductingHours: shiftDetails.deductingHours,
          }).toPromise();
        } else {
          await this.attendanceService.saveAttendance({
            organizationId: this.organizationId,
            name: e.name,
            email: e.email,
            recordInTime: now,
            shiftStartTime: shiftDetails.startTime,
            shiftEndTime: shiftDetails.endTime,
            earliestInTime: shiftDetails.earliestInTime,
            latestOutTime: shiftDetails.latestOutTime,
            deductingHours: shiftDetails.deductingHours,
          }).toPromise();
        }

        const notificationData = {
          userId: e.id,
          notification: this.employee.name + ` marked you are attended to the work at ${new TimeFormatPipe().transform(now.toString())} in ${new DateFormatPipe().transform(now.toString())}`,
          timestamp: now,
          router: '/profile/' + this.userId + '/attendance/' + this.userId,
          status: true
        }

        this.pushNotification(notificationData);

        this.snackBar.open("Attendance Marked", "OK", { duration: 3000 });
      } catch (error) {
        console.error("Error marking attendance:", error);
      }
    } else {
      this.snackBar.open("Please select work shift for this employee", "OK", { duration: 3000 });
    }
  }

  async depart(e: any) {
    const attendances = this.filterAttendance();

    if (e.workShift != null && e.workShift.length > 0) {
      const shiftDetails = e.workShift[0]; // Use shift details from employee data

      // Convert shift end time to a Date object for comparison
      const now = new Date();
      const shiftStartTime = new Date(now);
      const shiftEndTime = new Date(now);

      const [startHour, startPeriod] = shiftDetails.startTime.split(' ');
      const shiftStartHour = parseInt(startHour.split('.')[0]);
      const shiftStartMinute = parseInt(startHour.split('.')[1]) || 0;

      if (startPeriod === 'AM' && shiftStartHour === 12) {
        shiftStartTime.setHours(0, shiftStartMinute, 0, 0); // handle 12 AM case
      } else if (startPeriod === 'PM' && shiftStartHour !== 12) {
        shiftStartTime.setHours(shiftStartHour + 12, shiftStartMinute, 0, 0); // PM case, not 12 PM
      } else {
        shiftStartTime.setHours(shiftStartHour, shiftStartMinute, 0, 0); // AM case or 12 PM case
      }

      const [endHour, endPeriod] = shiftDetails.endTime.split(' ');
      const shiftEndHour = parseInt(endHour.split('.')[0]);
      const shiftEndMinute = parseInt(endHour.split('.')[1]) || 0;

      if (endPeriod === 'AM' && shiftEndHour === 12) {
        shiftEndTime.setHours(0, shiftEndMinute, 0, 0); // handle 12 AM case
      } else if (endPeriod === 'PM' && shiftEndHour !== 12) {
        shiftEndTime.setHours(shiftEndHour + 12, shiftEndMinute, 0, 0); // PM case, not 12 PM
      } else {
        shiftEndTime.setHours(shiftEndHour, shiftEndMinute, 0, 0); // AM case or 12 PM case
      }

      // Calculate latest out time
      const latestOutTime = new Date(shiftEndTime);
      latestOutTime.setHours(latestOutTime.getHours() + parseInt(shiftDetails.latestOutTime));

      if (now > latestOutTime) {
        this.snackBar.open("You cannot mark departure after the latest out time", "OK", { duration: 3000 });
        return;
      }

      const uniqueAttendances = attendances.filter((attendance: any) =>
        attendance.recordInTime != null && attendance.recordOutTime == null && attendance.email == e.email
      );

      try {
        if (uniqueAttendances.length > 0) {
          // Calculate late minutes, early departure minutes, and overtime hours
          const lateMinutes = this.calculateLateMins(uniqueAttendances[0].recordInTime, shiftStartTime, shiftDetails);
          const earlyDepartureMinutes = this.calculateEarlyDepartureMins(now.toISOString(), shiftEndTime, shiftDetails);
          const overtimeHours = this.calculateOvertimeHours(now.toISOString(), shiftEndTime, shiftDetails);

          await this.attendanceService.departAttendance(uniqueAttendances[0].id, {
            organizationId: this.organizationId,
            name: e.name,
            email: e.email,
            recordInTime: uniqueAttendances[0].recordInTime,
            recordOutTime: now,
            lateMinutes: lateMinutes,
            earlyDepartureMinutes: earlyDepartureMinutes,
            overtimeHours: overtimeHours
          }).toPromise();

          this.snackBar.open("Departure Marked", "OK", { duration: 3000 });

          const notificationData = {
            userId: e.id,
            notification: this.employee.name + ` marked you are departure from the work at ${new TimeFormatPipe().transform(now.toString())} in ${new DateFormatPipe().transform(now.toString())}`,
            timestamp: now,
            router: '/profile/' + this.userId + '/attendance/' + this.userId,
            status: true
          }

          this.pushNotification(notificationData);

        } else {
          this.snackBar.open("User not attended to mark the departure", "OK", { duration: 3000 });
        }
      } catch (error) {
        console.error("Error marking attendance:", error);
      }
    } else {
      this.snackBar.open("Please select work shift for this employee", "OK", { duration: 3000 });
    }
  }

  calculateLateMins(recordInTime: string, shiftStartTime: Date, shiftDetails: any): number {
    const inTime = new Date(recordInTime);
    const shiftStart = new Date(inTime);

    const [startHour, startPeriod] = shiftDetails.startTime.split(' ');
    const shiftStartHour = parseInt(startHour.split('.')[0]);
    const shiftStartMinute = parseInt(startHour.split('.')[1]) || 0;

    if (startPeriod === 'AM' && shiftStartHour === 12) {
      shiftStart.setHours(0, shiftStartMinute, 0, 0); // handle 12 AM case
    } else if (startPeriod === 'PM' && shiftStartHour !== 12) {
      shiftStart.setHours(shiftStartHour + 12, shiftStartMinute, 0, 0); // PM case, not 12 PM
    } else {
      shiftStart.setHours(shiftStartHour, shiftStartMinute, 0, 0); // AM case or 12 PM case
    }

    // Calculate the difference in milliseconds
    const differenceMs = inTime.getTime() - shiftStart.getTime();

    // Convert milliseconds to minutes
    return differenceMs > 0 ? differenceMs / (1000 * 60) : 0;
  }

  calculateEarlyDepartureMins(recordOutTime: string, shiftEndTime: Date, shiftDetails: any): number {
    const outTime = new Date(recordOutTime);
    const shiftEnd = new Date(outTime);

    const [endHour, endPeriod] = shiftDetails.endTime.split(' ');
    const shiftEndHour = parseInt(endHour.split('.')[0]);
    const shiftEndMinute = parseInt(endHour.split('.')[1]) || 0;

    if (endPeriod === 'AM' && shiftEndHour === 12) {
      shiftEnd.setHours(0, shiftEndMinute, 0, 0); // handle 12 AM case
    } else if (endPeriod === 'PM' && shiftEndHour !== 12) {
      shiftEnd.setHours(shiftEndHour + 12, shiftEndMinute, 0, 0); // PM case, not 12 PM
    } else {
      shiftEnd.setHours(shiftEndHour, shiftEndMinute, 0, 0); // AM case or 12 PM case
    }

    // Calculate the difference in milliseconds
    const differenceMs = shiftEnd.getTime() - outTime.getTime();

    // Convert milliseconds to minutes, return 0 if no early departure
    return differenceMs > 0 ? differenceMs / (1000 * 60) : 0;
  }

  calculateOvertimeHours(recordOutTime: string, shiftEndTime: Date, shiftDetails: any): number {
    const outTime = new Date(recordOutTime);
    const shiftEnd = new Date(outTime);

    const [endHour, endPeriod] = shiftDetails.endTime.split(' ');
    const shiftEndHour = parseInt(endHour.split('.')[0]);
    const shiftEndMinute = parseInt(endHour.split('.')[1]) || 0;

    if (endPeriod === 'AM' && shiftEndHour === 12) {
      shiftEnd.setHours(0, shiftEndMinute, 0, 0); // handle 12 AM case
    } else if (endPeriod === 'PM' && shiftEndHour !== 12) {
      shiftEnd.setHours(shiftEndHour + 12, shiftEndMinute, 0, 0); // PM case, not 12 PM
    } else {
      shiftEnd.setHours(shiftEndHour, shiftEndMinute, 0, 0); // AM case or 12 PM case
    }

    // Calculate the difference in milliseconds
    const differenceMs = outTime.getTime() - shiftEnd.getTime();

    // Convert milliseconds to hours, return 0 if no overtime
    return differenceMs > 0 ? differenceMs / (1000 * 60 * 60) : 0;
  }

  pushNotification(data:any){
    if (data){
      this.notificationsService.saveNotification(data).subscribe(data=>{
      }, error => {
        console.log(error)
      })
    }
  }

}
