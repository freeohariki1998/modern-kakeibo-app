import React from 'react';
import {Pie} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryPieChartProps {
    categoryTotals: Record<string, number>;
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ categoryTotals }) => {
    // グラフ用データを作成
    const pieChartData = {
        labels: Object.keys(categoryTotals),
        datasets: [
        {
            data:Object.values(categoryTotals),
            backgroundColor: [
            'rgba(255, 99, 132, 0.6)',   // 赤
            'rgba(54, 162, 235, 0.6)',   // 青
            'rgba(255, 206, 86, 0.6)',   // 黄
            'rgba(75, 192, 192, 0.6)',   // 緑
            'rgba(153, 102, 255, 0.6)',  // 紫
            'rgba(255, 159, 64, 0.6)',   // オレンジ
            ],
            borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            ],
        BsBorderWidth: 1,
        },
        ],
    };
    const options = {
        maintainAspectRatio: false, // 縦横比を固定しない
        plugins: {
        legend: {
            position: 'bottom' as const, // 凡例を下側に表示
        },
        },
        cutout: '60%', // ドーナツ型
    }
    return (
        <div className="bg-white p-6 rouded-2xl shadow-sm border border-gray-100 mt-4">
        <h3 className="text-lg font-bold mb-4">支出内訳グラフ</h3>
        <div className="h-64">
            {Object.keys(categoryTotals).length > 0 ? (
                <Pie data={pieChartData} options={options} />
                ): (
                    <p className="text-gray-500 text-center flex items-center justify-center h-full">
                        データがありません
                    </p>
                )
            }
        </div>
        
        </div>
    )
}

export default CategoryPieChart;