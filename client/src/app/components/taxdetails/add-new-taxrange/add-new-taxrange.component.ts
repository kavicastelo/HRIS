import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaxModel } from 'src/app/shared/data-models/tax.model';
import { TaxService } from 'src/app/services/tax.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  
  selector: 'app-add-new-taxrange',
  templateUrl: './add-new-taxrange.component.html',
  styleUrls: ['./add-new-taxrange.component.scss'],
  
})
export class AddNewTaxrangeComponent implements OnInit {

  tax: TaxModel[]=[];
  taxModel :TaxModel;

   taxDetailsFormGroup=this._formBuilder.group({
    minValuectrl: ['', Validators.required],
    maxValueCtrl:['', Validators.required]
   });


   finalizeBtnText: String = "Add";

  

   constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private taxservice: TaxService,
    private cookieService: AuthService
    
    
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
        }
      }
    },(error: any) => {
      this._snackBar.open("Failed to create the taxiteam.", "Dismiss", {duration: 5 * 1000});
    })
}

 

}