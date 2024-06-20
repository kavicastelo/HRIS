import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'

})
export class TaxModel{

    id: String = "";
    organizationId: String = "";
    min: number = 0.0;
    max: number = 0.0;
    rate: number = 0.0;

}