import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Define the product performance interface
export interface ProductPerformance {
  id: number;
  name: string;
  image?: string;
  category: string;
  metrics: {
    amountSold: number[];
    quantitySold: number[];
    amountReturned: number[];
  };
}

// Define the types for product performance metrics
export type ProductMetric = 'amountSold' | 'quantitySold' | 'amountReturned';

interface ProductPerformanceChartProps {
  product: ProductPerformance;
  selectedMetrics: ProductMetric[];
}

// Metric data configuration
const metricConfig = {
  amountSold: {
    label: 'Amount Sold',
    value: 'amountSold',
    format: (value: number) => `$${value.toLocaleString()}`,
    color: 'rgba(79, 70, 229, 0.8)' // Indigo color
  },
  quantitySold: {
    label: 'Quantity Sold',
    value: 'quantitySold',
    format: (value: number) => `${value} units`,
    color: 'rgba(16, 185, 129, 0.8)' // Green color
  },
  amountReturned: {
    label: 'Amount Returned',
    value: 'amountReturned',
    format: (value: number) => `$${value.toLocaleString()}`,
    color: 'rgba(245, 158, 11, 0.8)' // Amber color
  }
};

export function ProductPerformanceChart({ product, selectedMetrics }: ProductPerformanceChartProps) {
  // Generate last 12 months as labels
  const generateMonthLabels = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      months.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    }
    
    return months;
  };
  
  const labels = generateMonthLabels();
  
  // Create datasets for each selected metric
  const datasets = selectedMetrics.map(metricKey => {
    const metric = metricConfig[metricKey];
    return {
      label: metric.label,
      data: product.metrics[metricKey],
      borderColor: metric.color,
      backgroundColor: `${metric.color.slice(0, -1)}, 0.1)`,
      tension: 0.3,
      fill: false, // Don't fill for overlaid metrics
      pointBackgroundColor: metric.color,
      pointRadius: 4,
      pointHoverRadius: 6,
      // Use different y-axis for different metrics
      yAxisID: metricKey === 'quantitySold' ? 'y1' : 'y'
    };
  });
  
  const chartData = {
    labels,
    datasets
  };
  
  // Configure chart options with multiple y-axes
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const datasetIndex = context.datasetIndex;
            const metricKey = selectedMetrics[datasetIndex];
            const value = context.parsed.y;
            return `${context.dataset.label}: ${metricConfig[metricKey].format(value)}`;
          }
        }
      }
    },
    scales: {
      // Primary y-axis for amount values (dollars)
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Amount ($)',
          font: {
            size: 12,
          }
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (typeof value === 'number') {
              return '$' + value.toLocaleString();
            }
            return '';
          }
        }
      },
      // Secondary y-axis for quantity values (units)
      y1: {
        type: 'linear',
        display: selectedMetrics.includes('quantitySold'),
        position: 'right',
        title: {
          display: true,
          text: 'Quantity (units)',
          font: {
            size: 12,
          }
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false, // Only show grid lines for primary axis
        },
      }
    }
  };
  
  return (
    <Line data={chartData} options={options} />
  );
}
