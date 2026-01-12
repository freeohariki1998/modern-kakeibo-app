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