import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { PayitemService } from 'src/app/services/payitem.service';
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { PayItemModel } from 'src/app/shared/data-models/payitem.model';
import { employeeDataStore } from 'src/app/shared/data-stores/employee-data-store';

@Component({
  selector: 'app-payitems',
  templateUrl: './payitems.component.html',
  styleUrls: ['./payitems.component.scss']
})
export class PayitemsComponent {

  employees: EmployeeModel[]=[];
  payitemsList: PayItemModel[] = [];
  
  constructor(private payitemService: PayitemService,
    private cookieService: AuthService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
      this.updatePayitemsList();
  }
  
  async updatePayitemsList(): Promise<void>{
    return new Promise(resolve => {
      this.payitemService.getAllPayitems(this.cookieService.organization()).subscribe((res:any) =>{
        if(res){
            this.payitemsList = res;
            for(let payitem of this.payitemsList){
                if(payitem.description == ""){
                  payitem.description = "N/A";
                }
            }
            this.payitemsList = this.payitemsList;
        }
        resolve();
      },(error: any) => {})
    })
  }

  deletePayItem(id: any) {
    if (id){
      if (confirm('Are you sure you want to delete this pay item?')){
        this.payitemService.deletePayitemById(id).subscribe(data => {
          this._snackBar.open("Deleting the payitem...", "Dismiss", {duration: 5 * 1000});
            this.payitemService.deletePayitemById(id).subscribe((res: any) => {
              if(res){
                this._snackBar.open(res.message, "Dismiss", {duration: 5 * 1000});
                this.updatePayitemsList();
              }
            },(error: any) => {
              this._snackBar.open("Failed to delete the payitem.", "Dismiss", {duration: 5 * 1000});
            })
        }, error => {
          console.log(error)
        })
      }
    }
  }

}
