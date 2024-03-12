import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-post-image',
  templateUrl: './post-image.component.html',
  styleUrls: ['./post-image.component.scss']
})
export class PostImageComponent implements OnInit {

  multimediaForm = new FormGroup({
    userId: new FormControl(null,[
      Validators.required
    ]),
    channelId: new FormControl(null,[
      Validators.required
    ]),
    photo: new FormControl(null,[
      Validators.required
    ]),
    title: new FormControl(null,[
      Validators.required
    ]),
    timestamp: new FormControl(null,[
      Validators.required
    ]),
    contentType: new FormControl(null,[
      Validators.required
    ])
  })

  constructor() {
  }

  ngOnInit(): void {
  }

  onSubmit() {
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    // this.employeeForm.patchValue({ photo: file });
  }
}
