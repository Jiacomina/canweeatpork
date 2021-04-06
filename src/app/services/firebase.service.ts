import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Observable } from "rxjs";
import { Transaction } from "../models/transaction.model";
import { upload } from "../models/upload.model";

@Injectable()
export class FirebaseService {
  users: Observable<any>;
  db: AngularFireDatabase;
  userName: string;

  USERPATH = "users";
  TRANSACTIONPATH = "transactions";
  UPLOADSPATH = "uploads";

  constructor(db: AngularFireDatabase) {
    this.db = db;
    this.users = db.object(this.USERPATH).valueChanges();
  }

  getUserCount() {
    return this.users.subscribe((val) => {
      return val.length;
    });
  }

  updateUser(name: string) {
    console.log("updating user");
    this.userName = name;
    this.db.list(this.USERPATH).push({ name: name });
  }

  updateUploads(username: string) {
    console.log("updating upload");
    var newUpload = new upload();
    newUpload.date = new Date();

    this.db
      .list(this.UPLOADSPATH)
      .push(newUpload)
      .then((result) => {
        console.log("Upload Key", result.key);
      });
  }

  updateDatabase(transactions: Transaction[]) {
    console.log(this.getUserCount());
    const itemRef = this.db.object(this.TRANSACTIONPATH);
    itemRef
      .set(transactions)
      .catch((error) => {
        console.log("Firebase error: ", error.message);
      })
      .then((result) => {
        return result;
      });
  }
}
