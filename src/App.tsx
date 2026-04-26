/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import TodayPage from './pages/TodayPage';
import MedicineBoxPage from './pages/MedicineBoxPage';
import DataPage from './pages/DataPage';
import ProfilePage from './pages/ProfilePage';
import { BottomNav } from './components/BottomNav';

function AppContent() {
  const { user, settings } = useAppContext();
  const [currentTab, setCurrentTab] = useState('today');

  React.useEffect(() => {
    document.documentElement.style.fontSize = settings.bigFont ? '18px' : '16px';
  }, [settings.bigFont]);

  if (!user.loggedIn) {
    return <LoginPage />;
  }

  // Render current tab page
  const renderPage = () => {
    switch (currentTab) {
      case 'today': return <TodayPage />;
      case 'medicine': return <MedicineBoxPage />;
      case 'data': return <DataPage />;
      case 'profile': return <ProfilePage />;
      default: return <TodayPage />;
    }
  };

  return (
    <div className={`flex flex-col h-full w-full bg-gray-50 relative ${settings.bigFont ? 'text-[110%]' : ''}`}>
      {/* Page Content */}
      <div className="flex-1 overflow-hidden">
        {renderPage()}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        {/* Mobile-first Container constraint */}
        <div className="w-full max-w-[420px] h-[100dvh] max-h-[900px] bg-white relative shadow-2xl xl:rounded-[32px] overflow-hidden flex flex-col mx-auto xl:my-8 border border-gray-200">
          <AppContent />
        </div>
      </div>
    </AppProvider>
  );
}

