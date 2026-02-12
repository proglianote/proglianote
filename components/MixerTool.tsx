
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Brand, Line } from '../types';
import { Plus, Trash2, Calculator, Beaker, X, Info, AlertTriangle } from 'lucide-react';

interface MixerEntry {
  id: string;
  productId: string;
  grams: number;
}

interface MixerToolProps {
  products: Product[];
  brands: Brand[];
  lines: Line[];
  prefillIds?: string[];
  onPrefillHandled?: () => void;
}

const MixerTool: React.FC<MixerToolProps> = ({ products, brands, lines, prefillIds, onPrefillHandled }) => {
  const [entries, setEntries] = useState<MixerEntry[]>([
    { id: '1', productId: '', grams: 0 }
  ]);

  // 外部（製品一覧/比較ドロワー）からの薬剤流し込みを監視
  useEffect(() => {
    if (prefillIds && prefillIds.length > 0) {
      const newEntries = prefillIds.map((id, index) => ({
        id: `prefilled-${Date.now()}-${index}`,
        productId: id,
        grams: 0
      }));
      setEntries(newEntries);
      if (onPrefillHandled) onPrefillHandled();
    }
  }, [prefillIds, onPrefillHandled]);

  const addEntry = () => {
    setEntries([...entries, { id: Date.now().toString(), productId: '', grams: 0 }]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const updateEntry = (id: string, field: keyof MixerEntry, value: any) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const mixedResults = useMemo(() => {
    let totalGrams = 0;
    let weightedPh = 0;
    let weightedAlk = 0;
    let weightedPower = 0;
    const mixedAlkali = new Set<string>();
    const mixedReducers = new Set<string>();

    const activeEntries = entries.filter(e => e.productId && e.grams > 0);

    activeEntries.forEach(entry => {
      const product = products.find(p => p.id === entry.productId);
      if (product) {
        const ph = parseFloat(product.specs.find(s => s.label === 'pH')?.value || '0');
        const alk = parseFloat(product.specs.find(s => s.label === 'アルカリ度')?.value || '0');
        const power = parseFloat(product.specs.find(s => s.label === '総還元力' || s.label === '還元力' || s.label === '還元値')?.value || '0');
        
        const alkComp = product.specs.find(s => s.label === 'アルカリ成分')?.value;
        const redComp = product.specs.find(s => s.label === '還元成分' || s.label === '還元剤')?.value;

        totalGrams += entry.grams;
        weightedPh += ph * entry.grams;
        weightedAlk += alk * entry.grams;
        weightedPower += power * entry.grams;

        if (alkComp && alkComp !== '-') {
          alkComp.split(/[、,]/).map(s => s.trim()).filter(Boolean).forEach(s => mixedAlkali.add(s));
        }
        if (redComp && redComp !== '-') {
          redComp.split(/[、,]/).map(s => s.trim()).filter(Boolean).forEach(s => mixedReducers.add(s));
        }
      }
    });

    if (totalGrams === 0) return null;

    return {
      ph: (weightedPh / totalGrams).toFixed(2),
      alk: (weightedAlk / totalGrams).toFixed(2),
      power: (weightedPower / totalGrams).toFixed(2),
      alkali: Array.from(mixedAlkali).join(', '),
      reducers: Array.from(mixedReducers).join(', '),
      totalGrams
    };
  }, [entries, products]);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden mb-8">
      {/* ヘッダー */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950">
        <div className="flex items-center gap-2 text-indigo-400">
          <Beaker className="w-5 h-5" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">薬剤調合シミュレーター</h2>
        </div>
        <button 
          onClick={() => setEntries([{ id: '1', productId: '', grams: 0 }])}
          className="text-[10px] font-black text-slate-500 hover:text-white transition-colors"
        >
          リセット
        </button>
      </div>

      <div className="p-4 md:p-6 flex flex-col gap-6">
        {/* 入力セクション - カード型 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {entries.map((entry) => (
            <div key={entry.id} className="relative bg-white/5 p-4 rounded-2xl border border-white/10 group transition-all hover:bg-white/[0.08]">
              {/* 削除ボタン */}
              {entries.length > 1 && (
                <button 
                  onClick={() => removeEntry(entry.id)}
                  className="absolute -top-1 -right-1 bg-slate-800 text-slate-400 hover:text-red-400 p-1 rounded-full border border-white/10 shadow-lg transition-colors z-10"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              
              <div className="flex flex-col gap-3">
                {/* 薬剤選択 */}
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">薬剤を選択</label>
                  <select
                    value={entry.productId}
                    onChange={(e) => updateEntry(entry.id, 'productId', e.target.value)}
                    className="w-full bg-slate-800 border-0 rounded-xl px-3 py-2.5 text-[11px] font-bold text-white focus:ring-1 ring-indigo-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">未選択</option>
                    {products.map(p => {
                      const brand = brands.find(b => b.id === p.brandId);
                      return (
                        <option key={p.id} value={p.id}>
                          [{brand?.name.split(' ')[0]}] {p.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* 配合量 */}
                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">配合量</span>
                  <div className="w-24 relative">
                    <input
                      type="number"
                      placeholder="0"
                      value={entry.grams || ''}
                      onChange={(e) => updateEntry(entry.id, 'grams', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border-0 rounded-lg px-2 py-2 text-xs font-black text-white focus:ring-1 ring-indigo-500 transition-all text-right pr-7"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 pointer-events-none">g</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={addEntry}
            className="min-h-[100px] border-2 border-dashed border-slate-800 rounded-2xl text-[10px] font-black text-slate-600 hover:border-indigo-500 hover:text-indigo-400 transition-all flex flex-col items-center justify-center gap-2 bg-transparent"
          >
            <Plus className="w-4 h-4" /> 薬剤を追加
          </button>
        </div>

        {/* 計算結果セクション */}
        <div className="bg-indigo-600/10 rounded-2xl p-5 border border-indigo-500/20">
          {mixedResults ? (
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-6 animate-in fade-in duration-300">
              {/* 数値スペック */}
              <div className="flex flex-wrap items-center gap-8 shrink-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">pH</span>
                  <span className="text-3xl font-black text-white tabular-nums leading-none">{mixedResults.ph}</span>
                </div>
                <div className="flex items-baseline gap-2 border-l border-white/10 pl-8">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">アルカリ</span>
                  <span className="text-3xl font-black text-white tabular-nums leading-none">{mixedResults.alk}</span>
                </div>
                <div className="flex items-baseline gap-2 border-l border-white/10 pl-8">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-tighter">還元力</span>
                  <span className="text-3xl font-black text-white tabular-nums leading-none">{mixedResults.power}</span>
                </div>
              </div>

              {/* 成分情報 */}
              <div className="flex-1 flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-10 md:pl-10 md:border-l border-white/10 min-w-[200px]">
                <div className="flex flex-col gap-0.5 min-w-[120px]">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">含有アルカリ</span>
                  <span className="text-[10px] font-bold text-slate-300 whitespace-normal break-words leading-relaxed">
                    {mixedResults.alkali || 'なし'}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 min-w-[120px]">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">含有還元剤</span>
                  <span className="text-[10px] font-bold text-slate-300 whitespace-normal break-words leading-relaxed">
                    {mixedResults.reducers || 'なし'}
                  </span>
                </div>
              </div>

              {/* 総量 */}
              <div className="shrink-0 text-right md:pl-10 md:border-l border-white/10">
                <div className="text-[8px] font-black text-slate-500 uppercase mb-0.5 tracking-widest">合計配合量</div>
                <div className="text-xl font-black text-white tabular-nums leading-none">
                  {mixedResults.totalGrams}<span className="text-[10px] ml-1 text-slate-500 font-bold uppercase">g</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 py-6 text-slate-600">
              <Calculator className="w-5 h-5 opacity-50" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">薬剤と配合量を入力してスペックを算出</p>
            </div>
          )}
        </div>

        {/* 補足説明・免責事項セクション */}
        <div className="pt-4 border-t border-white/5">
          <div className="flex gap-3">
            <div className="shrink-0 mt-0.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">計算ロジックについて</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  当ツールは各薬剤のスペック値を配合量に基づいた「加重平均（重み付き平均）」で算出しています。pHは本来対数スケールですが、美容実務における薬剤設計の指標として一般的な線形近似値を採用しています。
                </p>
              </div>
              <div className="flex gap-2 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <div className="space-y-1">
                  <h3 className="text-[9px] font-black text-amber-500 uppercase tracking-widest">注意事項・免責事項</h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    各メーカーのバッファ能（緩衝力）や成分構成の相互作用により、実際の混合結果とは数％程度の誤差が生じる場合があります。
                    <span className="text-slate-300 font-bold ml-1">算出した比率は必ず事前に毛束等で検証の上、施術者の責任においてご使用ください。</span>
                    本ツールの利用により生じたいかなる損害についても、当サイトは一切の責任を負いかねます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixerTool;
