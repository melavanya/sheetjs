import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { FileValidator } from 'ngx-material-file-input';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as lod from 'lodash';
import { AppService } from './app.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  formGroup: FormGroup;
  excelFile;
  tableData =[];
  readonly maxSize = 104857600;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = ['CW2',
    'Calendar_Week',
  'Date',
  'Decription_of_Resolution',
  'Description_of_Error',
 ' Error_Code_and_Message_Displayed',
  'Error_on_HMI',
  'NOTE',
  'PentaMaster_Root_Cause_Analysis',
 ' Responder',
  'Shift',
  'Source_of_Downtime',
  'Station',
  'Time_Resolved',
  'Time_of_Issue',
  'Total_DT',
  'Vision_Related'];
  dataSource = new MatTableDataSource<any>();

  constructor(private _formBuilder: FormBuilder, private appService: AppService) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      requiredFile: [
        undefined,
        [Validators.required, FileValidator.maxContentSize(this.maxSize)]
      ]
    });

  }
  selectedFile() {
    this.excelFile = this.formGroup.controls.requiredFile.value._files[0];
    if (this.excelFile) {
      this.appService.convertFile(this.excelFile).then((res: any) => {
        this.tableData = res;
        this.dataSource.data = this.tableData;
        this.dataSource.paginator = this.paginator;
      });
    }

  }

}
export interface fileData {
  CW2: string;
  Calendar_Week: string;
  Date: string;
  Decription_of_Resolution: string;
  Description_of_Error: string;
  Error_Code_and_Message_Displayed: string;
  Error_on_HMI: string;
  NOTE: string;
  PentaMaster_Root_Cause_Analysis: string;
  Responder: string;
  Shift: string;
  Source_of_Downtime: string;
  Station: string;
  Time_Resolved: string;
  Time_of_Issue: string;
  Total_DT: string;
  Vision_Related: string;
  }
