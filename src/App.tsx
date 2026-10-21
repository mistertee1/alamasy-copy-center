import React, { useState, useEffect } from 'react';
import { ActiveTab, PrintOrderConfig, PriceBreakdown } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickPrint } from './components/QuickPrint';
import { ServicesGrid } from './components/ServicesGrid';
import { PricingTable } from './components/PricingTable';
import { ContactLocation } from './components/ContactLocation';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { OrderTracking } from './components/OrderTracking';
import { CustomServiceRequest } from './components/CustomServiceRequest';
import { ClearanceServicesView } from './components/ClearanceServicesView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');
  const [receiptData, setReceiptData] = useState<{
    config: PrintOrderConfig;
    breakdown: PriceBreakdown;
  } | null>(null);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleShowReceipt = (config: PrintOrderConfig, breakdown: PriceBreakdown) => {
    setReceiptData({ config, breakdown });
  };

  const handleNavigateToTracking = (orderId: string) => {
    setTrackingOrderId(orderId);
    setActiveTab('track-order');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white" dir="rtl">
      
      {/* Header Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Render Views based on active tab */}
        {activeTab === 'home' && (
          <div>
            <Hero setActiveTab={setActiveTab} />
            <QuickPrint onShowReceipt={handleShowReceipt} />
            <ServicesGrid onQuickPrintClick={() => setActiveTab('quick-print')} />
            <PricingTable setActiveTab={setActiveTab} />
            <ContactLocation />
          </div>
        )}

        {activeTab === 'clearance-services' && (
          <div className="pt-6">
            <ClearanceServicesView 
              onOrderCreated={(orderId) => {
                handleNavigateToTracking(orderId);
              }}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {activeTab === 'quick-print' && (
          <div className="pt-6">
            <QuickPrint onShowReceipt={handleShowReceipt} />
            <PricingTable setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === 'track-order' && (
          <div className="pt-6">
            <OrderTracking 
              initialOrderId={trackingOrderId}
              onNavigateToQuickPrint={() => setActiveTab('quick-print')}
              onNavigateToCustomRequest={() => setActiveTab('custom-request')}
            />
          </div>
        )}

        {activeTab === 'custom-request' && (
          <div className="pt-6">
            <CustomServiceRequest 
              onOrderCreated={(orderId) => {
                handleNavigateToTracking(orderId);
              }}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {activeTab === 'services' && (
          <div className="pt-6">
            <ServicesGrid onQuickPrintClick={() => setActiveTab('quick-print')} />
            <ContactLocation />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="pt-6">
            <PricingTable setActiveTab={setActiveTab} />
            <QuickPrint onShowReceipt={handleShowReceipt} />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="pt-6">
            <ContactLocation />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Printable Receipt Modal */}
      {receiptData && (
        <OrderReceiptModal
          config={receiptData.config}
          breakdown={receiptData.breakdown}
          onClose={() => setReceiptData(null)}
          onNavigateToTracking={handleNavigateToTracking}
        />
      )}

    </div>
  );
}
