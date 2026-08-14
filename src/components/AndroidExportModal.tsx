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

  const handleDownloadSingleYml = () => {
    soundSynth.play('cyber-laser');
    const ymlContent = generateGitHubWorkflowYaml();
    const blob = new Blob([ymlContent], { type: 'text/yaml' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main.yml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setCopiedKey('download-yml');
    setTimeout(() => setCopiedKey(null), 3000);
  };

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
                  ZAYEA X Android APK • 1-File Auto Builder
                </h2>
                <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  All-in-One 1-Min Build
                </span>
              </div>
              <p className="text-xs text-slate-400">
                තනි ගොනුවකින් (Single YAML File) සියලුම Files ස්වයංක්‍රීයව Generate කර APK එක සාදාගන්න
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
          {/* Super Easy 1-File Solution Banner */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-cyan-950/60 to-indigo-950/60 border-2 border-emerald-500/50 space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>⚡ තනි File එකකින් සියල්ල Auto-Generate වී APK හැදෙන අලුත්ම ක්‍රමය (1-Click Solution)</span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              ඔබට Files 30-40ක් upload කිරීමට අවශ්‍ය නැත! පහත <b>"Copy 1-File Workflow"</b> හෝ <b>"Download main.yml"</b> ගෙන, GitHub එකේ <code>.github/workflows/main.yml</code> ලෙස Paste කරන්න. Actions මඟින් සියලුම Android Files ස්වයංක්‍රීයව හදා APK එක Build කර දෙනු ඇත!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                id="copy-all-in-one-workflow-btn"
                onClick={() => handleCopy(generateGitHubWorkflowYaml(), 'single-yaml')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all transform hover:scale-105"
              >
                {copiedKey === 'single-yaml' ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Workflow Copied to Clipboard! ✅</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-950" />
                    <span>Copy 1-File Workflow (main.yml)</span>
                  </>
                )}
              </button>

              <button
                id="download-single-yml-btn"
                onClick={handleDownloadSingleYml}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>{copiedKey === 'download-yml' ? 'Downloaded main.yml! ✅' : 'Download main.yml File'}</span>
              </button>

              <button
                id="download-project-zip-btn"
                onClick={handleDownloadZip}
                disabled={downloading}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 font-medium text-xs flex items-center gap-1.5 transition-all ml-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading ? 'Zipping...' : 'Or Download Full .ZIP (For Android Studio)'}</span>
              </button>
            </div>
          </div>

          {/* 3-Step Simple Guide in Sinhala */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>පියවර 3කින් APK එක ලබාගන්නා ආකාරය (Easy 3 Steps):</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>GitHub File එක සාදන්න</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  GitHub Repo එකේ <b>Add file</b> &gt; <b>Create new file</b> ඔබා නම ලෙස <code>.github/workflows/main.yml</code> ලබාදෙන්න.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Paste &amp; Commit</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  ඉහත <b>"Copy 1-File Workflow"</b> ඔබා copy කරගත් Code එක Paste කර <b>Commit changes</b> ඔබන්න.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>APK Download (Artifacts)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <b>Actions</b> Tab එකට යන්න. විනාඩි 1කින් Build වී පහළ <b>Artifacts</b> යටතේ APK එක බාගත කරගත හැක! 🚀
                </p>
              </div>
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
