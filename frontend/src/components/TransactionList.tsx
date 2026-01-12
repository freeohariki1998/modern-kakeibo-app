import React from "react";
import { BsTrash3 } from "react-icons/bs";

// 取引データの形を定義
interface KakeiboItem {
    id?: number;
    title: string;
    amount: number;
    category: string;
    categoryId: number;
    transactionDate: string;
}

// マスタデータの形を定義
interface MasterCategory {
    id: number;
    name: string;
    colorClass?: string;
    keyCode?: string;
    type?: string;
}
// Props(親から受け取るもの)の型を定義
interface TransactionListProps {
    data: KakeiboItem[]; // 履歴データの配列
    handleDelete: (id: number) => void; // 削除関数
    masterCategories: MasterCategory[]; // マスタデータ(色取得用)
}

const TransactionList: React.FC<TransactionListProps> = ({ data, handleDelete, masterCategories}) => {
    return (
        <div className="lg:col-span-8">
            <div className="bg-white p-6 rouded-2xl shadow-sm border border-gray-100 result-list max-h-[800px] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 sticky top-0 bg-white pb-2 z-10">取引履歴</h2>
                {/* データをリスト表示する */}
                <div className="list mt-8 space-y-4">
                {data.map((item) => {
                    const categoryMaster = masterCategories.find(cat => cat.id === item.categoryId);
                    const badgeColor = categoryMaster?.colorClass || "bg-gray-100 text-gray-600";
                    return (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-200">
                        <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            {/* 日付 */}
                            <span className="text-sm text-gray-400">{item.transactionDate}</span>
                            {/* カテゴリ */}
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${badgeColor}`}>
                            {item.category}
                            </span>
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
                    );
                })}
                </div>
            </div>
        </div>
    )
};
export default TransactionList;