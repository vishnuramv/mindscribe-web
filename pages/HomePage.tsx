

import React, { useState } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
// Fix: Import ICONS to resolve type errors for icon names.
import { ICONS } from '../constants';

// Generic Widget Wrapper
const DashboardWidget: React.FC<{ title: string; children: React.ReactNode; className?: string; actions?: React.ReactNode; }> = ({ title, children, className = '', actions }) => (
    <div className={`bg-white rounded-xl shadow-sm p-6 flex flex-col ${className}`} style={{ animation: 'fade-in-up 0.5s ease-out' }}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        <div className="flex-grow">{children}</div>
    </div>
);

// Generic Stat Card for reuse inside widgets
const StatCard: React.FC<{ icon: keyof typeof ICONS, label: string, value: string, change?: string, iconBgColor?: string, iconColor?: string }> = ({ icon, label, value, change, iconBgColor = 'bg-primary-light', iconColor = 'text-primary' }) => (
    <div className="flex items-center">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${iconBgColor}`}>
            <Icon name={icon} className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                {change && (
                    <p className={`text-sm font-semibold flex items-center ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        <Icon name="trendingUp" className={`h-4 w-4 mr-1 ${change.startsWith('+') ? '' : 'rotate-180'}`} />
                        {change}
                    </p>
                )}
            </div>
        </div>
    </div>
);

const FilterButtons: React.FC<{ options: string[] }> = ({ options }) => {
    const [active, setActive] = useState(options[1]);
    return (
        <div className="bg-gray-100 p-1 rounded-lg flex">
            {options.map(opt => (
                 <button key={opt} onClick={() => setActive(opt)} className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${active === opt ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
                    {opt}
                </button>
            ))}
        </div>
    );
};

const SessionSummaryWidget = () => (
    <DashboardWidget title="Session Summary" actions={<FilterButtons options={['Daily', 'Weekly', 'Monthly']} />}>
        <div className="space-y-4">
            <StatCard icon="users" label="Total Sessions Completed" value="12" />
            <StatCard icon="checkSquare" label="Session Completion Rate" value="92%" change="+2%" iconBgColor="bg-green-100" iconColor="text-green-600" />
             <div>
                <h4 className="font-semibold text-sm text-gray-600 mt-4 mb-2">Upcoming Sessions (3)</h4>
                <ul className="space-y-2 text-sm">
                    <li className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer"><span>Rhonda S. - 10:00 AM</span><span className="text-gray-500">Today</span></li>
                    <li className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer"><span>Tony P. - 2:00 PM</span><span className="text-gray-500">Today</span></li>
                </ul>
            </div>
        </div>
    </DashboardWidget>
);

const ClientWellbeingWidget = () => (
    <DashboardWidget title="Client Wellbeing Tracker">
        <div className="space-y-4">
            <StatCard icon="activity" label="Avg. Client Happiness" value="4.2/5" change="+5%" iconBgColor="bg-yellow-100" iconColor="text-yellow-600" />
            <div className="flex items-start p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                <Icon name="award" className="h-5 w-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-gray-700">Highest Rated Session</p>
                    <p className="text-sm text-gray-500">Rhonda S. - Apr 29, 2023</p>
                </div>
            </div>
            <div className="flex items-start p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                <Icon name="alertTriangle" className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-gray-700">Clients at Risk</p>
                    <p className="text-sm text-gray-500">Tony P. (Happiness score declined)</p>
                </div>
            </div>
        </div>
    </DashboardWidget>
);

const FinancialPerformanceWidget = () => (
     <DashboardWidget title="Financial Performance">
        <div className="space-y-4">
            <StatCard icon="dollarSign" label="Money Earned (This Month)" value="$4,500" change="+15%" iconBgColor="bg-blue-100" iconColor="text-blue-600" />
            <StatCard icon="calendar" label="Pending Payments" value="2" iconBgColor="bg-red-100" iconColor="text-red-600" />
             <p className="text-xs text-center text-gray-400 pt-4">Real-time payment updates will show here.</p>
        </div>
    </DashboardWidget>
);

const TherapistWellnessWidget = () => (
    <DashboardWidget title="Therapist Wellness Meter">
       <div className="space-y-4">
            <StatCard icon="user" label="My Wellbeing Score" value="3.8/5" change="-0.2" iconBgColor="bg-blue-100" iconColor="text-blue-600" />
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-800">Burnout Risk: Low</p>
                <p className="text-xs text-green-600">Caseload and duration are balanced.</p>
            </div>
            <p className="text-sm text-gray-600 text-center">You have taken <span className="font-bold">2 days off</span> this quarter.</p>
        </div>
    </DashboardWidget>
);

const DocumentationWidget = () => (
    <DashboardWidget title="Documentation & Workflow" className="xl:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
                 <StatCard icon="fileText" label="Notes Completed" value="85%" />
                 <StatCard icon="edit" label="Sessions Awaiting Notes" value="3" />
            </div>
            <div className="md:col-span-2">
                <p className="font-semibold text-sm text-gray-600 mb-2">Avg. Time on Documentation</p>
                <div className="w-full h-32 bg-gray-50 rounded-lg p-4 flex items-end gap-2">
                    {/* Mock Chart */}
                    <div title="18 min" className="w-full bg-primary-light rounded-t-md animate-grow" style={{ height: '60%'}}></div>
                    <div title="16 min" className="w-full bg-primary-light rounded-t-md animate-grow" style={{ height: '55%'}}></div>
                    <div title="15 min" className="w-full bg-primary rounded-t-md animate-grow" style={{ height: '50%'}}></div>
                    <div title="17 min" className="w-full bg-primary-light rounded-t-md animate-grow" style={{ height: '58%'}}></div>
                    <div title="14 min" className="w-full bg-primary-light rounded-t-md animate-grow" style={{ height: '48%'}}></div>
                </div>
                 <p className="text-xs text-gray-500 text-center mt-2">This week: <span className="font-semibold text-gray-700">15 min</span> / session</p>
            </div>
        </div>
    </DashboardWidget>
);

const SessionAnalyticsWidget = () => (
    <DashboardWidget title="Session Analytics" className="xl:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                 <p className="font-semibold text-sm text-gray-600 mb-2">Top Therapy Topics (This week)</p>
                 <div className="space-y-2">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-1 rounded-full">Anxiety</span>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-1 rounded-full">Family</span>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-1 rounded-full">Work Stress</span>
                 </div>
            </div>
            <div className="space-y-4">
                <StatCard icon="messageSquare" label="Avg. Session Duration" value="55 min" />
                <StatCard icon="trendingUp" label="Client Engagement Score" value="78%" />
            </div>
        </div>
    </DashboardWidget>
);

const QuickActionsWidget = () => (
    <DashboardWidget title="Quick Actions">
        <div className="grid grid-cols-2 gap-3">
            {[
                { label: 'New Session', icon: 'plus' },
                { label: 'Send Follow-Up', icon: 'messageSquare' },
                { label: 'Mark Payment', icon: 'dollarSign' },
                { label: 'Add Note', icon: 'fileText' },
                { label: 'Transcribe', icon: 'upload' },
                { label: 'Schedule Break', icon: 'calendar' },
            ].map(action => (
                <Button key={action.label} variant="secondary" className="flex flex-col items-center justify-center h-20 !bg-gray-50 hover:!bg-gray-100 border border-gray-200">
                    <Icon name={action.icon as keyof typeof ICONS} className="h-6 w-6 text-gray-600 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">{action.label}</span>
                </Button>
            ))}
        </div>
    </DashboardWidget>
);

const NotificationsWidget = () => (
    <DashboardWidget title="Notifications & AI Insights" className="xl:col-span-3">
        <ul className="space-y-3">
            <li className="flex items-start p-3 rounded-lg bg-red-50 border border-red-100">
                <Icon name="alertTriangle" className="h-5 w-5 text-red-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-sm text-red-800">Missed Payment</p>
                    <p className="text-sm text-red-700">Tony P. has an overdue invoice from May 5, 2023.</p>
                </div>
            </li>
            <li className="flex items-start p-3 rounded-lg bg-blue-50 border border-blue-100">
                <Icon name="zap" className="h-5 w-5 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-sm text-blue-800">AI Insight</p>
                    <p className="text-sm text-blue-700">You may want to check in on Rhonda S. Keywords related to 'isolation' have increased this month.</p>
                </div>
            </li>
             <li className="flex items-start p-3 rounded-lg hover:bg-gray-50">
                <Icon name="bell" className="h-5 w-5 text-gray-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-sm text-gray-700">Upcoming Session Reminder</p>
                    <p className="text-sm text-gray-600">Your session with Tony P. starts in 1 hour.</p>
                </div>
            </li>
        </ul>
    </DashboardWidget>
);


const HomePage: React.FC = () => {
    const { user } = useAuth();
    const firstName = user?.displayName?.split(' ')[0] || 'Therapist';

    return (
        <div className="p-8 flex-1 flex flex-col overflow-y-auto">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, {firstName}</h1>
                <p className="text-gray-500">Here's a summary of your practice at a glance.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Row 1 */}
                <SessionSummaryWidget />
                <ClientWellbeingWidget />
                <FinancialPerformanceWidget />
                <TherapistWellnessWidget />

                {/* Row 2 */}
                <DocumentationWidget />
                <SessionAnalyticsWidget />
                
                {/* Row 3 */}
                <QuickActionsWidget />
                <NotificationsWidget />
            </div>
        </div>
    );
};

export default HomePage;