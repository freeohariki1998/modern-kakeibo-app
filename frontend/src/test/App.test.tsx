import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach,type Mock } from 'vitest';
import App from '../App';


// fetchをモック
globalThis.fetch = vi.fn();
// App コンポーネントの動作テスト
describe('App コンポーネントの動作テスト', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (fetch as Mock).mockResolvedValue({
            ok: true,
            json: async () => []
        });
    });

    // 新規登録フォームで「登録」ボタンを押すと、POSTリクエストが送信されること
    it('test001', async () => {
        render(<App />);
        // 入力フィールドに値を入力
        const titleInput = screen.getByPlaceholderText('品目');
        const amountInput = screen.getByPlaceholderText('金額');
        const submitButton = screen.getByText('登録');

        fireEvent.change(titleInput, { target: { value: 'お昼ご飯'}});
        fireEvent.change(amountInput, { target: { value: '800'}});

        // 登録ボタンクリック
        fireEvent.click(submitButton);

        // fetchがPOSTメソッドで呼ばれたか検証
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                '/api/kakeibo',
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining('"title":"お昼ご飯"')
                })
            );
        });
    });

    // 月切り替えボタン（次月）を押すと、表示されている年月が更新されること
    it('test002', () => {
        render(<App />);
        // 現在の年月を取得(yyyy年mm月)
        const now = new Date();
        const currentText = `${now.getFullYear()} 年${now.getMonth() + 1}月`;
        expect(screen.getByText(currentText)).toBeInTheDocument();

        const nextButton = screen.getAllByRole('button')[1];
        fireEvent.click(nextButton);

        // 翌月のテキストが表示されているか
        const nextMonth = now.getMonth() + 2;
        expect(screen.getByText(new RegExp(`${nextMonth}月`))).toBeInTheDocument();
    
    });
})