import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Heart, Droplets, Scale, X, Copy, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface FollowUpData {
  date: string;
  rxExpiry: string;
  reminderAdvanceDays: number;
}

interface HealthData {
  bp: string;
  bs: string;
  weight: string;
}

const calculateDaysLeft = (targetDateStr: string) => {
  if (!targetDateStr) return 0;
  const target = new Date(targetDateStr);
  const today = new Date();
  today.setHours(0,0,0,0);
  target.setHours(0,0,0,0);
  const diffTime = target.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

// Format date nicely (e.g. 2026年5月20日)
const formatDateZh = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${year}年${parseInt(month)}月${parseInt(day)}日`;
};

export default function DataPage() {
  const { meds } = useAppContext();
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpData, setFollowUpData] = useState<FollowUpData>(() => {
    const saved = localStorage.getItem('app_followup_data');
    return saved ? JSON.parse(saved) : { date: '2026-05-20', rxExpiry: '2026-05-02', reminderAdvanceDays: 3 };
  });
  const [tmpFollowUp, setTmpFollowUp] = useState<FollowUpData>(followUpData);

  const [showHealthDataModal, setShowHealthDataModal] = useState(false);
  const [healthData, setHealthData] = useState<HealthData>(() => {
    const saved = localStorage.getItem('app_health_data');
    return saved ? JSON.parse(saved) : { bp: '132/84', bs: '6.8', weight: '68' };
  });
  const [tmpHealth, setTmpHealth] = useState<HealthData>(healthData);

  const saveFollowUpData = () => {
    setFollowUpData(tmpFollowUp);
    localStorage.setItem('app_followup_data', JSON.stringify(tmpFollowUp));
    setShowFollowUpModal(false);
  };

  const saveHealthData = () => {
    setHealthData(tmpHealth);
    localStorage.setItem('app_health_data', JSON.stringify(tmpHealth));
    setShowHealthDataModal(false);
  };

  const handleCopy = () => {
    const medNames = meds.map(m => m.name).join('、') || '暂无用药记录';
    
    // Low stock calculation
    const stockInfo = meds.length > 0 
      ? meds.map(m => `${m.name}剩余 ${m.daysLeft}天`).join('，')
      : '暂无库存记录';

    const text = `复诊小抄
一、当前用药
${medNames}
二、近期服药情况
按时服药率92%，漏服3次
三、库存情况
${stockInfo}
四、健康记录
血压 ${healthData.bp} mmHg，空腹血糖 ${healthData.bs} mmol/L，体重 ${healthData.weight}kg
五、下次复诊
预计复诊日期：${formatDateZh(followUpData.date)}，处方剩余 ${calculateDaysLeft(followUpData.rxExpiry)} 天有效期
六、建议复诊时向医生确认的问题
1. 血糖控制是否有改善？
2. 当前用药是否需要调整？`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => alert('内容已复制到剪贴板！'));
    } else {
      alert('无法使用剪贴板');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto relative">
      <header className="px-6 py-4 shrink-0 flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900">健康数据</h1>
          <p className="text-lg text-slate-500 font-medium">服药统计与复诊提醒</p>
        </div>
      </header>

      <main className="flex-1 px-6 flex flex-col gap-6 pb-6 pt-2">
        <section className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">本月用药</h2>
            <Calendar className="text-blue-600" size={28} />
          </div>
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f8fafc" strokeWidth="12" fill="none" className="stroke-slate-200" />
                <circle cx="50" cy="50" r="40" stroke="#2563eb" strokeWidth="12" fill="none" strokeDasharray="231 251.2" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center filter drop-shadow-sm">
                <span className="text-3xl font-black text-blue-600">92%</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-rose-500 shadow-sm"></span>
                <span className="text-slate-600 font-bold text-lg">漏服 3 次</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-blue-600 shadow-sm"></span>
                <span className="text-slate-600 font-bold text-lg">连续打卡 7 天</span>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-2xl text-base font-medium">
            你的本月服药情况整体良好，请继续保持。
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 border-2 border-slate-100 flex flex-col gap-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-blue-600 mb-1 tracking-tight">下次复诊</h2>
              <p className="text-2xl text-slate-900 font-black">{formatDateZh(followUpData.date)}</p>
              <p className="text-rose-600 font-bold mt-1">（还有 {calculateDaysLeft(followUpData.date)} 天）</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="bg-rose-50 border-2 border-rose-100 text-rose-700 p-4 rounded-2xl flex items-center gap-3 font-bold">
            <AlertTriangle size={20} className="shrink-0 text-rose-500" /> 
            <span>处方预计 {calculateDaysLeft(followUpData.rxExpiry)} 天后到期</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button onClick={() => setShowSummaryModal(true)} className="w-full bg-blue-600 text-white h-14 rounded-2xl font-bold shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform text-lg">
              <FileText size={22} /> 生成复诊小抄
            </button>
            <button 
              onClick={() => {
                setTmpFollowUp(followUpData);
                setShowFollowUpModal(true);
              }} 
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-700 h-14 rounded-2xl font-bold active:bg-slate-100 transition-colors text-lg"
            >
              设置复诊时间
            </button>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">最近健康记录</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => {
                setTmpHealth(healthData);
                setShowHealthDataModal(true);
              }}
              className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100 flex flex-col items-center gap-3 active:border-blue-500 transition-colors group"
            >
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center group-active:bg-rose-100 transition-colors">
                <Heart className="text-rose-500" size={24} />
              </div>
              <span className="text-slate-500 font-bold">血压</span>
              <span className="text-2xl font-black text-slate-900">{healthData.bp}</span>
            </button>
            <button 
               onClick={() => {
                setTmpHealth(healthData);
                setShowHealthDataModal(true);
              }}
              className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100 flex flex-col items-center gap-3 active:border-blue-500 transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-active:bg-blue-100 transition-colors">
                <Droplets className="text-blue-500" size={24} />
              </div>
              <span className="text-slate-500 font-bold">血糖</span>
              <span className="text-2xl font-black text-slate-900">{healthData.bs}</span>
            </button>
            <button 
               onClick={() => {
                setTmpHealth(healthData);
                setShowHealthDataModal(true);
              }}
              className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100 flex flex-col items-center gap-3 active:border-blue-500 transition-colors group"
            >
               <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center group-active:bg-indigo-100 transition-colors">
                <Scale className="text-indigo-500" size={24} />
              </div>
              <span className="text-slate-500 font-bold">体重</span>
              <span className="text-2xl font-black text-slate-900">{healthData.weight}</span>
            </button>
          </div>
        </section>
      </main>

      {/* Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex py-10 px-4 justify-center overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 flex flex-col m-auto relative shadow-2xl">
            <button onClick={() => setShowSummaryModal(false)} className="absolute top-4 right-4 text-slate-400 p-2">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="text-blue-600" /> 复诊小抄
            </h2>
            
            <div className="flex flex-col gap-5 text-slate-800 text-sm mb-8 pr-2">
              <div>
                <h3 className="font-bold text-blue-800 text-base mb-1">一、当前用药</h3>
                <p>{meds.map(m => m.name).join('、') || '暂无用药记录'}</p>
              </div>
              <div>
                <h3 className="font-bold text-blue-800 text-base mb-1">二、近期服药情况</h3>
                <p>按时服药率 <strong className="text-emerald-600">92%</strong>，漏服 <strong className="text-rose-500">3次</strong></p>
              </div>
              <div>
                <h3 className="font-bold text-blue-800 text-base mb-1">三、库存情况</h3>
                {meds.length > 0 ? meds.map(m => (
                  <p key={m.id}>{m.name}剩余 <strong className={m.daysLeft <= 7 ? "text-rose-500" : ""}>{m.daysLeft}天</strong></p>
                )) : <p>暂无库存记录</p>}
              </div>
              <div>
                <h3 className="font-bold text-blue-800 text-base mb-1">四、健康记录</h3>
                <p>血压: {healthData.bp} mmHg</p>
                <p>空腹血糖: {healthData.bs} mmol/L</p>
                <p>体重: {healthData.weight} kg</p>
              </div>
              <div>
                <h3 className="font-bold text-blue-800 text-base mb-1">五、建议交流问题</h3>
                <p>1. 血糖控制是否有改善？</p>
                <p>2. 当前用药是否需要调整？</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={handleCopy} className="w-full bg-blue-600 text-white h-14 rounded-2xl font-bold text-lg shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <Copy size={20} /> 复制内容
              </button>
              <button onClick={() => setShowSummaryModal(false)} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-700 h-14 rounded-2xl font-bold text-lg active:bg-slate-100 transition-colors">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Setup Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex py-10 px-4 justify-center overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 flex flex-col m-auto relative shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-6">设置复诊时间</h2>
            <div className="flex flex-col gap-5 mb-6">
              <div>
                <label className="block text-slate-700 font-bold mb-2">下次复诊日期</label>
                <input 
                  type="date" 
                  value={tmpFollowUp.date} 
                  onChange={e => setTmpFollowUp({...tmpFollowUp, date: e.target.value})} 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2">处方到期日期</label>
                <input 
                  type="date" 
                  value={tmpFollowUp.rxExpiry} 
                  onChange={e => setTmpFollowUp({...tmpFollowUp, rxExpiry: e.target.value})} 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2">提前提醒天数</label>
                <input 
                  type="number" 
                  value={tmpFollowUp.reminderAdvanceDays} 
                  onChange={e => setTmpFollowUp({...tmpFollowUp, reminderAdvanceDays: parseInt(e.target.value) || 0})} 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowFollowUpModal(false)} 
                className="bg-slate-50 border-2 border-slate-200 text-slate-600 rounded-2xl py-4 font-bold text-lg active:scale-95 transition-transform"
              >
                取消
              </button>
              <button 
                onClick={saveFollowUpData} 
                className="bg-blue-600 text-white rounded-2xl py-4 font-bold text-lg shadow-md active:scale-95 transition-transform"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Health Data Setup Modal */}
      {showHealthDataModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex py-10 px-4 justify-center overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 flex flex-col m-auto relative shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-6">编辑健康记录</h2>
            <div className="flex flex-col gap-5 mb-6">
              <div>
                <label className="block text-slate-700 font-bold mb-2">血压 (mmHg)</label>
                <input 
                  type="text" 
                  value={tmpHealth.bp} 
                  onChange={e => setTmpHealth({...tmpHealth, bp: e.target.value})} 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                  placeholder="例如: 132/84" 
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2">空腹血糖 (mmol/L)</label>
                <input 
                  type="text" 
                  value={tmpHealth.bs} 
                  onChange={e => setTmpHealth({...tmpHealth, bs: e.target.value})} 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                  placeholder="例如: 6.8" 
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2">体重 (kg)</label>
                <input 
                  type="text" 
                  value={tmpHealth.weight} 
                  onChange={e => setTmpHealth({...tmpHealth, weight: e.target.value})} 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                  placeholder="例如: 68" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowHealthDataModal(false)} 
                className="bg-slate-50 border-2 border-slate-200 text-slate-600 rounded-2xl py-4 font-bold text-lg active:scale-95 transition-transform"
              >
                取消
              </button>
              <button 
                onClick={saveHealthData} 
                className="bg-blue-600 text-white rounded-2xl py-4 font-bold text-lg shadow-md active:scale-95 transition-transform"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

