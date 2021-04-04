import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Observable } from "rxjs";
import { Transaction } from "../models/transaction.model";

@Injectable()
export class FirebaseService {
  users: Observable<any>;
  db: AngularFireDatabase;
  userName: string;

  constructor(db: AngularFireDatabase) {
    this.db = db;
    this.users = db.object("users").valueChanges();
  }

  getUserCount() {
    return this.users.subscribe(val => {
      return val.length;
    });
  }

  updateUser(name: string) {
    console.log("updating user");
    this.userName = name;
    this.db.list("users").push({ name: name });
    // const itemRef = this.db.object("users");
    // itemRef
    //   .update({ name: name })
    //   .catch(error => {
    //     console.log("Firebase error: ", error.message);
    //   })
    //   .then(result => {
    //     return result;
    //   });
  }

  updateDatabase(transactions: Transaction[]) {
    console.log(this.getUserCount());
    const itemRef = this.db.object("transactions");
    itemRef
      .set(transactions)
      .catch(error => {
        console.log("Firebase error: ", error.message);
      })
      .then(result => {
        return result;
      });
  }
}
