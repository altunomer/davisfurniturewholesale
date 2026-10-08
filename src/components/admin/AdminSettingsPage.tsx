'use client';

import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import {
  Mail,
  KeyRound,
  Check,
  ShieldCheck,
  Save,
  Send,
  Server,
  Zap,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { contactSettings, updateContactSettings, changeCredentials, sendTestEmail } = useProducts();

  // Basic Routing
  const [formMail, setFormMail] = useState(contactSettings.recipientEmail || 'charlie@davisfurniturewholesale.com');
  const [ccMail, setCcMail] = useState(contactSettings.ccEmail || '');
  const [subject, setSubject] = useState(contactSettings.notificationSubject || 'New Trade Wholesale Inquiry - Davis Furniture');
  const [autoReply, setAutoReply] = useState(contactSettings.autoReplyMessage || 'Thank you! Our sales desk will contact you shortly.');
  const [enableAutoReply, setEnableAutoReply] = useState(contactSettings.enableAutoReply || false);
  const [phone, setPhone] = useState(contactSettings.companyPhone || '');
  const [address, setAddress] = useState(contactSettings.companyAddress || '');

  // Mail Provider Engine
  const [mailProvider, setMailProvider] = useState<'resend' | 'smtp' | 'custom'>(contactSettings.mailProvider || 'resend');
  const [resendApiKey, setResendApiKey] = useState(contactSettings.resendApiKey || '');
  const [fromEmail, setFromEmail] = useState(contactSettings.fromEmail || 'onboarding@resend.dev');
  const [fromName, setFromName] = useState(contactSettings.fromName || 'Davis Furniture Wholesale');

  // SMTP Settings
  const [smtpHost, setSmtpHost] = useState(contactSettings.smtpHost || 'mail.davisfurniturewholesale.com');
  const [smtpPort, setSmtpPort] = useState(contactSettings.smtpPort || '465');
  const [smtpUser, setSmtpUser] = useState(contactSettings.smtpUser || '');
  const [smtpPassword, setSmtpPassword] = useState(contactSettings.smtpPassword || '');
  const [smtpSecure, setSmtpSecure] = useState(contactSettings.smtpSecure !== false);

  // UI state
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Test Email state
  const [testEmailTarget, setTestEmailTarget] = useState(formMail);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Admin Credentials
  const [adminUsername, setAdminUsername] = useState(
    typeof window !== 'undefined' ? (localStorage.getItem('davis_admin_username') || 'dr4carys') : 'dr4carys'
  );
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactSettings({
      recipientEmail: formMail.trim(),
      ccEmail: ccMail.trim(),
      notificationSubject: subject.trim(),
      autoReplyMessage: autoReply.trim(),
      enableAutoReply,
      companyPhone: phone.trim(),
      companyAddress: address.trim(),
      mailProvider,
      resendApiKey: resendApiKey.trim(),
      fromEmail: fromEmail.trim(),
      fromName: fromName.trim(),
      smtpHost: smtpHost.trim(),
      smtpPort: smtpPort.trim(),
      smtpUser: smtpUser.trim(),
      smtpPassword: smtpPassword.trim(),
      smtpSecure
    });
    setStatusMessage({ type: 'success', text: 'Email dispatch & store settings updated successfully!' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleTriggerTestEmail = async () => {
    setIsSendingTest(true);
    setTestResult(null);

    // Save settings before testing
    updateContactSettings({
      recipientEmail: formMail.trim(),
      ccEmail: ccMail.trim(),
      mailProvider,
      resendApiKey: resendApiKey.trim(),
      fromEmail: fromEmail.trim(),
      fromName: fromName.trim(),
      smtpHost: smtpHost.trim(),
      smtpPort: smtpPort.trim(),
      smtpUser: smtpUser.trim(),
      smtpPassword: smtpPassword.trim(),
      smtpSecure
    });

    const res = await sendTestEmail(testEmailTarget.trim());
    setIsSendingTest(false);
    setTestResult(res);
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
    setStatusMessage({ type: 'success', text: 'Admin portal credentials updated successfully!' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
        <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-1 block">
          Configuration & Preferences
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Store & Mail Engine Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Configure how customer contact forms and wholesale quote requests are delivered to your inbox.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span className="font-semibold">{statusMessage.text}</span>
        </div>
      )}

      {/* Main Mail & Contact Form Settings Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex items-center space-x-3 pb-5 border-b border-neutral-100">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Email Notification & Dispatch Engine</h2>
            <p className="text-xs text-neutral-500">
              When a visitor submits an inquiry or quote request on your website, it will be dispatched using these settings.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveContact} className="space-y-6">

          {/* 1. Recipient Routing */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>1. Notification Destination (Nereye Gönderilsin?)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                  Primary Recipient Email (Ana Alıcı) *
                </label>
                <input
                  type="email"
                  required
                  value={formMail}
                  onChange={(e) => {
                    setFormMail(e.target.value);
                    if (!testEmailTarget) setTestEmailTarget(e.target.value);
                  }}
                  placeholder="charlie@davisfurniturewholesale.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  All customer quotes and messages are delivered to this mailbox.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                  CC Notification Email (Bilgi / İkinci Alıcı)
                </label>
                <input
                  type="email"
                  value={ccMail}
                  onChange={(e) => setCcMail(e.target.value)}
                  placeholder="sales@davisfurniturewholesale.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Optional copy sent to sales or manager email.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Email Subject Prefix / Template
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

          {/* 2. Provider Selection Tabs */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>2. E-Posta Gönderim Yöntemi (Mail Provider)</span>
            </h3>

            {/* Provider Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMailProvider('resend')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  mailProvider === 'resend'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg ${mailProvider === 'resend' ? 'bg-amber-600 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Resend API (Önerilen)</h4>
                    <span className="text-[11px] text-amber-700 font-medium">Ayda 3.000 mail ücretsiz</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Cloudflare ve Next.js için en hızlı ve güvenli transactional email altyapısıdır. SMTP port engellemelerinden etkilenmez.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMailProvider('smtp')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  mailProvider === 'smtp'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg ${mailProvider === 'smtp' ? 'bg-amber-600 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Özel SMTP Sunucusu</h4>
                    <span className="text-[11px] text-neutral-500 font-medium">cPanel / Kendi Mailiniz</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Kendi mail hostinginiz, Yandex Kurumsal, Zoho veya Gmail SMTP sunucunuz üzerinden doğrudan gönderim yapar.
                </p>
              </button>
            </div>

            {/* Resend Fields */}
            {mailProvider === 'resend' && (
              <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4 animate-in fade-in">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Resend API Key *
                    </label>
                    <a
                      href="https://resend.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium underline flex items-center"
                    >
                      <span>Ücretsiz API Key Al (resend.com)</span>
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={resendApiKey}
                      onChange={(e) => setResendApiKey(e.target.value)}
                      placeholder="re_123456789_abcdefg..."
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 font-mono pr-10 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    API anahtarı girildiğinde müşterilerin attığı her form doğrudan gelen kutunuza düşer. Boş bırakılırsa mailler admin paneli <strong>Inquiries</strong> sekmesinde toplanır.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                      Gönderen E-posta (From Email)
                    </label>
                    <input
                      type="text"
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      placeholder="onboarding@resend.dev"
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 bg-white"
                    />
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      Doğrulanmış domaininiz yoksa <code className="text-neutral-700">onboarding@resend.dev</code> ile test edebilirsiniz.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                      Gönderen İsim (From Name)
                    </label>
                    <input
                      type="text"
                      value={fromName}
                      onChange={(e) => setFromName(e.target.value)}
                      placeholder="Davis Furniture Wholesale"
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SMTP Fields */}
            {mailProvider === 'smtp' && (
              <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                      SMTP Host *
                    </label>
                    <input
                      type="text"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="mail.davisfurniturewholesale.com"
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                      SMTP Port *
                    </label>
                    <input
                      type="text"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      placeholder="465 (SSL) veya 587 (TLS)"
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                      SMTP Kullanıcı Adı (Mail) *
                    </label>
                    <input
                      type="text"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      placeholder="quotes@davisfurniturewholesale.com"
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                      SMTP Şifresi *
                    </label>
                    <div className="relative">
                      <input
                        type={showSmtpPass ? 'text' : 'password'}
                        value={smtpPassword}
                        onChange={(e) => setSmtpPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 bg-white pr-10 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSmtpPass(!showSmtpPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="smtpSecure"
                    checked={smtpSecure}
                    onChange={(e) => setSmtpSecure(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-neutral-300"
                  />
                  <label htmlFor="smtpSecure" className="text-xs font-medium text-neutral-700 cursor-pointer">
                    Güvenli Bağlantı Kullan (SSL/TLS Şifreleme)
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 3. Company Contact Info */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>3. Şirket İletişim Bilgileri (Sitede Görünen)</span>
            </h3>

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
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Email & Contact Settings</span>
            </button>
          </div>
        </form>

        {/* 4. Live Test Email Dispatcher */}
        <div className="p-6 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-600 text-white rounded-lg">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">E-Posta Gönderimini Canlı Test Et</h3>
              <p className="text-xs text-neutral-600">
                Ayarlarınızın doğru çalıştığından emin olmak için belirttiğiniz e-posta adresine tek tıkla test maili gönderin.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              value={testEmailTarget}
              onChange={(e) => setTestEmailTarget(e.target.value)}
              placeholder="Test mailinin gönderileceği e-posta adresi..."
              className="w-full sm:flex-1 px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 bg-white"
            />
            <button
              type="button"
              disabled={isSendingTest}
              onClick={handleTriggerTestEmail}
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-neutral-400 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0"
            >
              {isSendingTest ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Test E-Postası Gönder</span>
                </>
              )}
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3.5 rounded-lg text-xs flex items-start space-x-2 ${
                testResult.success
                  ? 'bg-emerald-100/70 border border-emerald-300 text-emerald-900'
                  : 'bg-rose-100/70 border border-rose-300 text-rose-900'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{testResult.success ? 'Başarılı!' : 'Gönderim Uyarısı:'}</p>
                <p className="mt-0.5">{testResult.message}</p>
              </div>
            </div>
          )}
        </div>

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

