import {Component, Inject} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-job-post-view',
  templateUrl: './job-post-view.component.html',
  styleUrls: ['./job-post-view.component.scss']
})
export class JobPostViewComponent {

  receivedData: any
  educational_requirements: string[] = [];
  technical_requirements: string[] = [];
  responsibilities: any;

  constructor(
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<JobPostViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.receivedData = this.data;

    const technicalReqs = this.receivedData?.data?.technical_requirements || '';
    this.technical_requirements = technicalReqs.includes('\n') ? technicalReqs.split('\n') : [technicalReqs];

    const educationalReqs = this.receivedData?.data?.education_requirements || '';
    this.educational_requirements = educationalReqs.includes('\n') ? educationalReqs.split('\n') : [educationalReqs];

    const responsibilities = this.receivedData?.data?.responsibilities || '';
    this.responsibilities = responsibilities.includes('\n') ? responsibilities.split('\n') : [responsibilities];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
