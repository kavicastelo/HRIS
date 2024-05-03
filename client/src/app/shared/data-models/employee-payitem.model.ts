import { PayItemModel } from "./payitem.model";

export interface EmployeePayItemModel{
    id: String;
    payItemId: String;
    payitem: PayItemModel;
    email: String;
    type: String;
    value: number;
    amount: number;
}