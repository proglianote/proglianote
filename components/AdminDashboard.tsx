
import React, { useState } from 'react';
import { Brand, Line, Product, Spec } from '../types';
import { Plus, Trash2, Edit3, X, ChevronUp, ChevronDown, Check, Code, Copy, Download } from 'lucide-react';

interface AdminDashboardProps {
  brands: Brand[];
  lines: Line[];
  products: Product[];
  onUpdateBrands: (brands: Brand[]) => void;
  onUpdateLines: (lines: Line[]) => void;
  onUpdateProducts: (products: Product[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ brands, lines, products, onUpdateBrands, onUpdateLines, onUpdateProducts }) => {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'BRANDS' | 'LINES'>('PRODUCTS');
  const [editingItem, setEditingItem] = useState<{ type: 'BRAND' | 'LINE' | 'PRODUCT', data: any } | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // 並び替えロジック
  const moveItem = (index: number, direction: 'UP' | 'DOWN', list: any[], updateFn: (newList: any[]) => void) => {
    const newList = [...list];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    updateFn(newList);
  };

  const handleEditClick = (type: 'BRAND' | 'LINE' | 'PRODUCT', data: any) => {
    setEditingItem({ type, data: JSON.parse(JSON.stringify(data)) });
  };

  const handleSave = () => {
    if (!editingItem) return;
    const { type, data } = editingItem;
    if (type === 'PRODUCT') onUpdateProducts(products.map(p => p.id === data.id ? data : p));
    if (type === 'LINE') onUpdateLines(lines.map(l => l.id === data.id ? data : l));
    if (type === 'BRAND') onUpdateBrands(brands.map(b => b.id === data.id ? data : b));
    setEditingItem(null);
  };

  const generateCode = () => {
    const brandsCode = `export const INITIAL_BRANDS: Brand[] = ${JSON.stringify(brands, null, 2)};`;
    const linesCode = `export const INITIAL_LINES: Line[] = ${JSON.stringify(lines, null, 2)};`;
    const productsCode = `export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;
    
    return `import { Brand, Line, Product } from './types';\n\n${brandsCode}\n\n${linesCode}\n\n${productsCode}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCode());
    alert('コードをクリップボードにコピーしました。constants.ts に貼り付けてください。');
  };

  const downloadAsFile = () => {
    const element = document.createElement("a");
    const file = new Blob([generateCode()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "constants.ts";
    document.body.appendChild(element);
    element.click();
  };

  const handleAddProduct = () => {
    if (lines.length === 0) return alert('先にラインを登録してください');
    const newLine = lines[0];
    const newProduct: Product = {
      id: `p${Date.now()}`,
      brandId: newLine.brandId,
      lineId: newLine.id,
      name: '新規薬剤',
      description: '',
      specs: [
        { id: 's_ph', label: 'pH', value: '' },
        { id: 's_alk', label: 'アルカリ度', value: '' },
        { id: 's_pow', label: '総還元力', value: '' },
        { id: 's_comp1', label: 'アルカリ成分', value: '' },
        { id: 's_comp2', label: '還元成分', value: '' }
      ],
      targetHair: []
    };
    onUpdateProducts([newProduct, ...products]);
    handleEditClick('PRODUCT', newProduct);
  };

  const handleAddLine = () => {
    if (brands.length === 0) return alert('先にブランドを登録してください');
    const newLine: Line = { id: `l${Date.now()}`, brandId: brands[0].id, name: '新規ライン', description: '' };
    onUpdateLines([newLine, ...lines]);
    handleEditClick('LINE', newLine);
  };

  const handleAddBrand = () => {
    const newBrand: Brand = { id: `b${Date.now()}`, name: '新規ブランド', description: '' };
    onUpdateBrands([newBrand, ...brands]);
    handleEditClick('BRAND', newBrand);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">データ管理</h1>
          <p className="text-slate-500 text-sm">薬剤・ライン・ブランドの情報を編集し、並び替えを行います</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl text-[10px] font-black hover:bg-slate-700 transition-all flex items-center gap-2 uppercase tracking-widest"
          >
            <Code className="w-4 h-4" /> ソースコード出力
          </button>
          <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button onClick={() => setActiveTab('PRODUCTS')} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'PRODUCTS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>薬剤</button>
            <button onClick={() => setActiveTab('LINES')} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'LINES' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>ライン</button>
            <button onClick={() => setActiveTab('BRANDS')} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'BRANDS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>ブランド</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
            {activeTab === 'PRODUCTS' ? '登録薬剤一覧' : activeTab === 'LINES' ? '登録ライン一覧' : '登録ブランド一覧'}
          </h2>
          <button 
            onClick={activeTab === 'PRODUCTS' ? handleAddProduct : activeTab === 'LINES' ? handleAddLine : handleAddBrand}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> 新規追加
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">順序</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">名称</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">所属 / 説明</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(activeTab === 'PRODUCTS' ? products : activeTab === 'LINES' ? lines : brands).map((item: any, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => moveItem(idx, 'UP', (activeTab === 'PRODUCTS' ? products : activeTab === 'LINES' ? lines : brands), (activeTab === 'PRODUCTS' ? onUpdateProducts : activeTab === 'LINES' ? onUpdateLines : onUpdateBrands))}
                        className="p-1 hover:bg-slate-200 rounded text-slate-400 transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => moveItem(idx, 'DOWN', (activeTab === 'PRODUCTS' ? products : activeTab === 'LINES' ? lines : brands), (activeTab === 'PRODUCTS' ? onUpdateProducts : activeTab === 'LINES' ? onUpdateLines : onUpdateBrands))}
                        className="p-1 hover:bg-slate-200 rounded text-slate-400 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400">
                      {activeTab === 'PRODUCTS' ? (lines.find(l => l.id === item.lineId)?.name || '未分類') : activeTab === 'LINES' ? (brands.find(b => b.id === item.brandId)?.name || '未設定') : item.description}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(activeTab === 'PRODUCTS' ? 'PRODUCT' : activeTab === 'LINES' ? 'LINE' : 'BRAND', item)}
                        className="px-4 py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-black transition-all flex items-center gap-2"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> 編集
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('本当に削除しますか？')) {
                            if (activeTab === 'PRODUCTS') onUpdateProducts(products.filter(p => p.id !== item.id));
                            else if (activeTab === 'LINES') onUpdateLines(lines.filter(l => l.id !== item.id));
                            else onUpdateBrands(brands.filter(b => b.id !== item.id));
                          }
                        }}
                        className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* エクスポート用モーダル */}
      {showExportModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Code className="w-6 h-6 text-indigo-600" />
                <div>
                  <h3 className="text-lg font-black text-slate-800">ソースコードの書き出し</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">constants.ts を更新する準備ができました</p>
                </div>
              </div>
              <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 flex-1 overflow-hidden flex flex-col gap-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3">
                <Check className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-[11px] font-bold text-amber-800 leading-relaxed">
                  管理画面で行った変更をプログラム自体に反映させるには、以下のコードをすべてコピーし、プロジェクト内の <code className="bg-amber-100 px-1 rounded font-mono">constants.ts</code> ファイルを上書きしてください。
                </p>
              </div>
              <div className="flex-1 bg-slate-900 rounded-2xl p-6 overflow-y-auto font-mono text-xs text-slate-300 relative group">
                <pre className="whitespace-pre-wrap">{generateCode()}</pre>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={copyToClipboard}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 backdrop-blur-sm"
                  >
                    <Copy className="w-4 h-4" /> コピー
                  </button>
                  <button 
                    onClick={downloadAsFile}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> constants.ts を保存
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={() => setShowExportModal(false)}
                className="px-8 py-3 bg-slate-800 text-white rounded-2xl text-xs font-black shadow-xl hover:bg-slate-900 transition-all"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* モーダル編集UI */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                {editingItem.type === 'PRODUCT' ? '薬剤スペック編集' : editingItem.type === 'LINE' ? 'ライン情報編集' : 'ブランド情報編集'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              {/* Product Edit Form */}
              {editingItem.type === 'PRODUCT' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">名称</label>
                      <input className="w-full bg-slate-50 border-0 rounded-xl p-4 text-sm font-bold focus:ring-2 ring-indigo-500 transition-all" value={editingItem.data.name} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, name: e.target.value}})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">所属ライン</label>
                      <select className="w-full bg-slate-50 border-0 rounded-xl p-4 text-sm font-bold focus:ring-2 ring-indigo-500 transition-all" value={editingItem.data.lineId} onChange={e => {
                        const line = lines.find(l => l.id === e.target.value);
                        setEditingItem({...editingItem, data: {...editingItem.data, lineId: e.target.value, brandId: line?.brandId}});
                      }}>
                        {lines.map(l => <option key={l.id} value={l.id}>{l.name} ({brands.find(b => b.id === l.brandId)?.name})</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">スペック詳細 (数値・成分)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {editingItem.data.specs.map((s: Spec, idx: number) => (
                        <div key={s.id} className="bg-slate-50 p-3 rounded-xl flex gap-2 items-center">
                          <input className="bg-transparent border-0 font-black text-[10px] text-indigo-600 w-24 focus:ring-0" value={s.label} onChange={e => {
                            const newSpecs = [...editingItem.data.specs];
                            newSpecs[idx].label = e.target.value;
                            setEditingItem({...editingItem, data: {...editingItem.data, specs: newSpecs}});
                          }} />
                          <input className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold w-full focus:ring-2 ring-indigo-500 transition-all" value={s.value} onChange={e => {
                            const newSpecs = [...editingItem.data.specs];
                            newSpecs[idx].value = e.target.value;
                            setEditingItem({...editingItem, data: {...editingItem.data, specs: newSpecs}});
                          }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">推奨対象毛 (カンマ区切り)</label>
                    <input className="w-full bg-slate-50 border-0 rounded-xl p-4 text-sm font-bold" value={editingItem.data.targetHair.join(', ')} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, targetHair: e.target.value.split(',').map(s => s.trim())}})} />
                  </div>
                </>
              )}

              {/* Line Edit Form */}
              {editingItem.type === 'LINE' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ライン名称</label>
                    <input className="w-full bg-slate-50 border-0 rounded-xl p-4 text-sm font-bold" value={editingItem.data.name} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, name: e.target.value}})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ブランド</label>
                    <select className="w-full bg-slate-50 border-0 rounded-xl p-4 text-sm font-bold" value={editingItem.data.brandId} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, brandId: e.target.value}})}>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Brand Edit Form */}
              {editingItem.type === 'BRAND' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ブランド名称</label>
                    <input className="w-full bg-slate-50 border-0 rounded-xl p-4 text-sm font-bold" value={editingItem.data.name} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, name: e.target.value}})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">説明文</label>
                    <textarea rows={3} className="w-full bg-slate-50 border-0 rounded-xl p-4 text-sm font-bold" value={editingItem.data.description} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} />
                  </div>
                </>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
              <button 
                onClick={() => setEditingItem(null)}
                className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-400 hover:bg-slate-100 transition-all"
              >
                キャンセル
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] px-6 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> 変更を保存する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
