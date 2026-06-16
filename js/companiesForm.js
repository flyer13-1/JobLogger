import { addRecord } from "./db.js";
import { auth } from "./firebase.js";

// 就活の軸の登録フォーム
export const initAxisForm = (onSubmit) => {
  document.getElementById("axisForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const input = document.getElementById("axisInput");
    const text = input.value.trim();
    if (!text) {
      alert("就活の軸を入力してください。");
      input.focus();
      return;
    }

    await addRecord("axes", {
      uid: auth.currentUser.uid,
      text,
      createdAt: Date.now(),
    });

    await onSubmit();
    e.target.reset();
  });
};

// 気になる企業の登録フォーム
export const initCompanyForm = (onSubmit) => {
  document
    .getElementById("companyForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("companyName").value.trim();
      const url = document.getElementById("companyUrl").value.trim();
      if (!name) {
        alert("企業名を入力してください。");
        return;
      }

      await addRecord("companies", {
        uid: auth.currentUser.uid,
        name,
        url, // 任意（未入力なら空文字）
        createdAt: Date.now(),
      });

      await onSubmit();
      alert("登録しました！");
      e.target.reset();
    });
};
