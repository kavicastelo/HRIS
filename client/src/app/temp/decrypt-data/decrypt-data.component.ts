import { Component } from '@angular/core';
import {EncryptionService} from "../../services/encryption.service";

@Component({
  selector: 'app-decrypt-data',
  templateUrl: './decrypt-data.component.html',
  styleUrls: ['./decrypt-data.component.scss']
})
export class DecryptDataComponent {

  value:any;
  changedValue:any;

  constructor(private encryptionService: EncryptionService) {
  }

  decrypt() {
    if (this.value) {
      this.changedValue = this.encryptionService.decryptPassword(this.value);
    }
  }

  encrypt() {
    if (this.value) {
      this.changedValue = this.encryptionService.encryptPassword(this.value);
    }
  }

  clear() {
    this.value = null;
    this.changedValue = null;
  }
}
