
import React from 'react';
import { Product, Brand, Line } from '../types';

interface ComparisonTableProps {
  products: Product[];
  brands: Brand[];
  lines: Line[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ products, brands, lines }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800">
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] w-[220px]">製品情報</th>
              <th className="px-4 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-center w-[80px]">pH</th>
              <th className="px-4 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-center w-[80px]">アルカリ度</th>
              <th className="px-4 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-center w-[80px]">還元力</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] w-[180px]">アルカリ成分</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] w-[180px]">還元成分</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">推奨対象毛</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product, idx) => {
              const brand = brands.find(b => b.id === product.brandId);
              const line = lines.find(l => l.id === product.lineId);
              
              const ph = product.specs.find(s => s.label === 'pH')?.value || '-';
              const alk = product.specs.find(s => s.label === 'アルカリ度')?.value || '-';
              const power = product.specs.find(s => s.label === '総還元力' || s.label === '還元力' || s.label === '還元値')?.value || '-';
              const alkComp = product.specs.find(s => s.label === 'アルカリ成分')?.value || '-';
              const agent = product.specs.find(s => s.label === '還元成分' || s.label === '還元剤')?.value || '-';

              return (
                <tr key={product.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/30 transition-colors`}>
                  <td className="px-6 py-6 border-r border-slate-50">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">{brand?.name.split(' ')[0]}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{line?.name}</span>
                      </div>
                      <span className="text-sm font-black text-slate-800 leading-snug">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-sm text-slate-700 text-center font-black tabular-nums">{ph}</td>
                  <td className="px-4 py-6 text-sm text-slate-700 text-center font-black tabular-nums border-l border-slate-50">{alk}</td>
                  <td className="px-4 py-6 text-sm text-slate-700 text-center font-black tabular-nums border-l border-slate-50">{power}</td>
                  <td className="px-6 py-6 text-[11px] text-slate-600 leading-relaxed font-bold border-l border-slate-50 bg-slate-50/30">{alkComp}</td>
                  <td className="px-6 py-6 text-[11px] text-slate-600 leading-relaxed font-bold border-l border-slate-50 bg-slate-50/30">{agent}</td>
                  <td className="px-6 py-6 text-[11px] text-slate-500 italic leading-snug border-l border-slate-50">
                    <div className="font-bold text-slate-700 not-italic">{product.targetHair.length > 0 ? product.targetHair.join(' / ') : '未指定'}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {products.length === 0 && (
        <div className="p-20 text-center text-slate-400 text-sm font-medium">
          比較する薬剤を選択してください
        </div>
      )}
    </div>
  );
};

export default ComparisonTable;
