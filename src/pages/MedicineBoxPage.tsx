import React, { useState } from 'react';
import { AlertCircle, PlusCircle, Camera, AlertTriangle, ScanLine, X } from 'lucide-react';
import { useAppContext, Medication } from '../context/AppContext';

export default function MedicineBoxPage() {
  const { meds, addMed } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  // Stats
  const lowStockMeds = meds.filter(m => m.status === 'low_stock');

  // Add Med Form State
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('1片');
  const [newMedFreq, setNewMedFreq] = useState('1');
  const [newMedStock, setNewMedStock] = useState('30');

  const handleAddMed = () => {
    if (!newMedName) return;
    const stockNum = parseInt(newMedStock) || 0;
    const freqNum = parseInt(newMedFreq) || 1;
    const newMed: Medication = {
      id: Date.now().toString(),
      name: newMedName,
      dose: newMedDose,
      frequency: freqNum,
      stock: stockNum,
      unit: newMedDose.replace(/[0-9]/g, '') || '片',
      daysLeft: Math.floor(stockNum / freqNum),
      status: 'normal'
    };
    addMed(newMed);
    setShowAddModal(false);
    setNewMedName('');
  };

  const handleAIConfirm = () => {
    addMed({
      id: Date.now().toString(),
      name: '二甲双胍片 (AI识别)',
      dose: '1片',
      frequency: 2,
      stock: 24,
      unit: '片',
      daysLeft: 12,
      status: 'normal'
    });
    setShowAIModal(false);
    alert('已加入药箱');
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto relative">
      <header className="px-6 py-4 shrink-0 flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900">云药箱</h1>
          <p className="text-lg text-slate-500 font-medium">管理你的常用药与库存</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mt-2 active:scale-95 transition-transform">
          <PlusCircle size={28} />
        </button>
      </header>

      <main className="flex-1 px-6 flex flex-col gap-6 pb-6 pt-2">
        {/* Overview Stats */}
        <section className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-100">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col items-center">
              <span className="text-slate-500 font-bold mb-1">药品数量</span>
              <span className="text-3xl font-black text-blue-600">{meds.length}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-slate-500 font-bold mb-1">低库存</span>
              <span className="text-3xl font-black text-rose-500">{lowStockMeds.length}</span>
            </div>
          </div>
          {lowStockMeds.length > 0 && (
            <div className="bg-white p-4 rounded-2xl flex items-start gap-3 shadow-sm border border-slate-100">
              <AlertCircle className="text-rose-500 shrink-0" size={24} />
              <p className="text-slate-700 font-medium">有 <strong className="text-rose-500">{lowStockMeds.length}</strong> 种常用药库存不足，建议及时补购。</p>
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <section className="flex gap-3">
          <button onClick={() => setShowAddModal(true)} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform text-lg">
            添加药品
          </button>
          <button onClick={() => setShowAIModal(true)} className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform text-lg">
            拍照处方
          </button>
        </section>

        {/* Main Alert Card */}
        {lowStockMeds.length > 0 && (
          <section className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-rose-900 font-bold text-xl mb-1">库存不足提醒</h3>
                <p className="text-rose-800 text-lg">{lowStockMeds[0].name}预计 {lowStockMeds[0].daysLeft} 天后用完，请及时续方</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-rose-500 text-white font-bold py-3.5 rounded-xl text-lg shadow-md active:scale-95 transition-transform">去续方</button>
              <button className="bg-white text-rose-600 font-bold py-3.5 rounded-xl text-lg active:scale-95 transition-transform">稍后提醒</button>
            </div>
          </section>
        )}

        {/* Medicine List */}
        <section className="space-y-4">
          {meds.map(med => (
            <div key={med.id} className="bg-white border-2 border-slate-100 rounded-3xl p-5 transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-slate-800">{med.name}</h3>
                {med.status === 'low_stock' && <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-lg text-sm font-bold">库存预警</span>}
                {med.status === 'normal' && <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-sm font-bold">正常</span>}
              </div>
              <p className="text-slate-500 text-lg font-medium mb-4">剩余: <span className="font-bold text-slate-700">{med.stock}</span> {med.unit} (约 {med.daysLeft}天)</p>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${med.status === 'low_stock' ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${Math.min(100, Math.max(5, (med.daysLeft / 30) * 100))}%` }}
                ></div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex py-10 px-4 justify-center overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col m-auto relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">添加药品</h2>
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400 p-2">
              <X size={24} />
            </button>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">药品名称</label>
                <input value={newMedName} onChange={e => setNewMedName(e.target.value)} type="text" className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none" placeholder="如：二甲双胍片" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">每次剂量</label>
                  <input value={newMedDose} onChange={e => setNewMedDose(e.target.value)} type="text" className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none" placeholder="1片" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">每日次数</label>
                  <input value={newMedFreq} onChange={e => setNewMedFreq(e.target.value)} type="number" className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none" placeholder="2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">当前库存总量 (片/粒)</label>
                <input value={newMedStock} onChange={e => setNewMedStock(e.target.value)} type="number" className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none" placeholder="30" />
              </div>
              <button onClick={handleAddMed} className="w-full bg-blue-600 text-white h-14 rounded-xl font-bold text-lg mt-4 shadow-md active:scale-95 transition-transform">
                保存药品
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Recognition Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex py-10 px-4 justify-center overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col m-auto relative">
            <button onClick={() => setShowAIModal(false)} className="absolute top-4 right-4 text-gray-400 p-2">
              <X size={24} />
            </button>
            <div className="flex items-center gap-2 mb-6">
              <ScanLine className="text-blue-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">AI 识别结果</h2>
            </div>
            
            <div className="grid grid-cols-[100px_1fr] gap-y-4 mb-8">
              <div className="text-gray-500 font-bold">识别药品</div>
              <div className="text-gray-900 font-bold text-lg">二甲双胍片</div>
              
              <div className="text-gray-500 font-bold">识别规格</div>
              <div className="text-gray-900 font-bold">0.5g × 24片</div>
              
              <div className="text-gray-500 font-bold">录入数量</div>
              <div className="text-gray-900 font-bold">1 盒</div>
              
              <div className="text-gray-500 font-bold">建议用法</div>
              <div className="text-gray-900 font-bold">每日 2 次，每次 1 片</div>
            </div>

            <button onClick={handleAIConfirm} className="w-full bg-blue-600 text-white h-14 rounded-xl font-bold text-lg shadow-md active:scale-95 transition-transform">
              确认加入药箱
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
