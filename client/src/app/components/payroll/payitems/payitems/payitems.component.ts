import { Component } from '@angular/core';
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
    private cookieService: AuthService
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

}
