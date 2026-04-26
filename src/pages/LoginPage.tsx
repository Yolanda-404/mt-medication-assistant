import React, { useState, useEffect } from 'react';
import { Heart, Smartphone, MessageCircle, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const FOCUS_OPTIONS = ['血压', '血糖', '血脂', '心脏用药', '其他长期用药'];

export default function LoginPage() {
  const { login } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [existingUser, setExistingUser] = useState<any>(null);
  
  // Profile form state for new users
  const [profileForm, setProfileForm] = useState({
    name: '王阿姨',
    phone: '',
    focusAreas: [] as string[],
    allergy: '无',
    hospital: '市人民医院'
  });

  useEffect(() => {
    const stored = localStorage.getItem('chronic_med_demo_user');
    if (stored) {
      setExistingUser(JSON.parse(stored));
    }
  }, []);

  const handleLoginClick = () => {
    if (existingUser) {
      // If we already have a user, just login directly using existing profile
      login(existingUser.phone || '未提供', 'myself');
    } else {
      setShowModal(true);
    }
  };
  
  const handleCreateProfileAndLogin = () => {
    const newUser = {
      ...profileForm,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('chronic_med_demo_user', JSON.stringify(newUser));
    login(newUser.phone || '未提供', 'myself');
  };

  const toggleFocusArea = (area: string) => {
    const areas = [...profileForm.focusAreas];
    if (areas.includes(area)) {
      setProfileForm({ ...profileForm, focusAreas: areas.filter(a => a !== area) });
    } else {
      setProfileForm({ ...profileForm, focusAreas: [...areas, area] });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto pb-8 relative">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shrink-0">
        <div className="flex items-center gap-2">
          <Heart className="text-blue-600" size={28} />
          <span className="text-2xl font-black text-slate-900 tracking-tight">用药小管家</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pt-2 flex flex-col gap-6">
        {/* Branding & Graphic */}
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-28 h-28 rounded-full bg-blue-50 flex items-center justify-center mb-2">
            <Heart className="text-blue-600" size={56} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">慢病用药小管家</h1>
          <p className="text-lg text-slate-500 font-medium">帮你记住吃药、补药和复诊</p>
        </div>

        {/* Login Section */}
        <div className="flex flex-col mt-2 gap-4">
          {existingUser ? (
            <button 
              onClick={handleLoginClick}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <User size={24} />
              继续使用 {existingUser.name} 的本地档案
            </button>
          ) : (
            <>
              <button 
                onClick={() => setShowModal(true)}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Smartphone size={24} />
                手机号快捷进入
              </button>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-emerald-50 text-emerald-600 font-bold py-3.5 rounded-2xl text-lg active:scale-95 transition-transform flex items-center justify-center gap-2 border border-emerald-100"
                >
                  <MessageCircle size={22} className="text-emerald-500" />
                  微信一键进入
                </button>
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-slate-50 text-slate-600 font-bold py-3.5 rounded-2xl text-lg active:scale-95 transition-transform flex items-center justify-center border border-slate-200"
                >
                  先体验一下
                </button>
              </div>
            </>
          )}
          
          {existingUser && (
            <button 
              onClick={() => {
                setExistingUser(null);
                setShowModal(true);
              }}
              className="mt-4 text-slate-500 font-semibold underline underline-offset-4"
            >
              创建新档案
            </button>
          )}
        </div>

      </main>
      
      {/* Footer */}
      <footer className="mt-8 py-4 flex justify-center items-center">
        <p className="text-sm text-slate-400 font-medium text-center">
          登录即表示同意<a href="#" className="text-blue-500 hover:underline">用户协议</a>与<a href="#" className="text-blue-500 hover:underline">隐私说明</a>
        </p>
      </footer>

      {/* Create Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex flex-col justify-end sm:justify-center sm:px-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 flex flex-col mx-auto relative animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-2">创建本地档案</h2>
            <p className="text-slate-500 font-medium mb-6 leading-relaxed">
              用于保存你的用药计划、提醒设置和复诊记录，当前 Demo 数据仅保存在本地浏览器。
            </p>
            
            <div className="flex flex-col gap-5 mb-8">
              <div>
                <label className="block text-slate-700 font-bold mb-2">昵称 / 姓名</label>
                <input 
                  type="text" 
                  value={profileForm.name} 
                  onChange={e => setProfileForm({...profileForm, name: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2">手机号 (可选)</label>
                <input 
                  type="tel" 
                  value={profileForm.phone} 
                  onChange={e => setProfileForm({...profileForm, phone: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                  placeholder="请输入手机号"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2">重点关注方向 (多选)</label>
                <div className="flex flex-wrap gap-2">
                  {FOCUS_OPTIONS.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => toggleFocusArea(opt)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${profileForm.focusAreas.includes(opt) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-auto">
              <button 
                onClick={handleCreateProfileAndLogin} 
                disabled={!profileForm.name}
                className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold text-lg shadow-md active:scale-95 transition-transform disabled:opacity-50"
              >
                进入用药小管家
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-full bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl py-4 font-bold text-lg active:scale-95 transition-transform"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
