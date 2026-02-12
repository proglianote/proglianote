
import React from 'react';
import { ViewMode } from '../types';
import { Scissors, Settings, User, MessageCircle, ExternalLink, NotepadText } from 'lucide-react';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ viewMode, setViewMode }) => {
  /**
   * 💡 ここにご自身のGoogleフォームのURLを貼り付けてください
   */
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/your-form-id/viewform";

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* ロゴセクション */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <NotepadText className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-widest text-slate-900 leading-none">PROGLIA NOTE</span>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 hidden xs:block">Proglia Note spec pro</span>
          </div>
        </div>

        {/* モード切替・お問い合わせセクション */}
        <div className="flex items-center bg-slate-100 rounded-2xl p-1 gap-1 border border-slate-200">
          {/* 比較ビューボタン */}
          <button
            onClick={() => setViewMode('USER')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
              viewMode === 'USER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">スペック比較</span>
          </button>

          {/* お問い合わせ（Googleフォーム）ボタン */}
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 hover:text-indigo-600 hover:bg-white/80 transition-all uppercase tracking-widest border border-transparent hover:border-slate-200"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">お問い合わせ</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-30" />
          </a>

          {/* 管理画面ボタン */}
          <button
            onClick={() => setViewMode('ADMIN')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
              viewMode === 'ADMIN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">管理</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
