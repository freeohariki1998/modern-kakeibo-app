export interface Kakeibo {
    id?: number;
    transactionDate: string;
    category: string;
    categoryId: number;
    title: string;
    amount: number;
}

export interface CategoryMaster {
    id: number;
    name: string;
    colorClass: string;
}

export interface CategorySummary {
    category: string;
    amount: number;
}

export type CategoryTotals = Record<string, number>;

export interface KakeiboItem {
    id?: number;
    title: string;
    amount: number;
    category: string;
    categoryId: number;
    transactionDate: string;
}
export interface MasterCategory {
    id: number;
    name: string;
    colorClass?: string;
    keyCode?: string;
    type?: string;
}