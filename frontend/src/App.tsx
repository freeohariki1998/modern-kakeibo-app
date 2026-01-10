import { useEffect, useState } from "react";
import './App.css';
import { BsTrash3 } from "react-icons/bs";
// データの型を定義
interface Kakeibo {
  id?: number;
  transactionDate: string;
  category: string;
  title: string;
  amount: number;
}

function App() {
  // 状態管理 (DBから受け取ったデータを保存)
  const [data, setData] = useState<Kakeibo[]>([]);

  // 入力フォーム用の状態（State）
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // 今日をデフォルトに
  const [message, setMessage] = useState("");

  // カテゴリを取得
  const [masterCategoryes, setMasterCategoryes] = useState<{id: number, name:string}[]>([]);
  const [selectedCateegory, setSelectedCateegory] = useState("")

  // 家計簿取得
  const fetchData = () => {
    fetch("/api/kakeibo")
      .then(res => {
        if(!res.ok) throw new Error("家計簿データの取得に失敗しました");
        return res.json();
      }) // 届いたデータをJOSONとして解析
      .then(json => setData(json)) // 取得したデータを「data」に保存
      .catch(err => console.error("家計簿エラー：",err.message));
  }

  // マスタデータを取得
  const fetchMaster = () => {
    fetch("/api/master/CATEGORY")
      .then(res => {
        if (!res.ok) throw new Error("マスタデータの取得に失敗しました");
        return res.json();
      })
      .then((data) => {
        setMasterCategoryes(data);
        // 最初の項目をデフォルトにセット
        if(data.length > 0) {
          setSelectedCateegory(data[0].name);
        }
      })
      .catch(err => console.error("マスターエラー：",err.message));
  }

  // 画面開いたときに実行
  useEffect(() => {
    fetchData();
    fetchMaster();
  },[]);


  // 送信
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 画面リロードを防ぐ

    const newItem = { 
      transactionDate: date, 
      title, amount,
      category:selectedCateegory
    };

    fetch("/api/kakeibo",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    })
    .then(() => {
      fetchData(); // 送信成功後、リストを再読み込み
      setTitle(""); // 入力欄を空にする
      setAmount("");
      setMessage("保存しました！"); // メッセージをセット

      // 一旦３秒後にメッセージを返す
      setTimeout(() => setMessage(""), 3000);
    })
    .catch(err => console.error("保存失敗:", err))
  }

  // 削除
  const handleDelete = (id?: number) => {
    if(!window.confirm("本当に削除しますか？")) return; // 確認ダイアログ

    fetch(`/api/kakeibo/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        fetchData(); // 削除成功後、リストを再読み込み
        setMessage("削除しました！"); // メッセージをセット
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => console.error("削除失敗:", err));
  }

  // amountの合計
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My家計簿</h1>
        { /* レイアウト開始 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左側：入力エリア */}
          
          <div className="lg:col-span-4 space-y-6">
          {/* メッセージ表示 */}
          {message && (
            <div className="bg-green-500 text-white p-3 rouded-lg text-center animate-bounce animate-fade-in">
              {message}
            </div>
          )}
          { /* 合計表示エリア */}
          <div className="bg-white p-4 rounded-xl shadow-sm md-6 flex justify-between items-center border-t-4 border-indigo-500">
            <span className="text-gray-600 font-bold">今月の合計支出</span>
            <span className="text-2xl font-black text-indigo-700">
              {totalAmount.toLocaleString()}円
            </span>
          </div>
            <div className="bg-white p-6 rouded-2xl shadow-sm boder border-gray-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📝</span> 新規登録
              </h2>
              {/* 入力フォーム */}
              <form onSubmit={handleSubmit} className="input-form bg-white p-6 rouded-xl shadow-md">
                <div className="flex flex-col gap-4">
                  {/** 日付入力 */}
                  <input
                    type="date" 
                    className="border-2 border-slate-200 p-2 rouded-md focus:border-indigo-500 outline-none"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  {/** 日付入力 */}
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-600 mb-1">カテゴリ</label>
                    <select
                      value={selectedCateegory}
                      onChange={(e) => setSelectedCateegory(e.target.value)}
                      className="border-2 border-gray-200 p-2 rounded-md focus:border-indigo-500 outline-none"
                    >
                      {masterCategoryes.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/** タイトル入力 */}
                  <input 
                    type="text" 
                    placeholder="品目"
                    className="border-2 border-slate-200 p-2 rounded-md focus:border-indigo-500 outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {/** 金額入力 */}
                  <input
                    type="number"
                    placeholder="金額" 
                    className="border-2 border-slate-200 p-2 rounded-md focus:border-indigo-500 outline-none"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                  <button
                    type="submit" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-md transition-all duration-300"
                  >
                    登録
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* 右側：履歴 */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 rouded-2xl shadow-sm border border-gray-100 result-list max-h-[800px] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4 sticky top-0 bg-white pb-2 z-10">取引履歴</h2>
              {/* データをリスト表示する */}
              <div className="list mt-8 space-y-4">
                {data.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-200">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {/* 日付 */}
                        <span className="text-sm text-gray-400">{item.transactionDate}</span>
                        {/* カテゴリ */}
                        <span className="px-2 py-1 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded">{item.category}</span>
                      </div>
                      {/* タイトル */}
                      <strong className="text-lg text-gray-700">{item.title}</strong>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-gray-900">
                        ¥{item.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDelete(item.id!)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      ><BsTrash3 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default App;