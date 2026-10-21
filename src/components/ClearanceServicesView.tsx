import React, { useState } from 'react';
import { KuwaitServiceRequestForm } from './KuwaitServiceRequestForm';
import { KuwaitServicesDirectory } from './KuwaitServicesDirectory';
import { ActiveTab } from '../types';
import { FileText, Grid, Sparkles, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ClearanceServicesViewProps {
  onOrderCreated?: (orderId: string) => void;
  setActiveTab?: (tab: ActiveTab) => void;
  initialSubTab?: 'form' | 'directory';
}

export const ClearanceServicesView: React.FC<ClearanceServicesViewProps> = ({
  onOrderCreated,
  setActiveTab,
  initialSubTab = 'form',
}) => {
  const [subView, setSubView] = useState<'form' | 'directory'>(initialSubTab);
  const [selectedServiceForForm, setSelectedServiceForForm] = useState<string>('residency-renewal');

  const handleSelectServiceFromDirectory = (serviceId: string) => {
    setSelectedServiceForForm(serviceId);
    setSubView('form');
  };

  return (
    <div className="space-y-6">
      {/* Subview Selector Tabs */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSubView('form')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              subView === 'form'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>نموذج طلب المعاملة التفاعلي</span>
            <span className="hidden sm:inline-block text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
              معتمد
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubView('directory')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              subView === 'directory'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>دليل وتعريف الخدمات (16 خدمة)</span>
            <span className="hidden sm:inline-block text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
              شامل
            </span>
          </button>
        </div>
      </div>

      {/* Render selected subview */}
      {subView === 'form' ? (
        <KuwaitServiceRequestForm
          initialServiceId={selectedServiceForForm}
          onOrderCreated={onOrderCreated}
          setActiveTab={setActiveTab}
        />
      ) : (
        <KuwaitServicesDirectory
          onSelectServiceForRequest={handleSelectServiceFromDirectory}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};
