import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSelect} from "@angular/material/select";
import {OrganizationService} from "../../../services/organization.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-leaves-config-dialog',
  templateUrl: './leaves-config-dialog.component.html',
  styleUrls: ['./leaves-config-dialog.component.scss']
})
export class LeavesConfigDialogComponent implements OnInit {
  receivedData: any

  leavesConfigForm = new FormGroup({
    annualLeave: new FormControl('', [
      Validators.required
    ]),
    sickLeave: new FormControl('', [
      Validators.required
    ]),
    casualLeave: new FormControl('', [
      Validators.required
    ]),
    maternityLeave: new FormControl('', [
      Validators.required
    ]),
    paternityLeave: new FormControl('', [
      Validators.required
    ]),
    noPayLeave: new FormControl('', [
      Validators.required
    ])
  })

  constructor(private organizationService: OrganizationService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private renderer: Renderer2,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<LeavesConfigDialogComponent>) {
  }

  ngOnInit(): void {
    this.receivedData = this.data

    this.patchValues()
  }

  closePopup() {
    this.ref.close();
  }

  focusFieldOnEnter(event: KeyboardEvent, nextField: any) {
    if (event.key === 'Enter') {
      if (nextField instanceof MatSelect) {
        nextField.open();
      } else {
        this.renderer.selectRootElement(nextField).focus();
      }
      event.preventDefault();
    }
  }

  keyFormSubmit(event: KeyboardEvent, method: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      // Prevent the default Enter key behavior (e.g., newline in textarea)
      event.preventDefault();

      // Perform the method
      if (method == 'save') {
        this.saveConfig()
      } else if (method == 'edit') {
        this.editConfig()
      }
    }
  }

  patchValues() {
    this.leavesConfigForm.get('annualLeave')?.setValue(this.receivedData.data.data.annualLeave?this.receivedData.data.data.annualLeave:14);
    this.leavesConfigForm.get('sickLeave')?.setValue(this.receivedData.data.data.sickLeave?this.receivedData.data.data.sickLeave:7);
    this.leavesConfigForm.get('casualLeave')?.setValue(this.receivedData.data.data.casualLeave?this.receivedData.data.data.casualLeave:7);
    this.leavesConfigForm.get('maternityLeave')?.setValue(this.receivedData.data.data.maternityLeave?this.receivedData.data.data.maternityLeave:84);
    this.leavesConfigForm.get('paternityLeave')?.setValue(this.receivedData.data.data.paternityLeave?this.receivedData.data.data.paternityLeave:3);
    this.leavesConfigForm.get('noPayLeave')?.setValue(this.receivedData.data.data.noPayLeave?this.receivedData.data.data.noPayLeave:14);
  }

  editConfig() {
    // todo: implement config edit method in further
  }

  saveConfig() {
    if (this.leavesConfigForm.valid) {
      this.organizationService.updateLeaveCounts(this.receivedData.data.data.id,{
        annualLeave: this.leavesConfigForm.get('annualLeave')?.value,
        sickLeave: this.leavesConfigForm.get('sickLeave')?.value,
        casualLeave: this.leavesConfigForm.get('casualLeave')?.value,
        maternityLeave: this.leavesConfigForm.get('maternityLeave')?.value,
        paternityLeave: this.leavesConfigForm.get('paternityLeave')?.value,
        noPayLeave: this.leavesConfigForm.get('noPayLeave')?.value
      }).subscribe((data: any) => {
        this.snackBar.open("Leave configuration updated successfully", 'Close', {duration: 3000});
        this.closePopup()
      }, (error: any) => {
        this.snackBar.open("Something went wrong! Try again later", 'Close', {duration: 3000});
      })
    }
  }
}
