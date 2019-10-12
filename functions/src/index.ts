import * as functions from 'firebase-functions'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

import * as admin from 'firebase-admin'

admin.initializeApp()

import * as corsLib from 'cors'
const cors = corsLib()

export const echo_req = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    execute()
    res.send('Hello from Firebase!')
  })
})

export const echo_onCall = functions.https.onCall((data, context) => {
  execute()
  return data
})

const execute = function() {
  const now = admin.firestore.Timestamp.now()
  const db = admin.firestore()

  // キー指定しないで、Insert
  const promise1 = db.collection('users').add({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815,
    createdAt: now,
    updatedAt: now,
  })
  promise1
    .then(function(docRef1) {
      console.log('Document written with ID: ', docRef1.id)
    })
    .catch(function(error) {
      console.error('Error adding document: ', error)
    })
  // add(data: DocumentData): Promise<DocumentReference>;

  // キー指定して、Insert (存在したらupdate)
  const docRef = db.collection('users').doc('alovelace')
  docRef
    .set({
      first: 'Ada',
      last: 'Lovelace',
      born: 1815,
      createdAt: now,
      updatedAt: now,
    })
    .catch(error => console.log(error))
  // doc(documentPath?: string): DocumentReference;
  // set(data: DocumentData, options?: SetOptions): Promise<WriteResult>;

  const promise = db.collection('users').get()
  //   get(): Promise<QuerySnapshot>;    collectionのget はこちら
  //   get(): Promise<DocumentSnapshot>; docのget はこちら
  // collection(collectionPath: string): CollectionReference;
  // doc(documentPath?: string): DocumentReference;

  // 原則
  //   collection で返ってくるのは Reference
  //   collection.get で返ってくるのは Promise
  //   doc で返ってくるのは Reference
  //   doc.get で返ってくるのは Promise

  promise
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data())
      })
    })
    .catch(error => console.log(error))

  db.collection('users')
    .where('first', '==', 'Ada')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data())
      })
    })
    .catch(error => console.log(error))

  db.collection('users')
    .doc('alovelace')
    .get()
    .then(docref => console.log(docref.data()))
    .catch(error => console.log(error))
}
