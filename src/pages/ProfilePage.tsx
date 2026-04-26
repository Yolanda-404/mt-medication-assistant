import React, { useState, useEffect } from 'react';
import { User, Bell, FileText, Shield, Trash2, ChevronRight, CheckCircle2, Settings, X, Plus, LogOut, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// Default reminder settings
const defaultReminders = {
  medication: true,
  missed: true,
  stock: true,
  revisit: true,
  expiry: true
};

// Default user profile
const defaultUserProfile = {
  name: "王阿姨",
  age: "63",
  phone: "138****1234",
  manageMode: "self",
  focusAreas: ["血压", "血糖"],
  allergy: "无",
  hospital: "市人民医院",
  createdAt: new Date().toISOString()
};

const FOCUS_OPTIONS = ['血压', '血糖', '血脂', '心脏用药', '其他长期用药'];

export default function ProfilePage() {
  const { user, settings, updateSettings, logout, clearData } = useAppContext();

  const [modal, setModal] = useState<'none' | 'profile' | 'privacy'>('none');
  const [toastMessage, setToastMessage] = useState('');
  
  // Local state for reminders and profile
  const [reminders, setReminders] = useState(defaultReminders);
  const [profile, setProfile] = useState(defaultUserProfile);
  
  // Local form state
  const [profileForm, setProfileForm] = useState(defaultUserProfile);

  // Initialize from localStorage
  useEffect(() => {
    const storedReminders = localStorage.getItem('chronic_med_demo_reminder_settings');
    if (storedReminders) {
      setReminders(JSON.parse(storedReminders));
    } else {
      localStorage.setItem('chronic_med_demo_reminder_settings', JSON.stringify(defaultReminders));
      setReminders(defaultReminders);
    }

    const storedProfile = localStorage.getItem('chronic_med_demo_user');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      localStorage.setItem('chronic_med_demo_user', JSON.stringify(defaultUserProfile));
      setProfile(defaultUserProfile);
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogout = () => {
    logout();
  };

  const handleClearData = () => {
    if (window.confirm('确定清除本地数据吗？')) {
      clearData();
      localStorage.removeItem('chronic_med_demo_reminder_settings');
      localStorage.removeItem('chronic_med_demo_user');
      showToast('本地数据已清除');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const toggleReminder = (key: keyof typeof defaultReminders) => {
    const newReminders = { ...reminders, [key]: !reminders[key] };
    setReminders(newReminders);
    localStorage.setItem('chronic_med_demo_reminder_settings', JSON.stringify(newReminders));
  };

  const toggleFocusArea = (area: string) => {
    const areas = [...profileForm.focusAreas];
    if (areas.includes(area)) {
      setProfileForm({ ...profileForm, focusAreas: areas.filter(a => a !== area) });
    } else {
      setProfileForm({ ...profileForm, focusAreas: [...areas, area] });
    }
  };

  const saveProfile = () => {
    setProfile(profileForm);
    localStorage.setItem('chronic_med_demo_user', JSON.stringify(profileForm));
    setModal('none');
    showToast('资料已更新');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto relative">
      {/* Top Header */}
      <header className="px-6 py-6 shrink-0 flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900">我的</h1>
          <p className="text-lg text-slate-500 font-medium">账号与设置</p>
        </div>
      </header>

      <main className="flex-1 px-6 flex flex-col gap-6 pb-6">
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center border-4 border-blue-100 shrink-0">
            <User size={48} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-black text-slate-900">{profile.name || '用户'}</h2>
            <p className="text-slate-500 font-medium mt-1">本人用药管理 / {profile.phone}</p>
            <div className="flex items-center gap-1.5 mt-3 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full w-fit">
              <CheckCircle2 size={18} strokeWidth={3} />
              <span className="text-sm font-bold">已连续打卡 7 天</span>
            </div>
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Bell className="text-blue-600" size={24} /> 提醒设置
          </h3>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-lg">服药提醒</p>
                <p className="text-slate-500 font-medium mt-0.5">服药前 30 分钟提醒</p>
              </div>
              <button onClick={() => toggleReminder('medication')} className={`w-14 h-8 rounded-full relative shadow-inner transition-colors duration-300 ${reminders.medication ? 'bg-blue-600' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${reminders.medication ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-lg">漏服提醒</p>
                <p className="text-slate-500 font-medium mt-0.5">超过计划时段未打卡提醒</p>
              </div>
              <button onClick={() => toggleReminder('missed')} className={`w-14 h-8 rounded-full relative shadow-inner transition-colors duration-300 ${reminders.missed ? 'bg-blue-600' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${reminders.missed ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-lg">库存不足提醒</p>
                <p className="text-slate-500 font-medium mt-0.5">库存少于 7 天提醒续方</p>
              </div>
              <button onClick={() => toggleReminder('stock')} className={`w-14 h-8 rounded-full relative shadow-inner transition-colors duration-300 ${reminders.stock ? 'bg-blue-600' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${reminders.stock ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-lg">复诊提醒</p>
                <p className="text-slate-500 font-medium mt-0.5">复诊前 7 天提醒</p>
              </div>
              <button onClick={() => toggleReminder('revisit')} className={`w-14 h-8 rounded-full relative shadow-inner transition-colors duration-300 ${reminders.revisit ? 'bg-blue-600' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${reminders.revisit ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-lg">药品过期提醒</p>
                <p className="text-slate-500 font-medium mt-0.5">药品临近有效期提醒</p>
              </div>
              <button onClick={() => toggleReminder('expiry')} className={`w-14 h-8 rounded-full relative shadow-inner transition-colors duration-300 ${reminders.expiry ? 'bg-blue-600' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${reminders.expiry ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* My Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
            <FileText className="text-blue-600" size={24} /> 我的档案
          </h3>
          <button 
            onClick={() => {
              setProfileForm({ ...profile });
              setModal('profile');
            }} 
            className="absolute top-6 right-6 text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
          >
            编辑
          </button>
          <div className="space-y-4 mt-2">
            <div>
              <p className="text-slate-500 font-medium mb-1">姓名 / 年龄</p>
              <p className="font-bold text-slate-800 text-lg">{profile.name || '未知'}，{profile.age || '未知'}岁</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-1">重点关注</p>
              <p className="font-bold text-slate-800 text-lg">{profile.focusAreas?.join('、') || '无'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-1">就诊医院</p>
              <p className="font-bold text-slate-800 text-lg">{profile.hospital || '无'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-1">过敏史</p>
              <p className="font-bold text-slate-800 text-lg">{profile.allergy || '无'}</p>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
           <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Shield className="text-indigo-600" size={24} /> 数据与隐私
          </h3>
          <div className="flex flex-col">
            <button onClick={() => setModal('privacy')} className="flex flex-row items-center justify-between w-full text-left py-4 border-b border-slate-100 active:opacity-70 group">
              <p className="font-bold text-slate-700 text-lg group-hover:text-indigo-600 transition-colors">隐私说明</p>
              <ChevronRight className="text-slate-400" size={24} />
            </button>
            <button onClick={handleClearData} className="flex flex-row items-center justify-between w-full text-left py-4 active:opacity-70 group">
              <div>
                <p className="font-bold text-rose-600 text-lg group-hover:text-rose-700 transition-colors">清除本地数据</p>
                <p className="text-slate-500 text-sm mt-0.5">将清空您的所有设置和记录</p>
              </div>
              <Trash2 size={24} className="text-rose-400" />
            </button>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Settings className="text-slate-500" size={24} /> 通用设置
          </h3>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-800 text-lg">字体大小</p>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => updateSettings({ bigFont: false })}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${!settings.bigFont ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  标准
                </button>
                <button 
                  onClick={() => updateSettings({ bigFont: true })}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${settings.bigFont ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  大号
                </button>
              </div>
            </div>
            
            <hr className="border-slate-100" />
            
            <button onClick={handleLogout} className="flex flex-row items-center justify-between w-full text-left py-2 active:opacity-70 group">
              <p className="font-bold text-slate-600 text-lg flex items-center gap-2 group-hover:text-slate-900 transition-colors">退出登录</p>
              <LogOut className="text-slate-400" size={24} />
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      {modal !== 'none' && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex py-10 px-4 justify-center overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 flex flex-col m-auto relative shadow-2xl">
            {modal === 'profile' && (
              <>
                <h2 className="text-2xl font-black text-slate-900 mb-6">我的档案</h2>
                <div className="flex flex-col gap-5 mb-8">
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">姓名</label>
                    <input 
                      type="text" 
                      value={profileForm.name} 
                      onChange={e => setProfileForm({...profileForm, name: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">年龄</label>
                    <input 
                      type="number" 
                      value={profileForm.age} 
                      onChange={e => setProfileForm({...profileForm, age: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">手机号</label>
                    <input 
                      type="text" 
                      value={profileForm.phone} 
                      onChange={e => setProfileForm({...profileForm, phone: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">重点关注方向</label>
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
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">过敏史</label>
                    <input 
                      type="text" 
                      value={profileForm.allergy} 
                      onChange={e => setProfileForm({...profileForm, allergy: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                      placeholder="如：无"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">就诊医院</label>
                    <input 
                      type="text" 
                      value={profileForm.hospital} 
                      onChange={e => setProfileForm({...profileForm, hospital: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-all" 
                      placeholder="如：市人民医院"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button onClick={() => setModal('none')} className="bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl py-4 font-bold text-lg active:scale-95 transition-transform">
                    取消
                  </button>
                  <button onClick={saveProfile} className="bg-blue-600 text-white rounded-2xl py-4 font-bold text-lg shadow-md active:scale-95 transition-transform">
                    保存
                  </button>
                </div>
              </>
            )}

            {modal === 'privacy' && (
              <>
                <h2 className="text-2xl font-black text-slate-900 mb-6">隐私说明</h2>
                <div className="prose prose-slate mb-8 max-h-[50vh] overflow-y-auto pr-2">
                  <p className="font-medium text-slate-700 leading-relaxed text-lg">
                    当前 Demo 仅用于产品原型展示，数据保存在本地浏览器中，不会上传服务器。
                  </p>
                </div>
                <button onClick={() => setModal('none')} className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold text-lg shadow-md active:scale-95 transition-transform">
                  我知道了
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] bg-slate-800 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check size={20} className="text-green-400" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
