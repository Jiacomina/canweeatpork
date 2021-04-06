import { Component } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Observable } from "rxjs";

import { Transaction } from "./models/transaction.model";
import { FirebaseService } from "./services/firebase.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  firebaseService: FirebaseService;
  users: Observable<any>;
  showFileUpload = false;
  username: string = "";

  constructor(firebaseService: FirebaseService, db: AngularFireDatabase) {
    this.firebaseService = firebaseService;
    this.users = db.object("transactions").valueChanges();
  }
  fileToUpload: File = null;
  csvHeaders: string[] = [];
  transactions: Transaction[] = [];
  headerMap = new HeaderMap();

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    const reader = new FileReader();
    this.firebaseService.updateUploads(this.username);
    reader.onload = () => {
      let text = reader.result;
      text
        .toString()
        .split("\n")
        .forEach((line, index) => {
          if (!line) {
            console.log(`[INFO]: Line ${index} is empty, "${line}"`);
          } else if (index === 0) {
            this.parseHeaders(line);
          } else {
            this.parseTransaction(line);
          }
        });
      console.log(this.transactions);
      let result = this.firebaseService.updateDatabase(this.transactions);
      console.log(result);
    };
    reader.readAsText(files.item(0));
  }

  parseHeaders(line: string) {
    line.split(",").forEach((val, index) => {
      switch (val) {
        case "Transaction Date": {
          this.headerMap.date = index;
          break;
        }
        case "Debit": {
          this.headerMap.debit = index;
          break;
        }
        case "Credit": {
          this.headerMap.credit = index;
          break;
        }
        case "Narration": {
          this.headerMap.narration = index;
          break;
        }
      }
    });
  }

  parseTransaction(line: string) {
    const newTrans = new Transaction();
    let array = line.split(",");

    newTrans.date = array[this.headerMap.date];
    newTrans.narration = this.cleanNarration(array[this.headerMap.narration]);
    newTrans.debit = Number(array[this.headerMap.debit]);
    newTrans.credit = Number(array[this.headerMap.credit]);
    newTrans.username = this.username;

    this.transactions.push(newTrans);
  }

  cleanNarration(nar?: string) {
    const re = /AUTHORISATION ONLY|PAYPAL|-|\*/gi;
    return nar.replace(re, "");
  }

  submitName() {
    if (this.username) {
      this.firebaseService.updateUser(this.username);
      this.showFileUpload = true;
    } else {
      console.log("No name given");
    }
  }

  getUsers() {
    // this.firebaseService.users.subscribe(val => {
    //   console.log(val);
    // });
    return this.firebaseService.users;
  }
}

export class HeaderMap {
  date: number;
  narration: number;
  debit: number;
  credit: number;
}
