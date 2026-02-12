
import React, { useState, useEffect } from 'react';
import { Brand, Line, Product, ViewMode } from './types';
import { INITIAL_BRANDS, INITIAL_LINES, INITIAL_PRODUCTS } from './constants';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ComparisonTable from './components/ComparisonTable';
import AdminDashboard from './components/AdminDashboard';
import MixerTool from './components/MixerTool';
import { Filter, Lock, KeyRound, ArrowUp, X, Columns, Sparkles } from 'lucide-react';

export const HAIR_TYPE_OPTIONS = ['強いクセ毛', '標準的なクセ毛', '細毛', 'ダメージ毛', 'ブリーチ毛', 'エイジング毛'];
const ADMIN_PASSWORD = '1919';

const App: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('USER');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [activeBrandId, setActiveBrandId] = useState<string | 'All'>('All');
  const [selectedHairTypes, setSelectedHairTypes] = useState<string[]>([]);
  
  // 調合ツールへの反映用ステート
  const [prefillIds, setPrefillIds] = useState<string[]>([]);
  
  // パスワード認証状態
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const savedBrands = localStorage.getItem('hpc_brands_st_v5');
    const savedLines = localStorage.getItem('hpc_lines_st_v5');
    const savedProducts = localStorage.getItem('hpc_products_st_v5');

    if (savedBrands && savedLines && savedProducts) {
      setBrands(JSON.parse(savedBrands));
      setLines(JSON.parse(savedLines));
      setProducts(JSON.parse(savedProducts));
    } else {
      setBrands(INITIAL_BRANDS);
      setLines(INITIAL_LINES);
      setProducts(INITIAL_PRODUCTS);
    }
    
    const auth = sessionStorage.getItem('hpc_admin_auth');
    if (auth === 'true') setIsAdminAuthenticated(true);
  }, []);

  useEffect(() => {
    if (brands.length > 0) localStorage.setItem('hpc_brands_st_v5', JSON.stringify(brands));
    if (lines.length > 0) localStorage.setItem('hpc_lines_st_v5', JSON.stringify(lines));
    if (products.length > 0) localStorage.setItem('hpc_products_st_v5', JSON.stringify(products));
  }, [brands, lines, products]);

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const toggleHairType = (type: string) => {
    setSelectedHairTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleApplyToMixer = () => {
    setPrefillIds([...selectedProductIds]);
    // 調合ツールのあるトップへスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 反映後に選択をリセットしたい場合は以下を有効化（今回は残す仕様）
    // setSelectedProductIds([]);
  };

  const filteredProducts = products.filter(p => {
    const brandMatch = activeBrandId === 'All' || p.brandId === activeBrandId;
    const hairTypeMatch = selectedHairTypes.length === 0 || 
      selectedHairTypes.some(type => p.targetHair.includes(type));
    return brandMatch && hairTypeMatch;
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem('hpc_admin_auth', 'true');
    } else {
      setAuthError(true);
      setPasswordInput('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar viewMode={viewMode} setViewMode={(mode) => {
        setViewMode(mode);
        if (mode === 'USER') setAuthError(false);
      }} />

      <main className="flex-grow container mx-auto px-3 py-4 md:py-8 max-w-5xl">
        {viewMode === 'USER' ? (
          <div className="space-y-8">
            {/* 薬剤調合シミュレーター */}
            <MixerTool 
              products={products} 
              brands={brands} 
              lines={lines} 
              prefillIds={prefillIds}
              onPrefillHandled={() => setPrefillIds([])}
            />

            {/* クイックフィルター */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
                <Filter className="w-4 h-4 text-indigo-500" />
                <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">対象毛フィルター</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {HAIR_TYPE_OPTIONS.map(type => (
                  <button 
                    key={type}
                    onClick={() => toggleHairType(type)}
                    className={`px-2 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                      selectedHairTypes.includes(type)
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 製品一覧エリア */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                   薬剤選択
                   {selectedProductIds.length > 0 && (
                     <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                       {selectedProductIds.length}件選択中
                     </span>
                   )}
                </h2>
                <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[60%]">
                  <button onClick={() => setActiveBrandId('All')} className={`text-[10px] font-black px-3 py-1.5 rounded-lg shrink-0 transition-all ${activeBrandId === 'All' ? 'text-indigo-600 bg-white shadow-sm ring-1 ring-slate-200' : 'text-slate-400'}`}>ALL</button>
                  {brands.map(b => (
                    <button key={b.id} onClick={() => setActiveBrandId(b.id)} className={`text-[10px] font-black px-3 py-1.5 rounded-lg shrink-0 transition-all ${activeBrandId === b.id ? 'text-indigo-600 bg-white shadow-sm ring-1 ring-slate-200' : 'text-slate-400'}`}>
                      {b.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <ProductList 
                products={filteredProducts} 
                brands={brands}
                lines={lines}
                selectedIds={selectedProductIds}
                onToggleSelect={toggleProductSelection}
              />
            </div>

            {/* 比較表セクション（常時表示、選択されたものだけを表示） */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-4 px-1">
                <Columns className="w-4 h-4 text-slate-400" />
                <h2 className="text-sm font-black text-slate-800">スペック詳細比較表</h2>
              </div>
              <ComparisonTable 
                products={products.filter(p => selectedProductIds.includes(p.id))}
                brands={brands}
                lines={lines}
              />
            </div>

            {/* コンパクトな下部フローティングアクションバー */}
            {selectedProductIds.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 pl-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                      <span className="text-xs font-black">{selectedProductIds.length}</span>
                    </div>
                    <div className="hidden xs:block">
                      <p className="text-[10px] font-black text-white leading-none uppercase tracking-widest">Selected</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5">薬剤を選択中</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedProductIds([])}
                      className="text-[10px] font-black text-slate-400 hover:text-white px-3 py-2 transition-colors uppercase tracking-widest"
                    >
                      解除
                    </button>
                    <button 
                      onClick={handleApplyToMixer}
                      className="bg-indigo-600 text-white px-5 py-3 rounded-xl text-[10px] font-black shadow-xl shadow-indigo-950/20 hover:bg-indigo-500 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      ツールに反映
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          isAdminAuthenticated ? (
            <AdminDashboard 
              brands={brands}
              lines={lines}
              products={products} 
              onUpdateBrands={setBrands}
              onUpdateLines={setLines}
              onUpdateProducts={setProducts}
            />
          ) : (
            <div className="max-w-md mx-auto mt-12 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-xl text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                  <Lock className="w-8 h-8 text-slate-300" />
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-2">管理者認証</h2>
                <p className="text-slate-500 text-[10px] mb-8 font-bold uppercase tracking-widest">
                  Secure Access Required
                </p>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="password"
                      autoFocus
                      placeholder="PASSWORD"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className={`w-full bg-slate-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-sm font-black focus:ring-2 transition-all text-center tracking-[0.5em] ${
                        authError ? 'ring-2 ring-red-500' : 'ring-indigo-500'
                      }`}
                    />
                  </div>
                  {authError && (
                    <p className="text-red-500 text-[10px] font-bold">認証に失敗しました。</p>
                  )}
                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white rounded-2xl py-4 text-xs font-black shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all uppercase tracking-widest"
                  >
                    ログイン
                  </button>
                </form>
                <button 
                  onClick={() => setViewMode('USER')}
                  className="mt-8 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                >
                  ビューへ戻る
                </button>
              </div>
            </div>
          )
        )}
      </main>

      <footer className="py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center">
             <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-[10px] font-black text-slate-900 tracking-widest uppercase">PROGLIA NOTE</span>
        </div>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          Professional Haircare Spec Data / 2025
        </p>
      </footer>
    </div>
  );
};

export default App;
