import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import TopMetrics from '../features/dashboard/TopMetrics';
import LiveRouteDashboard from '../features/live-routing/LiveRouteDashboard';
import CopilotPanel from '../features/logistics-copilot/CopilotPanel';
import EtaPanel from '../features/eta-prediction/EtaPanel';
import RoutingPanel from '../features/alternate-routing/RoutingPanel';
import CongestionPanel from '../features/bottleneck-detection/CongestionPanel';
import RiskPanel from '../features/disruption-risk/RiskPanel';
import RecentShipments from '../features/dashboard/RecentShipments';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] overflow-hidden font-sans text-slate-900 dark:text-slate-100">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <Header />
        
        <main className="p-8 pt-0 max-w-[1600px] mx-auto w-full">
          <TopMetrics />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 px-8 mb-6">
            
            {/* Left Column: Map & Analytics */}
            <div className="xl:col-span-8 flex flex-col gap-6">
              
              <LiveRouteDashboard />

              {/* Bottom Row of Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RiskPanel />
                <CongestionPanel />
                <EtaPanel />
                <RoutingPanel />
              </div>

            </div>

            {/* Right Column: Copilot */}
            <div className="xl:col-span-4 flex flex-col h-full">
              <CopilotPanel />
            </div>

          </div>

          {/* Bottom Table */}
          <div className="px-8 pb-8">
             <RecentShipments />
          </div>

        </main>
      </div>
    </div>
  );
}
