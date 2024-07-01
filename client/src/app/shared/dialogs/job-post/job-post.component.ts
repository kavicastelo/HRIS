import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RecruitmentService} from "../../../services/recruitment.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-job-post',
  templateUrl: './job-post.component.html',
  styleUrls: ['./job-post.component.scss']
})
export class JobPostComponent implements OnInit{

  receivedData: any

  jobForm = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    about: new FormControl(null, [Validators.required]),
    technical: new FormControl(null, [Validators.required]),
    educational: new FormControl(null, [Validators.required]),
    responsibilities: new FormControl(null, [Validators.required]),
    closingDate: new FormControl(null, [Validators.required]),
    experience: new FormControl(null, [Validators.required]),
    contactEmail: new FormControl(null, [Validators.required, Validators.email]),
    description: new FormControl(null, [Validators.required]),
  })

  constructor(
    public recruitmentService: RecruitmentService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<JobPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.receivedData = this.data
    console.log(this.receivedData.data.data.id)
    if (this.receivedData.data.id) {
      this.patchValues()
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  postJob() {
    if (this.jobForm.valid) {
      this.recruitmentService.saveJobPost({
        organizationId: this.receivedData.data.organizationId,
        caption: this.jobForm.value.title,
        about_job: this.jobForm.value.about,
        technical_requirements: this.jobForm.value.technical,
        education_requirements: this.jobForm.value.educational,
        responsibilities: this.jobForm.value.responsibilities,
        experience_level: this.jobForm.value.experience,
        open_date: new Date(),
        end_date: this.jobForm.value.closingDate,
        contact_email: this.jobForm.value.contactEmail,
        description: this.jobForm.value.description
      }).subscribe(data =>{
        this.onNoClick();
        this.snackBar.open("Job Post Created", "OK", {
          duration: 3000
        })
      }, error => {
        this.snackBar.open(error.error.message, "OK", {
          duration: 3000
        })
      })
    }
  }

  patchValues() {
    this.jobForm.get('title')?.setValue(this.receivedData.data.data.caption);
    this.jobForm.get('about')?.setValue(this.receivedData.data.data.about_job);
    this.jobForm.get('technical')?.setValue(this.receivedData.data.data.technical_requirements);
    this.jobForm.get('educational')?.setValue(this.receivedData.data.data.education_requirements);
    this.jobForm.get('responsibilities')?.setValue(this.receivedData.data.data.responsibilities);
    this.jobForm.get('closingDate')?.setValue(this.receivedData.data.data.end_date);
    this.jobForm.get('experience')?.setValue(this.receivedData.data.data.experience_level);
    this.jobForm.get('contactEmail')?.setValue(this.receivedData.data.data.contact_email);
    this.jobForm.get('description')?.setValue(this.receivedData.data.data.description);
  }

  updateJob() {
    if (this.jobForm.valid) {
      this.recruitmentService.updateJobPost(this.receivedData.data.data.id, {
        organizationId: this.receivedData.data.data.organizationId,
        caption: this.jobForm.value.title,
        about_job: this.jobForm.value.about,
        technical_requirements: this.jobForm.value.technical,
        education_requirements: this.jobForm.value.educational,
        responsibilities: this.jobForm.value.responsibilities,
        experience_level: this.jobForm.value.experience,
        open_date: this.receivedData.data.data.open_date?this.receivedData.data.data.open_date:new Date(),
        end_date: this.jobForm.value.closingDate,
        contact_email: this.jobForm.value.contactEmail,
        description: this.jobForm.value.description
      }).subscribe(data =>{
        this.onNoClick();
        this.snackBar.open("Job Post Updated", "OK", {
          duration: 3000
        })
      }, error => {
        this.snackBar.open(error.error.message, "OK", {
          duration: 3000
        })
      })
    }
  }
}
