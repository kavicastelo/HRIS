import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators,FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaxModel } from '../../shared/data-models/tax.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from 'src/app/services/organization.service';
import { TaxService } from 'src/app/services/tax.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-taxdetails',
  templateUrl: './taxdetails.component.html',
  styleUrls: ['./taxdetails.component.scss']
})
export class TaxdetailsComponent {
  taxInfoTableColumns: String[] = ['from', 'min', 'to', 'max', 'equal', 'rate', 'Actions'];
  taxInfoTableDataSource = new MatTableDataSource<TaxModel>([]);

  taxInfoList: TaxModel[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private taxService: TaxService,
    private organizationService: OrganizationService,
    private cookieService: AuthService
  ){}

  ngOnInit(): void {
    this.updateTaxInfoList();
  }

  async updateTaxInfoList(): Promise<void>{
    return new Promise(resolve => {
      this.taxService.getAllTaxRates(this.cookieService.organization()).subscribe((res:any) =>{
        if(res){
            this.taxInfoList = res;
            this.taxInfoTableDataSource.data = this.taxInfoList;
        }
        resolve();
      },(error: any) => {})
    })
  }

  deleteTaxInfo(id: any) {
    if (id){
      if (confirm('Are you sure you want to delete this tax detail?')){
          this._snackBar.open("Deleting a tax detail...", "Dismiss", {duration: 5 * 1000});
          this.taxService.deleteTaxInfo(id).subscribe((res: any) => {
            if(res){
              this._snackBar.open(res.message, "Dismiss", {duration: 5 * 1000});
              this.updateTaxInfoList();
            }
          },(error: any) => {
            this._snackBar.open("Failed to delete the selected tax detail.", "Dismiss", {duration: 5 * 1000});
          })
      }
    }
  }
}
