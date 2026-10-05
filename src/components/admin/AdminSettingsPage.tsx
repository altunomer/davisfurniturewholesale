'use client';

import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Mail, KeyRound, Check, ShieldCheck, Save } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { contactSettings, updateContactSettings, changeCredentials } = useProducts();

  const [formMail, setFormMail] = useState(contactSettings.recipientEmail);
  const [subject, setSubject] = useState(contactSettings.notificationSubject);
  const [autoReply, setAutoReply] = useState(contactSettings.autoReplyMessage);
  const [phone, setPhone] = useState(contactSettings.companyPhone);
  const [address, setAddress] = useState(contactSettings.companyAddress);

  const [adminUsername, setAdminUsername] = useState(
    typeof window !== 'undefined' ? (localStorage.getItem('davis_admin_username') || 'dr4carys') : 'dr4carys'
  );
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactSettings({
      recipientEmail: formMail.trim(),
      notificationSubject: subject.trim(),
      autoReplyMessage: autoReply.trim(),
      companyPhone: phone.trim(),
      companyAddress: address.trim()
    });
    setStatusMessage('Contact form & dispatch settings updated successfully!');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleCredentialsChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword) {
      if (newPassword.length < 4) {
        alert('Password must be at least 4 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
    }
    changeCredentials(adminUsername.trim(), newPassword ? newPassword : undefined);
    setNewPassword('');
    setConfirmPassword('');
    setStatusMessage('Admin portal credentials updated successfully!');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
        <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-1 block">
          Configuration & Preferences
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Store Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Configure contact form recipient emails, trade dispatch addresses, and administrative passwords.
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{statusMessage}</span>
        </div>
      )}

      {/* Contact Form Mail Settings */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-neutral-100">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Contact & Quote Form Email Settings</h2>
            <p className="text-xs text-neutral-500">
              When a customer submits a wholesale quote or contact inquiry, notifications will be routed here.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveContact} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Recipient Email Address *
              </label>
              <input
                type="email"
                required
                value={formMail}
                onChange={(e) => setFormMail(e.target.value)}
                placeholder="charlie@davisfurniturewholesale.com"
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Primary inbox for all website quotes and trade submissions.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Inquiry Notification Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="New Trade Wholesale Inquiry - Davis Furniture"
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Company Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 (0) 28 4175 4488"
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Confirmation Notice to Client
              </label>
              <input
                type="text"
                value={autoReply}
                onChange={(e) => setAutoReply(e.target.value)}
                placeholder="Thank you! Our sales desk will contact you shortly."
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
              Company Headquarters Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="33A BALLYDESLAND ROAD, WARRENPOINT, CO.DOWN, N. IRELAND BT34 3QB"
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs inline-flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Email & Contact Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Admin Credentials Change Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-neutral-100">
          <div className="p-2.5 bg-neutral-100 text-neutral-800 rounded-xl">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Change Admin Credentials</h2>
            <p className="text-xs text-neutral-500">
              Update the username and password used to access <code className="font-mono text-neutral-800">/welcome-webmaster</code>.
            </p>
          </div>
        </div>

        <form onSubmit={handleCredentialsChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
              Admin Username *
            </label>
            <input
              type="text"
              required
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              placeholder="dr4carys"
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
              New Password (Optional)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password..."
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
            />
          </div>

          {newPassword && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password..."
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Update Credentials</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
