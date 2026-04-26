import React from 'react';
import { Home, Pill, BarChart2, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
}

export function BottomNav({ currentTab, onChangeTab }: BottomNavProps) {
  const tabs = [
    { id: 'today', label: '今日', icon: Home },
    { id: 'medicine', label: '药箱', icon: Pill },
    { id: 'data', label: '数据', icon: BarChart2 },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <nav className="h-24 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-50 shrink-0 pb-safe rounded-b-[36px] sm:rounded-b-3xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              isActive ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'
            }`}
          >
            <div className={`w-14 h-14 flex items-center justify-center mb-0.5 ${isActive ? 'bg-blue-50 rounded-2xl' : ''}`}>
              <Icon size={28} className={isActive ? 'fill-blue-100 text-blue-600' : 'text-slate-400'} strokeWidth={isActive ? 2 : 2} />
            </div>
            <span className="text-sm font-bold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
