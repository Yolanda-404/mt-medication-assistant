import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Pill, Sun, Coffee, Utensils, Moon, Edit3, X, Trash2, Plus } from 'lucide-react';
import { useAppContext, Plan } from '../context/AppContext';

export default function TodayPage() {
  const { plans, takeMed, missMed, snoozeMed, updatePlan, addPlan, removePlan } = useAppContext();
  
  const totalPlans = plans.length;
  const completedPlans = plans.filter(p => p.status === 'taken').length;
  const pendingPlans = totalPlans - completedPlans;
  const progress = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0;

  const missedPlan = plans.find(p => p.status === 'missed');

  const [modalMode, setModalMode] = useState<'none' | 'list' | 'edit' | 'add'>('none');
  const [editingPlanId, setEditingPlanId] = useState<string>('');
  const [editFormData, setEditFormData] = useState({ name: '', dose: '', period: '', instructions: '' });
  const [periodSelect, setPeriodSelect] = useState('晨起');

  const periodOptions = ['晨起', '早餐前', '早餐后', '午餐前', '午餐后', '晚饭前', '晚饭后', '睡前', '自定义'];

  const openListModal = () => {
    setModalMode('list');
  };

  const openEditForm = (plan: Plan) => {
    setEditingPlanId(plan.id);
    const p = periodOptions.includes(plan.period) ? plan.period : '自定义';
    setPeriodSelect(p);
    setEditFormData({ 
      name: plan.name, 
      dose: plan.dose, 
      period: plan.period, 
      instructions: (plan as any).instructions || '' 
    });
    setModalMode('edit');
  };

  const openAddForm = () => {
    setEditFormData({ name: '', dose: '', period: '晨起', instructions: '' });
    setPeriodSelect('晨起');
    setModalMode('add');
  };

  const handleDelete = (planId: string) => {
    if (window.confirm("确定删除这条用药计划吗？")) {
      removePlan(planId);
    }
  };

  const savePlan = () => {
    if (modalMode === 'edit' && editingPlanId) {
      updatePlan(editingPlanId, { 
        name: editFormData.name, 
        dose: editFormData.dose, 
        period: editFormData.period,
        instructions: editFormData.instructions
      } as any);
    } else if (modalMode === 'add') {
      addPlan({
        name: editFormData.name,
        dose: editFormData.dose,
        period: editFormData.period,
        instructions: editFormData.instructions,
        status: 'pending',
        timeStr: '12:00',
        medId: `med-custom-${Date.now()}`
      } as any);
    }
    setModalMode('list');
  };

  const getPeriodIcon = (period: string) => {
    if (period.includes('晨')) return <Sun size={20} className="text-gray-400" />;
    if (period.includes('早')) return <Coffee size={20} className="text-gray-400" />;
    if (period.includes('午')) return <Utensils size={20} className="text-gray-400" />;
    if (period.includes('晚')) return <Utensils size={20} className="text-gray-400" />;
    if (period.includes('睡前')) return <Moon size={20} className="text-gray-400" />;
    return <Pill size={20} className="text-gray-400" />;
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Top Header */}
      <header className="px-6 py-4 shrink-0">
        <div className="flex justify-between items-end mb-1">
          <h1 className="text-3xl font-black text-slate-900">用药小管家</h1>
          <div className="flex flex-col items-end gap-2">
            <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full text-sm">今日计划</span>
            <button onClick={openListModal} className="flex items-center gap-1 text-slate-500 font-bold text-sm bg-slate-50 px-3 py-1 rounded-lg active:scale-95 transition-transform">
              <Edit3 size={14} /> 编辑计划
            </button>
          </div>
        </div>
        <p className="text-slate-500 text-lg font-medium">4月26日 星期六</p>
      </header>

      <main className="flex-1 px-6 flex flex-col pt-2 pb-6">
        {/* Missed Plan Alert */}
        {missedPlan && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-5 mb-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-white" size={20} strokeWidth={3} />
              </div>
              <h2 className="text-xl font-bold text-rose-900">1 项用药已超时</h2>
            </div>
            <p className="text-rose-800 text-lg mb-4">早餐后{missedPlan.name}尚未记录</p>
            <button 
              onClick={() => takeMed(missedPlan.id)}
              className="w-full bg-rose-500 text-white text-xl font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              立即处理
            </button>
          </div>
        )}

        {/* Status Card */}
        <div className="bg-blue-600 rounded-3xl p-6 mb-6 shadow-lg flex justify-between items-center">
          <div className="text-white">
            <p className="text-blue-100 text-lg">今日计划进度</p>
            <h3 className="text-4xl font-black">{progress}%</h3>
            <p className="text-blue-100 mt-1 font-medium">待完成 {pendingPlans} 次</p>
          </div>
          <div className="w-24 h-24 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="stroke-blue-700 fill-none stroke-[4]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path 
                className="stroke-white fill-none stroke-[4]" 
                strokeLinecap="round" 
                strokeDasharray={`${(progress / 100) * 100}, 100`} 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
            </svg>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {plans.map((plan) => {
            if (plan.status === 'taken') {
              return (
                <div key={plan.id} className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-5 flex items-center justify-between">
                  <div className="flex space-x-4 items-center">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
                      <CheckCircle2 size={24} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm font-bold uppercase">{plan.period}</p>
                      <h4 className="text-xl font-bold text-slate-800">{plan.name}</h4>
                      <p className="text-slate-500 font-medium">{plan.dose} · {(plan as any).instructions || '已服药'}</p>
                    </div>
                  </div>
                </div>
              );
            }

            if (plan.status === 'missed') {
              return (
                <div key={plan.id} className="bg-white border-4 border-blue-500 rounded-3xl p-5 shadow-xl ring-2 ring-blue-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-blue-600 text-sm font-bold uppercase">{plan.period}</p>
                      <h4 className="text-2xl font-bold text-slate-900">{plan.name}</h4>
                      <p className="text-slate-600 text-lg font-medium">{plan.dose} · {(plan as any).instructions || '需补服'}</p>
                    </div>
                    <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-lg text-sm font-bold">超时</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => takeMed(plan.id)} className="bg-blue-600 text-white font-bold py-4 rounded-xl text-lg shadow-md active:scale-95 transition-transform">现在补服</button>
                    <button onClick={() => missMed(plan.id)} className="bg-slate-100 text-slate-600 font-bold py-4 rounded-xl text-lg active:scale-95 transition-transform">记录漏服</button>
                  </div>
                </div>
              );
            }

            if (plan.status === 'pending') {
              return (
                <div key={plan.id} className="bg-white border-2 border-slate-100 rounded-3xl p-5 flex flex-col opacity-90">
                  <div className="flex space-x-4 items-center mb-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                      {getPeriodIcon(plan.period)}
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-bold uppercase">{plan.period}</p>
                      <h4 className="text-xl font-bold text-slate-800">{plan.name}</h4>
                      <p className="text-slate-500 font-medium">{plan.dose} · {(plan as any).instructions || '待服药'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => takeMed(plan.id)} className="bg-blue-600 text-white font-bold py-3 rounded-xl text-lg shadow-md active:scale-95 transition-transform">确认已服</button>
                    <button onClick={() => snoozeMed(plan.id)} className="bg-slate-100 text-slate-600 font-bold py-3 rounded-xl text-lg active:scale-95 transition-transform">稍后提醒</button>
                  </div>
                </div>
              );
            }

            if (plan.status === 'snoozed') {
              return (
                <div key={plan.id} className="bg-amber-50 border-2 border-amber-100 rounded-3xl p-5 flex flex-col">
                  <div className="flex space-x-4 items-center mb-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 shrink-0">
                      <Pill size={24} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-amber-600 text-sm font-bold uppercase">{plan.period}</p>
                      <h4 className="text-xl font-bold text-slate-800">{plan.name}</h4>
                      <p className="text-amber-700 font-medium">{plan.dose} · {(plan as any).instructions || '稍后提醒'}</p>
                    </div>
                  </div>
                  <button onClick={() => takeMed(plan.id)} className="bg-blue-600 text-white font-bold py-3 rounded-xl text-lg shadow-md active:scale-95 transition-transform">确认已服</button>
                </div>
              );
            }

            return null;
          })}
        </div>
      </main>

      {/* Modals */}
      {modalMode !== 'none' && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex py-10 px-4 justify-center overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 flex flex-col m-auto relative shadow-2xl">
            
            {modalMode === 'list' && (
              <>
                <h2 className="text-2xl font-black text-slate-900 mb-6">编辑用药计划</h2>
                <div className="flex flex-col gap-4 mb-6 max-h-[50vh] overflow-y-auto pr-2">
                  {plans.length > 0 ? plans.map(p => (
                    <div key={p.id} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-blue-600 font-bold text-sm mb-1">{p.period}</p>
                          <h4 className="text-xl font-bold text-slate-900">{p.name}</h4>
                          <p className="text-slate-600 font-medium">{p.dose} · {(p as any).instructions || '无'}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => handleDelete(p.id)} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm active:scale-95 transition-transform flex items-center gap-1">
                          <Trash2 size={16} /> 删除
                        </button>
                        <button onClick={() => openEditForm(p)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm active:scale-95 transition-transform flex items-center gap-1">
                          <Edit3 size={16} /> 编辑
                        </button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-slate-500 font-medium text-center py-4">暂无用药计划，请添加。</p>
                  )}
                </div>
                <div className="flex flex-col gap-3 mt-auto">
                  <button onClick={openAddForm} className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold text-lg shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <Plus size={20} /> 添加药品
                  </button>
                  <button onClick={() => setModalMode('none')} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl py-4 font-bold text-lg active:bg-slate-100 transition-transform">
                    关闭
                  </button>
                </div>
              </>
            )}

            {(modalMode === 'edit' || modalMode === 'add') && (
              <>
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  {modalMode === 'edit' ? '编辑药品计划' : '添加药品计划'}
                </h2>
                <div className="flex flex-col gap-5 mb-6">
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">药品名称</label>
                    <input 
                      type="text" 
                      value={editFormData.name} 
                      onChange={e => setEditFormData({...editFormData, name: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                      placeholder="例如: 降压药"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">剂量</label>
                    <input 
                      type="text" 
                      value={editFormData.dose} 
                      onChange={e => setEditFormData({...editFormData, dose: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                      placeholder="例如: 1粒"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">用药时段</label>
                    <select 
                      value={periodSelect} 
                      onChange={e => {
                        setPeriodSelect(e.target.value);
                        if (e.target.value !== '自定义') {
                          setEditFormData({...editFormData, period: e.target.value});
                        } else {
                          setEditFormData({...editFormData, period: ''});
                        }
                      }} 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 font-bold text-lg outline-none focus:border-blue-500 transition-all appearance-none"
                    >
                      {periodOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  {periodSelect === '自定义' && (
                    <div>
                      <label className="block text-slate-700 font-bold mb-2">自定义时段</label>
                      <input 
                        type="text" 
                        value={editFormData.period} 
                        onChange={e => setEditFormData({...editFormData, period: e.target.value})} 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                        placeholder="例如: 运动后"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">用药说明</label>
                    <input 
                      type="text" 
                      value={editFormData.instructions} 
                      onChange={e => setEditFormData({...editFormData, instructions: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                      placeholder="例如: 随餐服用, 空腹服用等" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button 
                    onClick={() => setModalMode('list')} 
                    className="bg-slate-50 border-2 border-slate-200 text-slate-600 rounded-2xl py-4 font-bold text-lg active:scale-95 transition-transform"
                  >
                    取消
                  </button>
                  <button 
                    onClick={savePlan} 
                    disabled={!editFormData.name || !editFormData.period || !editFormData.dose}
                    className="bg-blue-600 text-white rounded-2xl py-4 font-bold text-lg shadow-md active:scale-95 transition-transform disabled:opacity-50"
                  >
                    保存
                  </button>
                </div>
              </>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
