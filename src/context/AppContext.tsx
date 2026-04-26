import React, { createContext, useContext, useState, useEffect } from 'react';

// Type definitions
export interface User {
  loggedIn: boolean;
  phone?: string;
  identity?: string;
}

export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: number;
  stock: number;
  unit: string;
  daysLeft: number;
  status: 'normal' | 'low_stock' | 'expiring';
}

export interface Plan {
  id: string;
  medId: string;
  name: string;
  dose: string;
  timeStr: string;
  period: string;
  status: 'pending' | 'taken' | 'missed' | 'snoozed';
}

export interface FamilyMember {
  id: string;
  name: string;
  contact: string;
  receiveMissedReminder: boolean;
}

export interface UserProfile {
  name: string;
  age: string;
  focus: string;
  hospital: string;
}

export interface Settings {
  bigFont: boolean;
  reminders: {
    takeMed: boolean;
    missMed: boolean;
    lowStock: boolean;
    appointment: boolean;
    expiring: boolean;
  };
  profile: UserProfile;
}

interface AppContextType {
  user: User;
  settings: Settings;
  meds: Medication[];
  plans: Plan[];
  login: (phone: string, identity: string) => void;
  logout: () => void;
  takeMed: (planId: string) => void;
  missMed: (planId: string) => void;
  snoozeMed: (planId: string) => void;
  addMed: (med: Medication) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  clearData: () => void;
  updatePlan: (planId: string, updates: Partial<Plan>) => void;
  addPlan: (plan: Omit<Plan, 'id'>) => void;
  removePlan: (planId: string) => void;
}

const defaultUser: User = { loggedIn: false };
const defaultSettings: Settings = { 
  bigFont: true,
  reminders: { takeMed: true, missMed: true, lowStock: true, appointment: true, expiring: true },
  profile: {
    name: '王阿姨',
    age: '63',
    focus: '糖尿病',
    hospital: '市人民医院'
  }
};

const mockMeds: Medication[] = [
  { id: 'm1', name: '二甲双胍片', dose: '1片', frequency: 2, stock: 12, unit: '片', daysLeft: 6, status: 'low_stock' },
  { id: 'm2', name: '缬沙坦胶囊', dose: '1粒', frequency: 1, stock: 20, unit: '粒', daysLeft: 20, status: 'normal' },
  { id: 'm3', name: '阿卡波糖', dose: '1片', frequency: 1, stock: 15, unit: '片', daysLeft: 15, status: 'normal' },
  { id: 'm4', name: '阿托伐他汀', dose: '1片', frequency: 1, stock: 30, unit: '片', daysLeft: 30, status: 'normal' },
];

const mockPlans: Plan[] = [
  { id: 'p1', medId: 'm2', name: '缬沙坦胶囊', dose: '1粒', timeStr: '07:00', period: '晨起', status: 'taken' },
  { id: 'p2', medId: 'm1', name: '二甲双胍片', dose: '1片', timeStr: '08:00', period: '早餐后', status: 'missed' },
  { id: 'p3', medId: 'm3', name: '阿卡波糖', dose: '1片', timeStr: '12:30', period: '午餐后', status: 'pending' },
  { id: 'p4', medId: 'm1', name: '二甲双胍片', dose: '1片', timeStr: '18:30', period: '晚饭后', status: 'snoozed' },
  { id: 'p5', medId: 'm4', name: '阿托伐他汀', dose: '1片', timeStr: '21:00', period: '睡前', status: 'pending' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [meds, setMeds] = useState<Medication[]>(mockMeds);
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('app_user');
    const storedSettings = localStorage.getItem('app_settings');
    const storedMeds = localStorage.getItem('app_meds');
    const storedPlans = localStorage.getItem('app_plans');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedSettings) setSettings(JSON.parse(storedSettings));
    if (storedMeds) {
      const parsedMeds = JSON.parse(storedMeds);
      setMeds(parsedMeds.map((m: any) => m.id === 'm3' ? { ...m, status: 'normal' } : m));
    }
    if (storedPlans) setPlans(JSON.parse(storedPlans));
    
    setLoaded(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('app_user', JSON.stringify(user));
    localStorage.setItem('app_settings', JSON.stringify(settings));
    localStorage.setItem('app_meds', JSON.stringify(meds));
    localStorage.setItem('app_plans', JSON.stringify(plans));
  }, [user, settings, meds, plans, loaded]);

  const login = (phone: string, identity: string) => {
    setUser({ loggedIn: true, phone, identity });
  };

  const logout = () => {
    setUser(defaultUser);
  };

  const takeMed = (planId: string) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, status: 'taken' } : p));
    // Deduct stock
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      const doseAmount = parseInt(plan.dose) || 1;
      setMeds(prev => prev.map(m => {
        if (m.id === plan.medId) {
          const newStock = Math.max(0, m.stock - doseAmount);
          const newDaysLeft = Math.floor(newStock / m.frequency);
          return { ...m, stock: newStock, daysLeft: newDaysLeft, status: newStock < 14 ? 'low_stock' : m.status };
        }
        return m;
      }));
    }
  };

  const missMed = (planId: string) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, status: 'missed' } : p));
  };

  const snoozeMed = (planId: string) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, status: 'snoozed' } : p));
  };

  const addMed = (med: Medication) => {
    setMeds(prev => [...prev, med]);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updatePlan = (planId: string, updates: Partial<Plan>) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, ...updates } : p));
  };

  const addPlan = (plan: Omit<Plan, 'id'>) => {
    const newPlan: Plan = {
      ...plan,
      id: `task-${Date.now()}`
    };
    setPlans(prev => [...prev, newPlan]);
  };

  const removePlan = (planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
  };

  const clearData = () => {
    localStorage.removeItem('app_user');
    localStorage.removeItem('app_settings');
    localStorage.removeItem('app_meds');
    localStorage.removeItem('app_plans');
    // Reset to initial mocks
    setUser(defaultUser);
    setSettings(defaultSettings);
    setMeds(mockMeds);
    setPlans(mockPlans);
  };

  return (
    <AppContext.Provider value={{ user, settings, meds, plans, login, logout, takeMed, missMed, snoozeMed, addMed, updateSettings, clearData, updatePlan, addPlan, removePlan }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
