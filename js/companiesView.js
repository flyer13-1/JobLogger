import { getRecords, deleteRecord, updateRecord } from "./db.js";

// HTMLエスケープ（ユーザ入力をそのまま埋め込まない）
const escapeHtml = (str = "") =>
  String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

// http/httpsのURLだけをリンクとして許可する
const isSafeUrl = (url = "") => /^https?:\/\//i.test(url.trim());

// 就活の軸の一覧表示
export const loadAxes = async (uid) => {
  const axes = await getRecords("axes", uid);
  // 登録順で並べる
  axes.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));

  const list = document.getElementById("axisList");
  list.innerHTML = "";

  if (axes.length === 0) {
    list.innerHTML = `<li class="axis-empty">まだ就活の軸が登録されていません</li>`;
    return;
  }

  axes.forEach((axis) => {
    const li = document.createElement("li");
    li.className = "axis-item";
    li.innerHTML = `
      <span>${escapeHtml(axis.text)}</span>
      <button class="axisDeleteBtn" data-id="${axis.id}" aria-label="削除">×</button>
    `;
    list.appendChild(li);
  });

  // 軸の削除
  document.querySelectorAll(".axisDeleteBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!window.confirm("この軸を削除しますか？")) return;

      await deleteRecord(btn.dataset.id, "axes");
      await loadAxes(uid); // 削除後に再読み込み
    });
  });
};

// 気になる企業の一覧表示
export const loadCompanies = async (uid) => {
  const companies = await getRecords("companies", uid);
  // 順位の昇順で並べる（未設定は末尾、同順位は登録順）
  companies.sort((a, b) => {
    const rankA = a.rank ?? Infinity;
    const rankB = b.rank ?? Infinity;
    if (rankA !== rankB) return rankA - rankB;
    return (a.createdAt ?? 0) - (b.createdAt ?? 0);
  });

  const tbody = document.getElementById("companyTableBody");
  tbody.innerHTML = "";

  companies.forEach((c) => {
    const tr = document.createElement("tr");
    const urlCell =
      c.url && isSafeUrl(c.url)
        ? `<a href="${escapeHtml(c.url)}" target="_blank" rel="noopener noreferrer">サイトを開く</a>`
        : "none";

    tr.innerHTML = `
      <td>
        <input
          type="number"
          class="companyRankInput"
          data-id="${c.id}"
          value="${c.rank ?? ""}"
          aria-label="順位"
        />
      </td>
      <td>${escapeHtml(c.name)}</td>
      <td>${urlCell}</td>
      <td><button class="companyDeleteBtn" data-id="${c.id}">削除</button></td>
    `;
    tbody.appendChild(tr);
  });

  // 順位の更新（入力後にフォーカスを外したタイミングで即保存・即並び替え）
  document.querySelectorAll(".companyRankInput").forEach((input) => {
    input.addEventListener("change", async () => {
      const value = input.value.trim();
      const rank = value === "" ? null : Number(value);

      await updateRecord(input.dataset.id, { rank }, "companies");
      await loadCompanies(uid); // 更新後に並び替えを反映
    });
  });

  // 企業の削除
  document.querySelectorAll(".companyDeleteBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!window.confirm("本当に削除しますか？")) return;

      await deleteRecord(btn.dataset.id, "companies");
      await loadCompanies(uid); // 削除後に再読み込み
    });
  });
};
