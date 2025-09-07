
import React, { useState } from 'react';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import MultiSelectDropdown from '../components/ui/MultiSelectDropdown';
import { THERAPY_MODALITIES } from '../constants';

// --- Reusable UI Components for Settings Page ---

const SettingsSection: React.FC<{ title: string; description: string; children: React.ReactNode; }> = ({ title, description, children }) => (
    <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className="p-6 space-y-6">
            {children}
        </div>
    </div>
);

const SettingsRow: React.FC<{ label: string; description?: string; children: React.ReactNode; }> = ({ label, description, children }) => (
    <div className="flex flex-col md:flex-row md:items-start">
        <div className="w-full md:w-1/3 mb-2 md:mb-0">
            <label className="font-semibold text-gray-700">{label}</label>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="w-full md:w-2/3">
            {children}
        </div>
    </div>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ enabled, onChange }) => (
    <button
        type="button"
        className={`${enabled ? 'bg-primary' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
        onClick={() => onChange(!enabled)}
    >
        <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
    </button>
);


// --- Main Settings Page Component ---

const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState({
        profile: {
            fullName: 'Vishnu Ram',
            displayName: 'Vishnu R.',
            title: 'Therapist',
            specializations: ['MI: Motivational Interviewing', 'Play Therapy'],
            contactEmail: 'demo@upheal.io',
            contactPhone: '(555) 123-4567',
            address: '123 Wellness Ave, Suite 100, Mindful City, ST 12345'
        },
        loginMethods: {
            ssoEnabled: true,
            twoFactorEnabled: false,
            activeSessions: [
                { device: 'Chrome on macOS', location: 'New York, NY', loggedIn: '2024-05-21T10:00:00Z' },
                { device: 'iPhone App', location: 'New York, NY', loggedIn: '2024-05-20T15:30:00Z' },
            ]
        },
        privacy: {
            activeRegulation: 'HIPAA',
        }
    });

    const handleProfileChange = (field: keyof typeof settings.profile, value: any) => {
        setSettings(prev => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
    };

    const handleLoginChange = (field: keyof typeof settings.loginMethods, value: any) => {
        setSettings(prev => ({ ...prev, loginMethods: { ...prev.loginMethods, [field]: value } }));
    };
    
    const handlePrivacyChange = (field: keyof typeof settings.privacy, value: any) => {
        setSettings(prev => ({ ...prev, privacy: { ...prev.privacy, [field]: value } }));
    };

    return (
        <div className="p-8 flex-1 flex flex-col overflow-y-auto">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500">Manage your profile, practice, and compliance settings.</p>
            </header>

            <div className="max-w-4xl mx-auto w-full">
                {/* Section 1: My Profile */}
                <SettingsSection title="My Profile" description="Manage personal and professional practice information.">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Profile Information</h3>
                    <SettingsRow label="Photo/Avatar">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-2xl font-semibold text-gray-600">VR</span>
                            </div>
                            <Button variant="secondary">Upload new photo</Button>
                        </div>
                    </SettingsRow>
                    <SettingsRow label="Full Name">
                        <input type="text" value={settings.profile.fullName} onChange={e => handleProfileChange('fullName', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light" />
                    </SettingsRow>
                    <SettingsRow label="Specializations">
                       <MultiSelectDropdown options={THERAPY_MODALITIES} selectedOptions={settings.profile.specializations} onChange={selected => handleProfileChange('specializations', selected)} />
                    </SettingsRow>
                    <SettingsRow label="Contact Info">
                        <div className="space-y-2">
                             <input type="email" value={settings.profile.contactEmail} onChange={e => handleProfileChange('contactEmail', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light" />
                             <input type="tel" value={settings.profile.contactPhone} onChange={e => handleProfileChange('contactPhone', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light" />
                        </div>
                    </SettingsRow>
                    
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 my-6">Login Methods</h3>
                    <SettingsRow label="Enable 2FA" description="Add an extra layer of security to your account.">
                         <ToggleSwitch enabled={settings.loginMethods.twoFactorEnabled} onChange={enabled => handleLoginChange('twoFactorEnabled', enabled)} />
                    </SettingsRow>
                    <SettingsRow label="Change Password">
                        <Button variant="secondary" className="flex items-center gap-2"><Icon name="key" className="h-4 w-4" /> Change Password</Button>
                    </SettingsRow>
                    <SettingsRow label="Active Sessions" description="This is a list of devices that have logged into your account.">
                       <ul className="space-y-3 border border-gray-200 rounded-lg p-3">
                           {settings.loginMethods.activeSessions.map((session, index) => (
                               <li key={index} className="flex justify-between items-center text-sm">
                                   <div>
                                       <p className="font-semibold">{session.device}</p>
                                       <p className="text-gray-500">{session.location}</p>
                                   </div>
                                   <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">Log out</Button>
                               </li>
                           ))}
                       </ul>
                    </SettingsRow>
                </SettingsSection>

                {/* Section 2: Practice Details */}
                <SettingsSection title="Practice Details" description="Control privacy, data, and regulatory settings for the therapy practice.">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Data Privacy & Compliance</h3>
                     <SettingsRow label="Active Data Privacy Regulations" description="Based on your primary practice geography.">
                        <select value={settings.privacy.activeRegulation} onChange={e => handlePrivacyChange('activeRegulation', e.target.value)} className="w-full md:w-1/2 border border-gray-300 rounded-md p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light">
                            <option>HIPAA (United States)</option>
                            <option>DPA (United Kingdom)</option>
                            <option>GDPR (European Union)</option>
                            <option>Other</option>
                        </select>
                    </SettingsRow>
                     <SettingsRow label="Encryption Settings" description="Your data is always encrypted at rest and in transit.">
                        <div className="flex items-center gap-2 text-green-600 font-semibold p-2 bg-green-50 rounded-md border border-green-200">
                           <Icon name="shield" className="h-5 w-5" /> Both enabled
                        </div>
                    </SettingsRow>
                    
                     <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 my-6">Data Deletion & Access</h3>
                     <SettingsRow label="Patient Data Deletion Request">
                         <Button variant="secondary">Initiate Deletion Workflow</Button>
                     </SettingsRow>
                     <SettingsRow label="Export Data" description="Export all notes, records, and billing data.">
                        <Button variant="secondary" className="flex items-center gap-2"><Icon name="database" className="h-4 w-4" /> Export All Data</Button>
                    </SettingsRow>
                    <SettingsRow label="Data Retention Policy" description="Set the number of days to retain data after a client is archived.">
                        <div className="flex items-center gap-2">
                            <input type="number" defaultValue="3650" className="w-24 border border-gray-300 rounded-md p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light" />
                            <span>days</span>
                        </div>
                    </SettingsRow>
                </SettingsSection>
            </div>
        </div>
    );
};

export default SettingsPage;
