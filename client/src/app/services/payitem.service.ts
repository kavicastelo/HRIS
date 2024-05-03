import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PayItemModel } from '../shared/data-models/payitem.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PayitemService {

  baseUrl = environment.baseUrl;
  
  constructor(private http : HttpClient) { }

  savePayitem(payItemModel: PayItemModel){
    return this.http.post(this.baseUrl + "payitem/save", payItemModel);
  }

  getAllPayitems(organizationId: any){
    return this.http.get(this.baseUrl + "payitem/get/all/organizationId/" + organizationId);
  }

  getPayItemById(id: String){
    return this.http.get(this.baseUrl + "payitem/get/id/" + id);
  }

  updatePayitemById(payItemModel: PayItemModel){
    return this.http.put(this.baseUrl + "payitem/update/id/" + payItemModel.id, payItemModel);
  }

  deletePayitemById(id: String){
    return this.http.delete(this.baseUrl + "payitem/delete/id/" + id);
  }
}
