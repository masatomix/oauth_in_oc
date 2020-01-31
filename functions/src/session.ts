import * as admin from 'firebase-admin'


const me = {
  setAttributeById(sessionId: string, key: string, value: string) {

    // トランザクション処理。
    const ref = admin.firestore().collection('session').doc(sessionId)

    admin.firestore().runTransaction(async transaction => {
      console.log('sessionId:', sessionId)

      const now = admin.firestore.FieldValue.serverTimestamp()
      const docref = await transaction.get(ref)

      const tmp = new Object()
      tmp[key] = value
      const target = Object.assign(tmp, {
        updatedAt: now,
      })

      if (!docref.exists) {
        console.log(sessionId + ' は存在しないので、新規作成')
        transaction.set(ref, Object.assign(target, {
          createdAt: now,
        }))
      } else {
        console.log(sessionId + ' が存在したので、更新')
        transaction.update(ref, target)
      }

    })
    // トランザクション処理する前の原型はこちら。
    // console.log('sessionId:', sessionId)

    // const now = admin.firestore.FieldValue.serverTimestamp()
    // const ref = admin.firestore().collection('session').doc(sessionId)
    // const docref = await ref.get()

    // const tmp = new Object()
    // tmp[key] = value
    // const target = Object.assign(tmp, {
    //   updatedAt: now,
    // })

    // if (!docref.exists) {
    //   console.log(sessionId + ' は存在しないので、新規作成')
    //   ref.set(Object.assign(target, {
    //     createdAt: now,
    //   }))
    // } else {
    //   console.log(sessionId + ' が存在したので、更新')
    //   ref.update(target)
    // }
  },

  // setAttributeObjById(sessionId: string, obj: any) {
  //   console.log('sessionId:', sessionId)

  //   const now = admin.firestore.FieldValue.serverTimestamp()
  //   const ref = admin.firestore().collection('session').doc(sessionId)

  //   const target = Object.assign(obj, {
  //     updatedAt: now,
  //     createdAt: now,
  //   })
  //   ref.set(target)
  // },

  async getAttributeById(sessionId: string, key: string) {
    const docref = await admin
      .firestore().collection('session').doc(sessionId).get()

    // const docref = await ref.get()
    let returnValue: any = {}
    if (!docref.exists) {
      return
    } else {
      returnValue = docref.data()
    }
    return returnValue[key]
  },

  async invalidate(sessionId: string) {
    await admin.firestore().collection('session').doc(sessionId).delete()
  }

}

export default me

if (!module.parent) {
  // me.rail_check()
}
