import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TransferRequestService} from "../../../services/transfer-request.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EmptyDialogComponent} from "../empty-dialog/empty-dialog.component";
import {SafeResourceUrl} from "@angular/platform-browser";
import {MultimediaService} from "../../../services/multimedia.service";

@Component({
  selector: 'app-letter-data-dialog',
  templateUrl: './letter-data-dialog.component.html',
  styleUrls: ['./letter-data-dialog.component.scss']
})
export class LetterDataDialogComponent {

  receivedData:any;

  constructor(private multimediaService: MultimediaService, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<LetterDataDialogComponent>) {
  }
  ngOnInit(): void {
    this.receivedData = this.data
  }

  convertToSafeUrl(url:any):SafeResourceUrl{
    return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
  }

  closePopup() {
    this.ref.close('Closed using function');
  }
}
