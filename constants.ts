
import { Brand, Line, Product } from './types';

export const INITIAL_BRANDS: Brand[] = [
  { id: 'b1', name: 'ミルボン (MILBON)', description: '美容業界最大手メーカー' },
  { id: 'b2', name: 'アリミノ (ARIMINO)', description: 'クオラインなどの人気ブランドを展開' },
  { id: 'b3', name: 'ルベル (LebeL)', description: 'タカラベルモントの美容ブランド' }
];

export const INITIAL_LINES: Line[] = [
  { id: 'l1', brandId: 'b1', name: 'ネオリシオ', description: '熱ダメージ抑制と柔らかい仕上がり' },
  { id: 'l2', brandId: 'b2', name: 'クオライン', description: '多彩なクセに対応するハイブリッド処方' },
  { id: 'l3', brandId: 'b3', name: 'HITA (ヒタ)', description: '潤いのあるストレートへ' }
];

export const INITIAL_PRODUCTS: Product[] = [
  // ミルボン ネオリシオ
  {
    id: 'p1', brandId: 'b1', lineId: 'l1', name: 'SH (スーパーハード)', description: '強撥水毛・強いクセに。',
    specs: [
      { id: 's2', label: 'pH', value: '9.3' },
      { id: 's3', label: 'アルカリ度', value: '6.5' },
      { id: 's3-1', label: '総還元力', value: '11.0' },
      { id: 's3-2', label: 'アルカリ成分', value: 'アンモニア' },
      { id: 's1', label: '還元成分', value: 'チオグリコール酸' }
    ],
    targetHair: ['強いクセ毛', '健康毛']
  },
  {
    id: 'p2', brandId: 'b1', lineId: 'l1', name: 'H (ハード)', description: '標準的なクセに。',
    specs: [
      { id: 's5', label: 'pH', value: '9.1' },
      { id: 's6', label: 'アルカリ度', value: '4.5' },
      { id: 's6-1', label: '総還元力', value: '9.0' },
      { id: 's6-2', label: 'アルカリ成分', value: 'アンモニア' },
      { id: 's4', label: '還元成分', value: 'チオグリコール酸' }
    ],
    targetHair: ['標準的なクセ毛', '普通毛']
  },
  {
    id: 'p3', brandId: 'b1', lineId: 'l1', name: 'N (ノーマル)', description: '弱いクセ、ダメージがある場合に。',
    specs: [
      { id: 's8', label: 'pH', value: '8.8' },
      { id: 's9', label: 'アルカリ度', value: '3.0' },
      { id: 's9-1', label: '総還元力', value: '7.0' },
      { id: 's9-2', label: 'アルカリ成分', value: 'MEA' },
      { id: 's7', label: '還元成分', value: 'チオグリコール酸' }
    ],
    targetHair: ['細毛', 'ダメージ毛']
  },

  // アリミノ クオライン
  {
    id: 'p4', brandId: 'b2', lineId: 'l2', name: 'T-250 (スーパーハード)', description: '最も強い還元力。',
    specs: [
      { id: 's11', label: 'pH', value: '9.4' },
      { id: 's12', label: 'アルカリ度', value: '6.0' },
      { id: 's12-1', label: '総還元力', value: '12.0' },
      { id: 's12-2', label: 'アルカリ成分', value: 'アルギニン、MEA' },
      { id: 's10', label: '還元成分', value: 'チオグリコール酸、システイン' }
    ],
    targetHair: ['強いクセ毛', 'ブリーチ毛']
  },
  {
    id: 'p5', brandId: 'b2', lineId: 'l2', name: '200 (ハード)', description: 'バランス重視。',
    specs: [
      { id: 's14', label: 'pH', value: '9.2' },
      { id: 's15', label: 'アルカリ度', value: '4.8' },
      { id: 's15-1', label: '総還元力', value: '10.0' },
      { id: 's15-2', label: 'アルカリ成分', value: 'アルギニン、MEA' },
      { id: 's13', label: '還元成分', value: 'チオグリコール酸、システイン' }
    ],
    targetHair: ['標準的なクセ毛', 'エイジング毛']
  }
];
