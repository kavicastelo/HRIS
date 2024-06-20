import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaxModel } from '../shared/data-models/tax.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

  baseUrl = environment.baseUrl;
  
  constructor(private http : HttpClient) { }

  saveTaxInfo(taxModel: TaxModel){
    return this.http.post(this.baseUrl + "tax/save", taxModel);
  }

  getAllTaxRates(organizationId: any){
    return this.http.get(this.baseUrl + "tax/get/all/organizationId/" + organizationId);
  }

  updateTaxInfo(taxModel: TaxModel){
    return this.http.put(this.baseUrl + "tax/update/id/" + taxModel.id, taxModel);
  }

  deleteTaxInfo(id: String){
    return this.http.delete(this.baseUrl + "tax/delete/id/" + id);
  }
}
