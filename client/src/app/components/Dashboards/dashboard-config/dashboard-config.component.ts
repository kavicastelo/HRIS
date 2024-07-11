import {Component, OnInit} from '@angular/core';
import {Observable, tap} from "rxjs";
import {ShiftsService} from "../../../services/shifts.service";
import {AuthService} from "../../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateShiftDialogComponent} from "../../../shared/dialogs/create-shift-dialog/create-shift-dialog.component";
import {OrganizationService} from "../../../services/organization.service";
import {EmployeesService} from "../../../services/employees.service";
import {LeavesConfigDialogComponent} from "../../../shared/dialogs/leaves-config-dialog/leaves-config-dialog.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SafeResourceUrl} from "@angular/platform-browser";
import {MultimediaService} from "../../../services/multimedia.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-dashboard-config',
  templateUrl: './dashboard-config.component.html',
  styleUrls: ['./dashboard-config.component.scss']
})
export class DashboardConfigComponent implements OnInit{

  organizationId: any
  organization: any = {
    isLeavesConfigured: false
  }

  chosenPhoto: File | any;

  editProfileForm = new FormGroup({
    avatar: new FormControl(null),
    orgName: new FormControl(null, [
        Validators.required
      ]
    ),
    description: new FormControl(null),
    contactPerson: new FormControl(null, [
      Validators.required
    ]),
    contactEmail: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),
    address: new FormControl(null),
    email: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.minLength(10)
    ]),
    telephone: new FormControl(null, [
      Validators.required,
      Validators.minLength(10)
    ])
  })

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private cookieService: AuthService,
    private multimediaService: MultimediaService,
    private snackBar: MatSnackBar,
    private organizationService: OrganizationService
  ) {

  }
  async ngOnInit(): Promise<any> {
    this.organizationId = this.cookieService.organization().toString()

    await this.getOrganization().subscribe(()=>{this.patchValues()})
  }

  getOrganization(): Observable<any> {
    return this.organizationService.getOrganizationById(this.organizationId).pipe(
      tap(data => this.organization = data)
    )
  }

  toggleDialog(title: any, msg: any, data: any, component: any) {
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
      this.getOrganization().subscribe(()=>{})
    })
  }

  addShift() {
    const data = {
      organizationId: this.organizationId
    }
    this.toggleDialog('', '', data, CreateShiftDialogComponent)
  }

  updateLeaveConfig(organization: any) {
    if (!organization.isLeavesConfigured) {
      if (organization) {
        const data = {
          id: organization.isLeavesConfigured,
          organizationId: this.organizationId,
          data: organization
        }
        this.toggleDialog('', '', data, LeavesConfigDialogComponent)
      }
    }
  }

  patchValues() {
    this.editProfileForm.get('orgName')?.setValue(this.organization.organizationName);
    this.editProfileForm.get('description')?.setValue(this.organization.description);
    this.editProfileForm.get('contactPerson')?.setValue(this.organization.contactPerson);
    this.editProfileForm.get('contactEmail')?.setValue(this.organization.contactEmail);
    this.editProfileForm.get('address')?.setValue(this.organization.address);
    this.editProfileForm.get('email')?.setValue(this.organization.email);
    this.editProfileForm.get('phone')?.setValue(this.organization.phone);
    this.editProfileForm.get('telephone')?.setValue(this.organization.telephone);
  }

  convertToSafeUrl(url:any):SafeResourceUrl{
    return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
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

    const imgtag: any = document.getElementById("orgProfile");
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
        const imgtag: any = document.getElementById("orgProfile");
        imgtag.src = URL.createObjectURL(defaultImageFile);
      })
      .catch(error => {
        console.error('Failed to load default image:', error);
      });
  }

  updateOrganization() {
    if (this.editProfileForm.valid) {
      const formData: any = new FormData();
      formData.append('id', this.organization.id)
      formData.append('organizationName', this.editProfileForm.value.orgName)
      formData.append('description', this.editProfileForm.value.description)
      formData.append('contactPerson', this.editProfileForm.value.contactPerson)
      formData.append('contactEmail', this.editProfileForm.value.contactEmail)
      formData.append('address', this.editProfileForm.value.address)
      formData.append('email', this.editProfileForm.value.email)
      formData.append('phone', this.editProfileForm.value.phone)
      formData.append('telephone', this.editProfileForm.value.telephone)
      formData.append('photo', this.chosenPhoto)
      this.organizationService.updateOrganization(this.organization.id,formData).subscribe(data =>{
        this.getOrganization().subscribe(()=>{this.patchValues()})
        this.snackBar.open("Organization updated successfully","OK",{duration:2000})
      })
    }
  }
}
