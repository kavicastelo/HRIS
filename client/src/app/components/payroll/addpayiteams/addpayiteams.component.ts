import { Component, OnInit } from '@angular/core';
import { employeeDataStore } from "../../../shared/data-stores/employee-data-store";
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { MatFormFieldControl } from "@angular/material/form-field";
import { Validators, FormBuilder } from '@angular/forms';
import { PayItemModel } from 'src/app/shared/data-models/payitem.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PayitemService } from 'src/app/services/payitem.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  
  selector: 'app-addpayiteams',
  templateUrl: './addpayiteams.component.html',
  styleUrls: ['./addpayiteams.component.scss']
})
export class AddpayiteamsComponent implements OnInit {

  employees: EmployeeModel[]=[];

  payitemModel: PayItemModel;
  
  payitemDetailsFormGroup = this._formBuilder.group({
    itemNameCtrl: ['', Validators.required],
    descriptionCtrl: [''],
    itemTypeCtrl: ['', Validators.required],
    paymentTypeCtrl: ['', Validators.required],
    statusCtrl: ['', Validators.required]
  });

  finalizeBtnText: String = "Add";
  
  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private payitemService: PayitemService,
    private cookieService: AuthService
  ){
    
    this.payitemModel = new PayItemModel();

    // if(data.action == "EDIT_PAY_ITEM"){
    //   this.finalizeBtnText = "Update";
    // }
  }

  ngOnInit(): void {
    
  }

  addNewPayitem(){
        this._snackBar.open("Creating the payitem...", "Dismiss", {duration: 5 * 1000});
        this.payitemModel.organizationId = this.cookieService.organization();
        this.payitemService.savePayitem(this.payitemModel).subscribe((res: any) => {
          if(res){
            if(res.errorCode == "DUPLICATED_INFOMARTION"){
              this._snackBar.open(res.message, "Ok");
            }else{
              this._snackBar.open(res.message, "Dismiss", {duration: 5 * 1000});
            }
          }
        },(error: any) => {
          this._snackBar.open("Failed to create the payitem.", "Dismiss", {duration: 5 * 1000});
        })
  }
}
