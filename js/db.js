import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc, // 追加：フィールド更新用
  doc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// データ送信
export const addRecord = async (colName, data) => {
  await addDoc(collection(db, colName), data);
};

// データ取得（全件） ユーザ毎に変更
export const getRecords = async (colName, uid) => {
  const q = query(collection(db, colName), where("uid", "==", uid));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// データを削除（１行ずつ） コレクション名は任意指定（既定はrecords）
export const deleteRecord = async (id, colName = "records") => {
  await deleteDoc(doc(db, colName, id));
};

// データ更新（指定フィールドのみ） コレクション名は任意指定（既定はrecords）
export const updateRecord = async (id, data, colName = "records") => {
  await updateDoc(doc(db, colName, id), data);
};
