import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import * as firebase from "firebase";
import { Observable } from "rxjs";
import { map, filter } from "rxjs/operators";
import { element } from "@angular/core/src/render3";
@Injectable({
  providedIn: "root"
})
export class DataproviderService {
  noticeCollection: AngularFirestoreCollection<any>;
  notices: Observable<any>;
  fcmToken;

  constructor(private afs: AngularFirestore) {
    this.afs.firestore.enablePersistence().catch(err => {
      // console.log(err);
    });
  }

  getCurrentUserData(uid) {
    return this.afs
      .collection("users", ref => {
        return ref.where("uId", "==", uid);
      })
      .valueChanges();
  }

  getNotices() {
    return this.afs
      .collection("notices", ref => {
        return ref.orderBy("ts", "desc");
      })
      .valueChanges();
  }

  getNoticeByData(noticeId) {
    return this.afs
      .collection("notices", ref => {
        return ref.where("noticeId", "==", noticeId);
      })
      .valueChanges();
  }
  deletePDF(noticeId, url) {
    firebase
      .storage()
      .refFromURL(url)
      .delete()
      .then(() => {
        this.afs
          .collection("notices")
          .doc(noticeId)
          .delete();
      });
  }
  deleteNotice(noticeId, urls: Array<string>) {
    // console.log(noticeId, urls);
    let a = 0;
    if (urls === null) {
      this.afs
        .collection("notices")
        .doc(noticeId)
        .delete()
        .then(() => (a = 1));
    } else {
      urls.forEach(element => {
        // console.log(element);
        firebase
          .storage()
          .refFromURL(element)
          .delete()
          .then(() => {
            console.log("deleted file");
            this.afs
              .collection("notices")
              .doc(noticeId)
              .delete()
              .then(() => (a = 1));
          })
          .catch(e => console.log(e));
        if (a) {
          return true;
        }
      });
    }
  }
  addNotice(
    title,
    body,
    batches,
    category,
    urls: Array<string>,
    type: string,
    author,
    link
  ) {
    let notice = {
      title,
      body,
      batches,
      urls,
      author,
      category,
      ts: Date.now(),
      type,
      link: link
    };
    let localNoticeId;
    this.afs
      .collection("notices")
      .add(notice)
      .then(ref => {
        localNoticeId = ref.id;
      })
      .then(() => {
        this.afs
          .collection("notices")
          .doc(localNoticeId)
          .update({ noticeId: localNoticeId });
      })
      .catch(err => {
        console.log(err);
      });
  }

  setToken(t) {
    this.fcmToken = t;
  }

  getToken() {
    return this.fcmToken;
  }

  addUser(newUser) {
    let localDocId;
    return this.afs
      .collection("users")
      .add(newUser)
      .then(ref => {
        // console.log(ref.id);
        localDocId = ref.id;
      })
      .then(() => {
        this.afs
          .collection("users")
          .doc(localDocId)
          .update({ docId: localDocId })
          .then(() => {
            // console.log(localDocId);
            return localDocId;
          });
      })
      .catch(err => {
        console.log(err);
        return localDocId;
      });
  }

  updateUser(newuserData, passDocId) {
    return this.afs
      .collection("users")
      .doc(passDocId)
      .update(newuserData)
      .then(() => {
        return true;
      })
      .catch(err => {
        console.log(err);
        return false;
      });
  }

  getUserObservable(uid: string) {
    return this.afs
      .collection("users", ref => {
        return ref.where("uid", "==", uid);
      })
      .valueChanges();
  }

  getCategoryNotices(name) {
    return this.afs
      .collection("notices", ref => {
        return ref.where("category", "==", name).orderBy("ts", "desc");
      })
      .valueChanges();
  }

  getIsAllowAdmin(email: string) {
    return this.afs
      .collection("allowAdmins", ref => {
        return ref.where("email", "==", email);
      })
      .valueChanges();
  }

  getIsAllowStudents(email: string) {
    return this.afs
      .collection("allowStudents", ref => {
        return ref.where("email", "==", email);
      })
      .valueChanges();
  }

  async deleteCurrentUserData(docId: string) {
    await this.afs
      .collection("users")
      .doc(docId)
      .delete()
      .catch(err => {});
  }

  async updateNotice(newData, noticeId: string) {
    await this.afs
      .collection("notices")
      .doc(noticeId)
      .update(newData)
      .catch(err => {});
  }

  getGodsEyeObject(name: string) {
    return this.afs
      .collection(`god's-eye`, ref => {
        return ref.where("name", "==", name);
      })
      .valueChanges();
  }
}
