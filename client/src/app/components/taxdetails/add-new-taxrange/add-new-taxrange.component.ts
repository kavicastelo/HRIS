import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaxModel } from 'src/app/shared/data-models/tax.model';
import { TaxService } from 'src/app/services/tax.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  
  selector: 'app-add-new-taxrange',
  templateUrl: './add-new-taxrange.component.html',
  styleUrls: ['./add-new-taxrange.component.scss'],
  
})
export class AddNewTaxrangeComponent implements OnInit {

  tax: TaxModel[]=[];
  taxModel :TaxModel;

  taxDetailsFormErrorsList: String[] = [];

  taxDetailsFormGroup = this._formBuilder.group({
    minValueCtrl: ['', [Validators.required, Validators.min(1)]],
    maxValueCtrl: ['', [Validators.required, this.validateMaxValue]],
    rateCtrl: ['', [Validators.required, Validators.min(0)]]
  }, { validators: this.validateMinMax });


   title: String = "New Tax Range";
   finalizeBtnText: String = "Add";
   action: String = "ADD";

   notfoundError = false;

   constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private taxservice: TaxService,
    private cookieService: AuthService,
    private route: ActivatedRoute,
    private router: Router  
  ){
    this.taxModel=new TaxModel();

    // if(data.action == "EDIT_PAY_ITEM"){
    //   this.finalizeBtnText = "Update";
    // }

 
  }
  ngOnInit(): void {
    
  }

  addNewTaxRange(){
    this._snackBar.open("Creating the payitem...", "Dismiss", {duration: 5 * 1000});
    this.taxModel.organizationId = this.cookieService.organization();
    this.taxservice.saveTaxInfo(this.taxModel).subscribe((res: any) => {
      if(res){
        if(res.errorCode == "DUPLICATED_INFOMARTION"){
          this._snackBar.open(res.message, "Ok");
        }else{
          this._snackBar.open(res.message, "Dismiss", {duration: 5 * 1000});
          this.goBack();
        }
      }
    },(error: any) => {
      this._snackBar.open("Failed to create the taxiteam.", "Dismiss", {duration: 5 * 1000});
    })
  }

  validateMaxValue(control: any) {
    const minValue = control?.parent?.get('minValueCtrl')?.value;
    const maxValue = control.value;
    return minValue < maxValue ? null : { invalidMaxValue: true };
  }

  validateMinMax(group: FormGroup) {
    const minValue = group?.get('minValueCtrl')?.value;
    const maxValue = group?.get('maxValueCtrl')?.value;
    return minValue < maxValue ? null : { invalidMinMax: true };
  }

  isFormValid(){
    this.taxDetailsFormErrorsList = [];

    if(this.taxDetailsFormGroup.get('minValueCtrl')?.invalid){
      this.taxDetailsFormErrorsList.push("The minimum amount is out of range.");
    }

    if(this.taxDetailsFormGroup.get('maxValueCtrl')?.invalid){
      this.taxDetailsFormErrorsList.push("The maximum amount is out of range.");
    }

    if(this.taxDetailsFormGroup.get('rateCtrl')?.invalid){
      this.taxDetailsFormErrorsList.push("Invalid tax rate.");
    }

    return !this.taxDetailsFormGroup.valid;
  }

  goBack(){
    this.router.navigate(['payroll', 'taxdetails']);
  }

}