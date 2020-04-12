const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp()
exports.subscribeToTopic = functions.https.onCall(
    async (data, context) => {
      await admin.messaging().subscribeToTopic(data.token, data.topic);
  
      return `subscribed to ${data.topic}`;
    }
  );
exports.instantpush = functions.https.onCall(
    async (data, context) => {
      console.log(data)
      const notification = {
        title: data.title,
        body: data.body
      };
      const payload= {
        notification,
        webpush: {
          notification: {
            vibrate: [200, 100, 200]
          }
        },
        topic: 'All'
      };

    return admin.messaging().send(payload).then(res=>console.log(res));
    }
  );
  exports.unsubscribeFromTopic = functions.https.onCall(
    async (data, context) => {
      await admin.messaging().unsubscribeFromTopic(data.token, data.topic);
  
      return `unsubscribed from ${data.topic}`;
    }
  );

  exports.sendOnFirestoreCreate = functions.firestore
  .document('notices/{noticeId}')
  .onCreate(async (snapshot,context) => {
    this.flag=0
    const notice = snapshot.data()
    const noticeId = snapshot.ref.parent.key
    console.log(snapshot.data(), snapshot.ref.parent.key)

    const notification = {
      title: notice.title,
      body: notice.body+`\n\n-${notice.author}`
    };

    notice.batches.forEach(element => {
      const payload= {
          notification,
          webpush: {
            notification: {
              vibrate: [200, 100, 200]
            }
          },
          topic: element
        };
  
      admin.messaging().send(payload).then(res=>console.log(res));
      
    });
  });

  exports.updateNotice = functions.firestore
    .document('notices/{noticeId}')
    .onUpdate((change, context) => {
      if(change.after.data().update_ts){
        const newValue = change.after.data();
        const notification={
          title:`Change in Notice`,
          body:`A change has been made in the Notice : ${newValue.title} \nAll are requested to check the following notice to avoid any further confusions\n-${newValue.author}`
        }
            newValue.batches.forEach(element => {
              const payload= {
                  notification,
                  webpush: {
                    notification: {
                      vibrate: [200, 100, 200]
                    }
                  },
                  topic: element
                };
          
              admin.messaging().send(payload).then(res=>console.log(res));
              
            });

      }
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
    });