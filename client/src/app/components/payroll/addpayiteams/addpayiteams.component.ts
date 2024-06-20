import { Component, OnInit } from '@angular/core';
import { employeeDataStore } from "../../../shared/data-stores/employee-data-store";
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { MatFormFieldControl } from "@angular/material/form-field";
import { Validators, FormBuilder } from '@angular/forms';
import { PayItemModel } from 'src/app/shared/data-models/payitem.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PayitemService } from 'src/app/services/payitem.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  title: String = "New Pay Item";
  finalizeBtnText: String = "Add";
  action: String = "ADD";

  notfoundError = false;
  
  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private payitemService: PayitemService,
    private cookieService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ){
    
    this.payitemModel = new PayItemModel();

    // if(data.action == "EDIT_PAY_ITEM"){
    //   this.finalizeBtnText = "Update";
    // }
  }

  ngOnInit(): void {
      if(this.route.snapshot.params['payitemId']){
        this.title = "Edit Pay Item";
        this.finalizeBtnText = "Save changes";
        this.action = "EDIT";

        this.payitemService.getPayItemById(this.route.snapshot.params['payitemId']).subscribe((res:any) => {
          this.payitemModel = res;
        },(error: any) => {
          this.notfoundError = true;
        });
      }
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
          this.router.navigate(['payroll', 'payitems']);
        }
      }
    },(error: any) => {
      this._snackBar.open("Failed to create the payitem.", "Dismiss", {duration: 5 * 1000});
    })
  }

  editExistingPayitem(){
    this._snackBar.open("Updating the payitem...", "Dismiss", {duration: 5 * 1000});

    this.payitemService.updatePayitemById(this.payitemModel).subscribe((res: any) => {
      if(res){
        if(res.errorCode == "INVALID_INFOMARTION"){
          this._snackBar.open(res.message, "Ok");
        }else{
          this._snackBar.open(res.message, "Dismiss", {duration: 5 * 1000});
          this.router.navigate(['payroll', 'payitems']);
        }
      }
    },(error: any) => {
      this._snackBar.open("Failed to update the payitem details.", "Ok");
    })
  }

  goBack(){
    this.router.navigate(['payroll', 'payitems']);
  }
}
