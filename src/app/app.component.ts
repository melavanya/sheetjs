import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileValidator } from 'ngx-material-file-input';
import { AppService } from './app.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  formGroup: FormGroup;
  excelFile;

  readonly maxSize = 104857600;
  showForm: boolean = true;
  showSpinner: boolean = false;

  constructor(private _formBuilder: FormBuilder, private appService: AppService, public dialog: MatDialog) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      requiredFile: [
        undefined,
        [FileValidator.maxContentSize(this.maxSize)]
      ]
    });
  }
  selectedFile() {
    if (this.formGroup.controls.requiredFile.value) {
      this.showSpinner = true;
      this.showForm = false;
      this.excelFile = this.formGroup.controls.requiredFile.value._files[0];
      this.appService.convertFile(this.excelFile).then((res: any) => {
        this.appService.saveWorkorderLoad(res).subscribe(res => {
          this.showSpinner = false;
          this.openDialog(res.json().Message);
        });
      });
    } else {
      this.formGroup.controls.requiredFile.setErrors({ required: true })
    }
  }
  openDialog(message): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '250px',
      data: message
    });

    dialogRef.afterClosed().subscribe(result => {
      this.formGroup.reset();
      this.showForm = true;
    });
  }
}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation.html',
})
export class ConfirmationDialog {
  message: string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data == "Success") {
      this.message = "Excel sheet imported Successfully."
    } else if (data == 'Failed') {
      this.message = "Error occured.Please try again later."
    } else {
      this.message = data;
    }
    }
}
