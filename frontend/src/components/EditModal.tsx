// src/components/EditModal.tsx
import React, { useState, useEffect } from "react";
import type { KakeiboItem, MasterCategory } from "../types"; // 型を定義したファイルからインポート

interface EditModalProps {
    item: KakeiboItem;
    masterCategories: MasterCategory[];
    onClose: () => void;
    onSave: (updatedItem: KakeiboItem) => void;
}

const EditModal: React.FC<EditModalProps> = ({ item, masterCategories, onClose, onSave }) => {
    // 初期値として、クリックされたitemの値をセット
    const [formData, setFormData] = useState<KakeiboItem>(item);

    // モーダルが開いた時にフォームを更新（これがないと2回目以降違うデータが開かない）
    useEffect(() => {
        setFormData(item);
    }, [item]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">取引を編集</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 日付入力 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
                        <input
                            type="date"
                            value={formData.transactionDate}
                            onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* カテゴリ選択 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const selectedCat = masterCategories.find(c => c.id === selectedId);
                                setFormData({ 
                                    ...formData, 
                                    categoryId: selectedId, 
                                    category: selectedCat?.name || "" 
                                });
                            }}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {masterCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* タイトル入力 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">タイトル（内容）</label>
                        <input
                            type="text"
                            placeholder="例: お昼ごはん"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    
                    {/* 金額入力 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">金額</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">¥</span>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                className="w-full border border-gray-300 rounded-lg p-2 pl-7 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* ボタンエリア */}
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
                        >
                            保存する
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;