import { useEffect, useState } from "react";
import './App.css';
import CategoryPieChart from "./components/CategoryPieChart";
import TransactionList from './components/TransactionList';
import type { Kakeibo, CategoryMaster, CategoryTotals, CategorySummary, KakeiboItem } from "./types";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import EditModal from "./components/EditModal";

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // 状態管理 (DBから受け取ったデータを保存)
    const [data, setData] = useState<Kakeibo[]>([]);

    // 入力フォーム用の状態（State）
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState<number | "">("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // 今日をデフォルトに
    const [message, setMessage] = useState("");

    // カテゴリを取得
    const [masterCategoryes, setMasterCategoryes] = useState<CategoryMaster[]>([]);
    const [selectedCateegory, setSelectedCateegory] = useState("")

    // 月の管理
    const [currentDate, setCurrentDate] = useState(new Date())

    // APIから取得した集計データを保存する
    const [categoryTotals, setCategoryTotals] = useState<CategoryTotals>({});

    // 予算
    const [budget, setBudget] = useState<number>(0);

    // 編集中のアイテムを保持
    const [editingItem, setEditingItem] = useState<KakeiboItem | null>(null);
    /* ----------------
        画面開いたときのAPIの処理
    ----------------*/
    // 家計簿取得
    const fetchData = () => {
    fetch("/api/kakeibo")
        .then(res => {
            if(!res.ok) throw new Error("家計簿データの取得に失敗しました");
            return res.json();
        }) // 届いたデータをJOSONとして解析
        .then(json => setData(json)) // 取得したデータを「data」に保存
        .catch((err) => {
            setMessage("");
            console.error("家計簿エラー：",err.message);
        });
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
        .catch((err) => {
            setMessage("");
            console.error("マスターエラー：", err.message);
        });
    }

    // 現在の日付を取得する
    const fetchSummary = async (monthStr: string) => {
        setIsLoading(true);
        setError(null);
        try{
            const res  = await fetch(`/api/kakeibo/summary?month=${monthStr}`);
            if(!res.ok){
                throw new Error("サーバーとの通信に失敗しました。時間をおいて再度お試しください。")
            }
            const json: CategorySummary[] = await res.json();
            const formattted = json.reduce((acc, cur) => {
                    acc[cur.category] = cur.amount;
                    return acc;
                },{} as Record<string, number>); 
            setCategoryTotals(formattted);
        } catch (err: unknown) {
            setMessage("");
            if(err instanceof Error){
                setError(err.message);
            }else{
                setError("予期せぬエラーが発生しました。");
            }
            console.error("集計取得エラー:", err)
        }finally{
            setIsLoading(false);
        }
    };

    // 予算取得
    const fetchBudget = async(monthStr: string) => {
        try{
            const res = await fetch(`/api/budget/${monthStr}`);
            const amount = await res.json();
            setBudget(amount);
        }catch(err){
            setMessage("");
            console.error("予算取得エラー:",err)
        }
    }

    // 画面開いたときに実行
    useEffect(() => {
        fetchData();
        fetchMaster();
    },[]);

    /* ----------------
        集計・計算ロジック
    ----------------*/    
    // 表示対象月を作る(yyyy-MM)
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentYearMonth = `${year}-${month}`;
    // dataの中から現在の年月に一致するものだけを抽出
    const filteredData = data.filter(item => item.transactionDate.startsWith(currentYearMonth));
    // 抽出したデータを使って合計やグラフ用データを計算
    const totalAmount = (Object.values(categoryTotals) as number[]).reduce((sum, val) => sum + val, 0);
    // 予算
    const usageRate = budget > 0 ? (totalAmount / budget) * 100 : 0;
    const isOverBudget = totalAmount > budget;

    /* ----------------
        画面内APIの処理
    ----------------*/
    // 送信
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault(); // 画面リロードを防ぐ
        setError(null);
        try {
            const selectedMaster = masterCategoryes.find(cat => cat.name === selectedCateegory)
            const newItem = { 
            transactionDate: date, 
            title, 
            amount,
            category: selectedCateegory,
            categoryId: selectedMaster?.id || 0
        };
            const res = await fetch("/api/kakeibo",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            })
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "入力内容に不備があります")
            }
            fetchData(); // 送信成功後、リストを再読み込み
            setTitle(""); // 入力欄を空にする
            setAmount("");
            fetchSummary(currentYearMonth);
            setMessage("保存しました！"); // メッセージをセット

            // 一旦３秒後にメッセージを返す
            setTimeout(() => setMessage(""), 3000);
        }catch(err: unknown){
            setMessage("");
            if (err instanceof Error) {
                setError(err.message); // 画面上の赤いエラー枠に表示される
            }
        }
    }

    // 編集
    const handleEdit = (item: KakeiboItem) => {
        setEditingItem(item) // 編集したいデータをセットする
    }
    const handleUpdate = async(updatedItem: KakeiboItem) => {
        try{
            // idがないと処理終了
            if(!updatedItem.id) return;
            const res = await fetch(`/api/kakeibo/${updatedItem.id}`, {
                method:'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem)
            });
            if (!res.ok) {
                throw new Error("サーバー側の更新に失敗しました");
            }
            await fetchData(); // 送信成功後、リストを再読み込み
            setEditingItem(null);
            await fetchSummary(currentYearMonth);
            alert("更新が完了しました！");
        }catch(err){
            setMessage("");
            console.error("編集処理が失敗しました",err);
            alert("更新に失敗しました。");
        }
    }

    // 削除
    const handleDelete = async(id?: number) => {
        if(!window.confirm("本当に削除しますか？")) return; // 確認ダイアログ
        setIsLoading(true)
        try{
            const res = await fetch(`/api/kakeibo/${id}`, {method: "DELETE" });
            if(res.ok){
                await fetchData(); // 削除成功後、リストを再読み込み
                await fetchSummary(currentYearMonth);
                setMessage("削除しました！"); // メッセージをセット
            }
        }catch(err){
            setMessage("");
            console.error("削除失敗:", err)
        }finally{
            setIsLoading(false)
        }
    };


    // 予算を保存
    const handleSaveBudget = async () => {
        // 現在表示している年月を取得
        const yearMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toLocaleString().padStart(2,'0')}`;
        try{
            const res = await fetch(`api/budget/${yearMonth}` , {
                method: "POST",
                headers: { "Content-type" : "application/json"},
                body: JSON.stringify({ amount:budget}),
            });
            
            if(res.ok){
                setMessage("予算を更新しました！");
                setTimeout(() => setMessage(""), 3000);
                fetchBudget(yearMonth)
            }else{
                throw new Error("保存に失敗しました");
            }
        }catch(err){
            setMessage("");
            console.error(err);
            setError("予算の保存中にエラーが発生しました")
        }
    }

    

    /* ----------------
        カレンダー・表示制御
    ----------------*/
    // 月を移動させる(offset: -1は前月、1は次月)
    const changeMonth = (offset:number) => {
        // ずれ防止対策で常に1日をセットしておく
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
        setCurrentDate(nextMonth)
    }
    // 月が変わるたびに実行されるように監視
    useEffect(() => {
        const yearMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
        fetchSummary(yearMonth);
        fetchBudget(yearMonth);
    }, [currentDate]); // currentDateが変わるたびに再実行

    return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My家計簿</h1>
        
        { /* レイアウト開始 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 左側：入力エリア */}
            <div className="lg:col-span-4 space-y-6">
                { /* 月切り替えナビ */}
                <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="p-2 hover:bg-indigo-50 rounded-full text-indigo-600 transition-colors"
                    >
                        <BsChevronLeft/>
                    </button>
                    <h2 className="text-xl font-bold text-gray-700">
                        {currentDate.getFullYear()} 年{currentDate.getMonth() + 1}月
                    </h2>
                    <button 
                        onClick={() => changeMonth(1)} 
                        className="p-2 hover:bg-indigo-50 rounded-full text-indigo-600 transition-colors"
                    >
                        <BsChevronRight size={24} />
                    </button>
                </div>
                {/* メッセージ表示 */}
                {message && (
                <div className="bg-green-500 text-white p-3 rouded-lg text-center animate-bounce animate-fade-in">
                    {message}
                </div>
                )}
                { /* 合計表示 */}
                <div className="bg-white p-4 rounded-xl shadow-sm md-6 flex justify-between items-center border-t-4 border-indigo-500">
                    <span className="text-gray-600 font-bold">今月の合計支出</span>
                    <span className="text-2xl font-black text-indigo-700">
                        ¥{totalAmount.toLocaleString()}
                    </span>
                </div>
                {/* 予算表示 */}
                <div className="flex items-center gap-2 mb-4 bg-gray-50 p-3 rouded-lg">
                    <label className="text-sm font-bold text-gray-600"> 今月の予算:</label>
                    <input
                        type="number"
                        value={budget === 0 ? "" : budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-32 px-2 py-1 border rouded text-right font-mono"
                        placeholder="予算を入力"
                    />
                    <button
                        onClick={() => handleSaveBudget()}
                        disabled={isLoading}
                        className="bg-indigo-600 text-white px-4 py-1 rounded text-sm hover:bg-indigo-700 transition-colors"
                    >
                        {isLoading ? "保存中..." : "予算を保存"}
                    </button>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <span className="text-sm text-gray-500 font-bold">予算進捗</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-gray-800">
                                    {Math.round(usageRate)}%
                                </span>
                                <span className="text-sm text-gray-500">
                                    (¥{totalAmount.toLocaleString()} / ¥{budget.toLocaleString()})
                                </span>
                            </div>
                        </div>
                        <span className={`text-sm font-bold ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                            {isOverBudget ? `¥${(totalAmount - budget).toLocaleString()} オーバー` : `残り ¥${(budget - totalAmount).toLocaleString()}`}
                        </span>
                    </div>
                    {/* 進捗バー */}
                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                        { /* 動くバー */}
                        <div className={`h-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-indigo-500'}`}
                            style={{ width: `${Math.min(usageRate, 100)}%`}}>

                        </div>
                    </div>
                </div>
                { /* エラー表示 */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p className="font-bold">エラーが発生しました</p>
                        <p>{error}</p>
                    </div>
                )}
                {/* ローディング表示 */}
                {isLoading ? (
                    <div className="flex justify-center items-center p-10">
                        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
                        <p className="ml-3 text-indigo-600 font-bold">データを読み込み中...</p>
                    </div>
                ) : (
                    <CategoryPieChart categoryTotals={categoryTotals} />
                )}
                { /* カテゴリ別合計表示エリア */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-500 mb-3">カテゴリ別内訳</h3>
                    <div className="space-y-2">
                        {(Object.entries(categoryTotals) as [string, number][]).map(([categoryName, total]) => (
                        <div key={categoryName} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{categoryName}</span>
                            <span className="font-bold text-gray-800">¥{total.toLocaleString()}</span>
                        </div>
                        ))}
                    </div>
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
                            {/** カテゴリ入力 */}
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
                <TransactionList 
                    data={filteredData} 
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    masterCategories={masterCategoryes}
                />
                {editingItem && (
                    <EditModal
                        item={editingItem}
                        masterCategories={masterCategoryes}
                        onClose={() => setEditingItem(null)}
                        onSave={handleUpdate}
                    />
                )}
            </div>
        </div>
        </div>
    </div>

    )
}

export default App;