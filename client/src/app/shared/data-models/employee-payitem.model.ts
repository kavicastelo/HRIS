import { Injectable } from "@angular/core";
import { PayItemModel } from "./payitem.model";

@Injectable({
    providedIn: 'root'
})
export class EmployeePayItemModel{
    id: String = "";
    payItemId: String = "";
    payitem: PayItemModel = new PayItemModel();
    email: String = "";
    type: String = "";
    value: number = 0.0;
    amount: number = 0.0;
}