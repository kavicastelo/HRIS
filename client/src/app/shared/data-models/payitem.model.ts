import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PayItemModel {
    id: String = "";
    organizationId: String = "";
    itemName: String = "";
    description: String = "";
    itemType: String = "";
    paymentType: String = "";
    status: String = "";
}