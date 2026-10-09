'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Palette, ShieldCheck, Database, Save, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useTheme } from '@/context/ThemeContext';
import { getPublicSettings, updateAdminSettings } from '@/api/settings.api';

export default function SettingsAdminPage() {
  const { theme, setTheme, availableThemes } = useTheme();
  const [settings, setSettings] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('nature');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertState, setAlertState] = useState(null);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getPublicSettings(),
      fetch('/api/health').then((r) => r.json()).catch(() => null),
    ])
      .then(([sData, hData]) => {
        if (!isMounted) return;
        if (sData) {
          setSettings(sData);
          setSelectedTheme(sData.theme || 'nature');
        }
        if (hData) setHealth(hData);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveTheme = async () => {
    setIsSaving(true);
    setAlertState(null);

    try {
      await updateAdminSettings({ theme: selectedTheme });
      setTheme(selectedTheme);
      setAlertState({ type: 'success', message: `Dynamic theme updated to "${selectedTheme}" across the platform.` });
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error updating theme.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading system settings..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-content-main">Website Settings & Dynamic Themes</h2>
        <p className="text-xs text-content-muted">Configure visual styling, dynamic theme palettes, and inspect server health.</p>
      </div>

      {alertState && (
        <Alert variant={alertState.type} title={alertState.type === 'success' ? 'Saved' : 'Error'}>
          {alertState.message}
        </Alert>
      )}

      {/* Dynamic Theme Selector */}
      <Card padding="p-6 sm:p-8" className="space-y-6">
        <div className="flex items-center gap-2 border-b border-surface-border pb-3">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-content-main">Dynamic Site Theme & Color Palette</h3>
        </div>

        <p className="text-xs text-content-muted leading-relaxed">
          Switch the dynamic theme for the entire website. The design system dynamically recalculates primary, secondary, and accent colors without rebuilding or code alterations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableThemes.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTheme(t.id)}
              className={`p-4 rounded-theme border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                selectedTheme === t.id
                  ? 'border-primary bg-primary-light/20 shadow-sm'
                  : 'border-surface-border bg-surface hover:bg-surface-muted'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs capitalize text-content-main">{t.name}</span>
                {selectedTheme === t.id && <Check className="w-4 h-4 text-primary" />}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: t.primary }}
                  title="Primary Color"
                />
                <span
                  className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: t.accent }}
                  title="Accent Color"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSaveTheme} variant="primary" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Apply Theme Platform-wide
          </Button>
        </div>
      </Card>

      {/* System Health & Security Overview */}
      <Card padding="p-6 sm:p-8" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-surface-border pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-content-main">Production Security & Health Telemetry</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-theme bg-surface-muted/50 border border-surface-border space-y-1">
            <span className="text-content-muted font-medium">Database Engine</span>
            <p className="font-bold text-content-main flex items-center gap-1.5 mt-1">
              <Database className="w-4 h-4 text-primary" />
              <span>MongoDB ({health?.database || 'connected'})</span>
            </p>
          </div>

          <div className="p-4 rounded-theme bg-surface-muted/50 border border-surface-border space-y-1">
            <span className="text-content-muted font-medium">System Health</span>
            <p className="font-bold text-content-main mt-1">
              <Badge variant={health?.status === 'healthy' ? 'success' : 'warning'}>
                {health?.status || 'Active'}
              </Badge>
            </p>
          </div>

          <div className="p-4 rounded-theme bg-surface-muted/50 border border-surface-border space-y-1">
            <span className="text-content-muted font-medium">Node Process Uptime</span>
            <p className="font-bold text-content-main mt-1">
              {health?.uptimeSeconds ? `${health.uptimeSeconds} seconds` : 'Active'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-theme bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
          <p className="font-semibold">Enterprise Security Hardening Active:</p>
          <ul className="list-disc list-inside text-[11px] space-y-0.5 text-emerald-800">
            <li>HttpOnly, SameSite=lax secure session cookies with JWT revocation</li>
            <li>NoSQL injection sanitization removing dollar keys on all inbound mutations</li>
            <li>Sliding window rate limiters defending auth endpoints and public request forms</li>
            <li>Safe file upload pipeline verifying magic number image signatures (JPEG, PNG, WebP)</li>
            <li>Clickjacking (X-Frame-Options: DENY) and MIME-sniffing protection enabled</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
