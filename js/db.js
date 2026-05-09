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

// データを削除（１行ずつ）
export const deleteRecord = async (id) => {
  await deleteDoc(doc(db, "records", id));
};

// データ更新（指定フィールドのみ）
export const updateRecord = async (id, data) => {
  await updateDoc(doc(db, "records", id), data);
};
