import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as lod from 'lodash';
import { Http } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  //baseurl= "http://localhost:8080/materialinmotion/cmms/";
  baseurl= 'http://192.168.0.43:8080/materialinmotion/cmms/'
  constructor(private http: Http) { }

  convertFile(excelFile) {
    let rowData;
    let promise = new Promise((resolve, reject) => {
      let ref = this;
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(excelFile);

      fileReader.onload = function (event) {
        let data = event.target.result;
        let workbook = XLSX.read(data, {
          type: "binary",
          //cellDates: true,
          //cellText: true
        });

        // workbook.SheetNames.forEach(sheet => {
        //   rowData = <any>XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
        //     raw: false,
        //     defval: ""
        //   }).map(row => lod.mapKeys(row, (value, key) => key.trim().replace(/ /g, '_')));
        // })


        rowData = <any>XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
          raw: false,
          defval: ""
        }).map(row => lod.mapKeys(row, (value, key) => key.trim().replace(/ /g, '_')));
        rowData = lod.filter(rowData, item => item.Date !== "");
      }
      fileReader.onloadend = function (event) {
        resolve(rowData)
      }
    });
    return promise;
  }

  saveWorkorderLoad(workorderLoad){
    return this.http.post(this.baseurl+"workorderload",workorderLoad)
  }

}
