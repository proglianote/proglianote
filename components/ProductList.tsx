
import React from 'react';
import { Product, Brand, Line } from '../types';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  brands: Brand[];
  lines: Line[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, brands, lines, selectedIds, onToggleSelect }) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <p className="text-slate-400 font-medium text-sm">該当する薬剤がありません。</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* 横スクロールを可能にするコンテナ */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* テーブル見出し - 完全に一列で固定 */}
          <div className="flex items-center px-3 py-2 bg-slate-50 border-b border-slate-200 text-[8px] font-black text-slate-400 uppercase tracking-widest">
            <div className="w-8 shrink-0">選</div>
            <div className="w-48 shrink-0 px-2">ブランド / 薬剤名</div>
            <div className="w-10 shrink-0 text-center">pH</div>
            <div className="w-10 shrink-0 text-center">Alk</div>
            <div className="w-10 shrink-0 text-center">Pow</div>
            <div className="flex-1 min-w-[120px] pl-3 border-l border-slate-200 ml-2">アルカリ成分</div>
            <div className="flex-1 min-w-[140px] pl-3 border-l border-slate-200">還元成分</div>
          </div>

          <div className="divide-y divide-slate-100">
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id);
              const line = lines.find(l => l.id === product.lineId);
              const brand = brands.find(b => b.id === product.brandId);
              
              const ph = product.specs.find(s => s.label === 'pH')?.value || '-';
              const alk = product.specs.find(s => s.label === 'アルカリ度')?.value || '-';
              const power = product.specs.find(s => s.label === '総還元力' || s.label === '還元力' || s.label === '還元値')?.value || '-';
              const alkComp = product.specs.find(s => s.label === 'アルカリ成分')?.value || '-';
              const redComp = product.specs.find(s => s.label === '還元成分' || s.label === '還元剤')?.value || '-';

              return (
                <div 
                  key={product.id}
                  onClick={() => onToggleSelect(product.id)}
                  className={`flex items-center px-3 py-2.5 transition-colors cursor-pointer group ${
                    isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* 選択ボタン */}
                  <div className="w-8 shrink-0">
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-200 group-hover:text-slate-300" />
                    )}
                  </div>

                  {/* 製品情報 */}
                  <div className="w-48 shrink-0 px-2 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 mb-0.5 overflow-hidden">
                      <span className="text-[7px] font-black text-white bg-slate-400 px-1 rounded-sm uppercase shrink-0">
                        {brand?.name.split(' ')[0]}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 truncate uppercase">
                        {line?.name}
                      </span>
                    </div>
                    <h4 className={`text-xs font-black truncate ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {product.name}
                    </h4>
                  </div>

                  {/* 数値スペック */}
                  <div className="w-10 shrink-0 text-center text-xs font-black tabular-nums text-slate-700">{ph}</div>
                  <div className="w-10 shrink-0 text-center text-xs font-black tabular-nums text-slate-700">{alk}</div>
                  <div className="w-10 shrink-0 text-center text-xs font-black tabular-nums text-slate-700">{power}</div>
                  
                  {/* 成分情報 - 折り返して全表示 */}
                  <div className="flex-1 min-w-[120px] text-[9px] font-bold text-slate-500 border-l border-slate-100 pl-3 ml-2 leading-tight">
                    {alkComp}
                  </div>
                  <div className="flex-1 min-w-[140px] text-[9px] font-bold text-slate-500 border-l border-slate-100 pl-3 leading-tight">
                    {redComp}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* モバイル向け操作ヒント */}
      <div className="sm:hidden px-3 py-1.5 bg-slate-50 text-[7px] font-bold text-slate-400 text-right border-t border-slate-100">
        ← 横にスクロールして詳細を確認できます
      </div>
    </div>
  );
};

export default ProductList;
