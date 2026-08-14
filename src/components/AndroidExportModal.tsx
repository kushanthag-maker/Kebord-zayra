import React, { useState } from 'react';
import {
  Download,
  Github,
  Check,
  Copy,
  Code2,
  FileCode,
  Sparkles,
  ExternalLink,
  Terminal,
  Zap,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  createAndroidProjectZip,
  generateGitHubWorkflowYaml,
  generateAppBuildGradle,
  generateAndroidManifest,
  generateKotlinService,
  generateReadme,
} from '../utils/androidProjectGenerator';
import { soundSynth } from '../utils/audio';

interface AndroidExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeThemeName: string;
}

export const AndroidExportModal: React.FC<AndroidExportModalProps> = ({
  isOpen,
  onClose,
  activeThemeName,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'workflow' | 'gradle' | 'manifest' | 'kotlin' | 'guide'>('workflow');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setDownloading(true);
    soundSynth.play('cyber-laser');

    try {
      const blob = await createAndroidProjectZip({
        appName: 'ZAYEA X Keyboard',
        packageName: 'com.zayeax.keyboard',
        versionName: '1.0.0-ZAYEA-X',
        versionCode: 1,
        themeName: activeThemeName,
      });

      // Trigger browser download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ZAYEA_X_Android_Keyboard_Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    soundSynth.play('cherry-blue');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getActiveCode = () => {
    switch (activeTab) {
      case 'workflow':
        return generateGitHubWorkflowYaml();
      case 'gradle':
        return generateAppBuildGradle();
      case 'manifest':
        return generateAndroidManifest();
      case 'kotlin':
        return generateKotlinService();
      case 'guide':
        return generateReadme({
          appName: 'ZAYEA X Keyboard',
          packageName: 'com.zayeax.keyboard',
          versionName: '1.0.0-ZAYEA-X',
          versionCode: 1,
          themeName: activeThemeName,
        });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden text-white">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wide text-white">
                  ZAYEA X Android APK &amp; GitHub Actions Studio
                </h2>
                <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  1-Min Auto Build
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Download ready-to-build Android source code + pre-configured GitHub Actions CI workflow
              </p>
            </div>
          </div>

          <button
            id="close-export-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Quick Action Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-indigo-950/60 to-purple-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-sm font-bold text-cyan-200 flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Complete Android Studio Project + CI Workflow (.ZIP)</span>
              </div>
              <p className="text-xs text-slate-300">
                Includes all Gradle files, Kotlin InputMethodService, and GitHub Actions script for instant APK generation.
              </p>
            </div>

            <button
              id="download-project-zip-btn"
              onClick={handleDownloadZip}
              disabled={downloading}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all transform hover:scale-[1.02] disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Generating ZIP...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                  <span>Downloaded! 🎉</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download Android Project (.zip)</span>
                </>
              )}
            </button>
          </div>

          {/* 4-Step Quick Instructions in Sinhala & English */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>How to Get APK in 1 Minute via GitHub (සිංහල උපදෙස් පියවරෙන් පියවර):</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Create Repo</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  GitHub එකේ අලුත් Repository එකක් (Public හෝ Private) සාදන්න.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Upload / Push</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  බාගත කළ ZIP එක Extract කර සියලුම Files (Workflow එකද ඇතුළුව) Repo එකට දමන්න.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>1-Min Auto Build</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  GitHub <b>Actions</b> Tab එකට යන්න. Workflow එක විනාඩි 1කින් Build වේ!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">
                    4
                  </span>
                  <span>Download APK</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Workflow එක අවසන් වූ පසු <b>Artifacts</b> යටතේ ඇති APK එක බාගත කර Install කරන්න!
                </p>
              </div>
            </div>

            {/* Error Fix & Troubleshooting Notice */}
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>⚠️ "No file matched to [**/*.gradle*]" දෝෂය පැමිණියේ ඇයි? සහ විසඳුම:</span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                <b>හේතුව:</b> ඔබ GitHub හි <code>.github/workflows/main.yml</code> ගොනුව පමණක් සාදා, ඉතිරි Android Project files (<code>app/</code>, <code>build.gradle.kts</code> ආදිය) upload කර නොමැති වීම නිසා හෝ ZIP එක Folder එකක් ඇතුළේ upload කර තිබීම නිසා මෙම දෝෂය සිදුවිය.
              </p>
              <p className="text-[11px] text-emerald-300 font-medium">
                <b>විසඳුම:</b> ඉහත <b>"Download Android Project (.zip)"</b> බටනය ඔබා ZIP එක බාගත කර, එය Extract කර එහි ඇති <u>සියලුම files</u> GitHub Repo එකට Upload කරන්න. අපගේ යාවත්කාලීන කළ නව Workflow එක මඟින් ස්වයංක්‍රීයවම APK එක Build කර දෙනු ඇත!
              </p>
            </div>
          </div>

          {/* Code Viewer Tabs */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex flex-wrap gap-1.5">
                <button
                  id="tab-workflow"
                  onClick={() => setActiveTab('workflow')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'workflow'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  .github/workflows/build-apk.yml
                </button>
                <button
                  id="tab-gradle"
                  onClick={() => setActiveTab('gradle')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'gradle'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  app/build.gradle.kts
                </button>
                <button
                  id="tab-manifest"
                  onClick={() => setActiveTab('manifest')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'manifest'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  AndroidManifest.xml
                </button>
                <button
                  id="tab-kotlin"
                  onClick={() => setActiveTab('kotlin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'kotlin'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  ZayeaXInputMethodService.kt
                </button>
                <button
                  id="tab-guide"
                  onClick={() => setActiveTab('guide')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'guide'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  README.md
                </button>
              </div>

              <button
                id="copy-active-code-btn"
                onClick={() => handleCopy(getActiveCode(), activeTab)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
              >
                {copiedKey === activeTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Display Area */}
            <div className="relative">
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-cyan-300/90 overflow-x-auto max-h-64 leading-relaxed select-all">
                {getActiveCode()}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Target Android SDK 35 • Gradle 8.9 • Kotlin 2.0 • CI Ready</span>
          </div>

          <button
            id="modal-close-footer-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
