import React, { useState } from "react";
import { Language, PersonaMode, BidNotification, UserProfile } from "../types";
import { UI_STRINGS } from "../utils/formatters";
import {
  Globe,
  TrendingUp,
  Volume2,
  VolumeX,
  Truck,
  Sparkles,
  Building2,
  UserCheck,
  ShieldCheck,
  MessageSquare,
  FileSpreadsheet,
  Camera,
  Coins,
  Database,
  LogIn,
  User,
  ClipboardList,
  Wifi,
  WifiOff,
  MoreHorizontal,
  ChevronDown
} from "lucide-react";
import { AudioGuideEngine } from "../utils/speech";
import { NotificationCenter } from "./NotificationCenter";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  persona: PersonaMode;
  setPersona: (mode: PersonaMode) => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: BidNotification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onSelectBid: (notification: BidNotification) => void;
  onAcceptBidDirectly?: (notification: BidNotification) => void;
  onSimulateIncomingBid: () => void;
  activeToast: BidNotification | null;
  onDismissToast: () => void;
  isOnline?: boolean;
  isSimulatedOffline?: boolean;
  offlineQueueCount?: number;
  onOpenOfflineQueueModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  persona,
  setPersona,
  currentUser,
  onOpenAuthModal,
  soundEnabled,
  setSoundEnabled,
  activeTab,
  setActiveTab,
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
  onSelectBid,
  onAcceptBidDirectly,
  onSimulateIncomingBid,
  activeToast,
  onDismissToast,
  isOnline = true,
  isSimulatedOffline = false,
  offlineQueueCount = 0,
  onOpenOfflineQueueModal,
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);

  const toggleSound = () => {
    if (soundEnabled) {
      AudioGuideEngine.stop();
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
      AudioGuideEngine.speak(
        language === "hi"
          ? "कबाड़ीवाला कनेक्ट में आपका स्वागत है। ध्वनि सहायता चालू है।"
          : language === "mr"
          ? "कबाडीवाला कनेक्टमध्ये आपले स्वागत आहे. ऑडिओ सहाय्य सुरू आहे."
          : "Welcome to Kabadiwala Connect. Audio voice guide enabled.",
        language
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 select-none bg-[#F7F8F6] border-b border-[#D9E1DB]">
      {/* Row 1: Brand Logo + Compact Ticker + Utility Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo Mark */}
        <div
          className="flex items-center gap-3 cursor-pointer group shrink-0 min-h-[44px]"
          onClick={() => setActiveTab(persona === "admin" ? "admin" : persona === "recycler" ? "compliance" : "snap")}
        >
          <div className="w-11 h-11 rounded-[14px] bg-[#244C3B] text-[#D7F06B] flex items-center justify-center shadow-xs group-hover:bg-[#17352A] transition-colors shrink-0">
            <span className="text-[15px] font-black tracking-[-0.12em] translate-x-[-1px]">KC</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-[#17211D] tracking-tight">
                Kabadiwala Connect
              </span>
            </div>
            <p className="text-xs text-[#617067] hidden md:block max-w-sm truncate mt-0.5">
              Bringing the Informal Collector into the Formal Recycling Chain
            </p>
          </div>
        </div>

        {/* Integrated Compact Live-Rate Ticker */}
        <div className="hidden xl:flex items-center gap-4 border-l border-[#D9E1DB] pl-5 text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-[#17211D]">
            <span className="w-2 h-2 rounded-full bg-[#D7F06B] animate-pulse"></span>
            CPCB Spot:
          </span>
          <span className="text-[#4B5563]">
            Copper <strong className="text-[#12181A] font-semibold">₹710</strong>
          </span>
          <span className="text-[#E5E8E6]">•</span>
          <span className="text-[#4B5563]">
            PCB <strong className="text-[#12181A] font-semibold">₹1,850</strong>
          </span>
          <span className="text-[#E5E8E6]">•</span>
          <span className="text-[#4B5563]">
            Li-ion <strong className="text-[#12181A] font-semibold">₹240</strong>
          </span>
          <button
            onClick={() => setActiveTab("prices")}
            className="text-xs text-[#1E5128] hover:underline font-semibold cursor-pointer pl-1"
          >
            View all →
          </button>
        </div>

        {/* Right Utility Tools: Notification, Audio, Language, Auth & Persona */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notification Center */}
          <NotificationCenter
            notifications={notifications}
            onMarkAllAsRead={onMarkAllAsRead}
            onClearNotifications={onClearNotifications}
            onSelectBid={onSelectBid}
            onAcceptBidDirectly={onAcceptBidDirectly}
            onSimulateIncomingBid={onSimulateIncomingBid}
            language={language}
            activeToast={activeToast}
            onDismissToast={onDismissToast}
            isOpen={isNotificationOpen}
            onToggleOpen={() => setIsNotificationOpen(!isNotificationOpen)}
          />

          {/* Offline Queue & Network Status Pill */}
          <button
            onClick={onOpenOfflineQueueModal}
            title={
              !isOnline || isSimulatedOffline
                ? "Offline Shed Mode Active - Click to Manage Queue & Sync"
                : "Connected to CPCB Ledger - Click to Open Offline Queue"
            }
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors cursor-pointer ${
              !isOnline || isSimulatedOffline
                ? "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                : offlineQueueCount > 0
                ? "bg-[#FEF3C7] text-[#B45309] border-[#FCD34D]"
                : "bg-white text-[#4B5563] border-[#E5E8E6] hover:bg-[#F7F8F6] hover:text-[#12181A]"
            }`}
          >
            {!isOnline || isSimulatedOffline ? (
              <WifiOff className="w-4 h-4 text-[#92400E]" strokeWidth={1.75} />
            ) : (
              <Wifi className="w-4 h-4 text-[#1E5128]" strokeWidth={1.75} />
            )}
            <span className="hidden sm:inline">
              {!isOnline || isSimulatedOffline ? "Offline Shed" : "Online"}
            </span>
            {offlineQueueCount > 0 && (
              <span className="bg-[#B45309] text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                {offlineQueueCount}
              </span>
            )}
          </button>

          {/* Audio Voice Guide Button */}
          <button
            onClick={toggleSound}
            title="Toggle Voice Safety & Price Narration"
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors cursor-pointer ${
              soundEnabled
                ? "bg-[#F0FDF4] text-[#1E5128] border-[#1E5128]/30"
                : "bg-white text-[#4B5563] border-[#E5E8E6] hover:bg-[#F7F8F6] hover:text-[#12181A]"
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#1E5128]" strokeWidth={1.75} />
            ) : (
              <VolumeX className="w-4 h-4 text-[#8A93A0]" strokeWidth={1.75} />
            )}
            <span className="hidden sm:inline">{soundEnabled ? "Voice On" : "Voice Off"}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-[#F7F8F6] border border-[#E5E8E6] p-1 rounded-xl min-h-[44px]">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                language === "en" ? "bg-white text-[#12181A] font-semibold shadow-2xs" : "text-[#4B5563] hover:text-[#12181A]"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                language === "hi" ? "bg-white text-[#12181A] font-semibold shadow-2xs font-hindi" : "text-[#4B5563] hover:text-[#12181A] font-hindi"
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage("mr")}
              className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                language === "mr" ? "bg-white text-[#12181A] font-semibold shadow-2xs font-marathi" : "text-[#4B5563] hover:text-[#12181A] font-marathi"
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Login / User Account Badge with 1-Click Role Switch */}
          <button
            onClick={onOpenAuthModal}
            className="min-h-[44px] px-3 py-1.5 bg-[#F7F8F6] hover:bg-white border border-[#E5E8E6] rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-2xs group text-left"
            title="Account Profile & Demo Logins"
          >
            <div className="w-7 h-7 rounded-lg bg-[#1E5128] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {persona === "admin" ? "AD" : persona === "recycler" ? "RC" : "KB"}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-[#12181A] group-hover:text-[#1E5128] truncate max-w-[110px]">
                {currentUser ? currentUser.name : "Login / Demo"}
              </div>
              <div className="text-[10px] text-[#8A93A0] uppercase font-semibold">
                {persona === "admin" ? "CPCB Admin" : persona === "recycler" ? "Recycler" : "Collector"}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Row 2: Navigation Bar */}
      <div className="relative border-t border-[#E5E8E6] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          {/* Snap & Estimate */}
          <button
            onClick={() => setActiveTab("snap")}
            className={`min-h-[44px] px-3.5 py-2 text-sm rounded-xl shrink-0 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "snap"
                ? "bg-[#12181A] text-white font-semibold"
                : "text-[#4B5563] hover:text-[#12181A] hover:bg-[#F7F8F6] font-medium"
            }`}
          >
            <Camera className="w-4 h-4" strokeWidth={1.75} />
            <span>{UI_STRINGS.snapEstimate[language]}</span>
          </button>

          {/* Price Guide */}
          <button
            onClick={() => setActiveTab("prices")}
            className={`min-h-[44px] px-3.5 py-2 text-sm rounded-xl shrink-0 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "prices"
                ? "bg-[#12181A] text-white font-semibold"
                : "text-[#4B5563] hover:text-[#12181A] hover:bg-[#F7F8F6] font-medium"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" strokeWidth={1.75} />
            <span>{UI_STRINGS.priceGuide[language]}</span>
          </button>

          {/* Live Auction */}
          <button
            onClick={() => setActiveTab("auction")}
            className={`min-h-[44px] px-3.5 py-2 text-sm rounded-xl shrink-0 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "auction"
                ? "bg-[#12181A] text-white font-semibold"
                : "text-[#4B5563] hover:text-[#12181A] hover:bg-[#F7F8F6] font-medium"
            }`}
          >
            <TrendingUp className="w-4 h-4" strokeWidth={1.75} />
            <span>{UI_STRINGS.liveAuction[language]}</span>
            <span className="w-2 h-2 rounded-full bg-[#1E5128] animate-pulse" />
          </button>

          {/* Find Recycler */}
          <button
            onClick={() => setActiveTab("recyclers")}
            className={`min-h-[44px] px-3.5 py-2 text-sm rounded-xl shrink-0 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "recyclers"
                ? "bg-[#12181A] text-white font-semibold"
                : "text-[#4B5563] hover:text-[#12181A] hover:bg-[#F7F8F6] font-medium"
            }`}
          >
            <Building2 className="w-4 h-4" strokeWidth={1.75} />
            <span>{UI_STRINGS.findRecycler[language]}</span>
          </button>

          {/* WhatsApp Bot Simulator */}
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`min-h-[44px] px-3.5 py-2 text-sm rounded-xl shrink-0 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "whatsapp"
                ? "bg-[#12181A] text-white font-semibold"
                : "text-[#4B5563] hover:text-[#12181A] hover:bg-[#F7F8F6] font-medium"
            }`}
          >
            <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
            <span>{UI_STRINGS.whatsAppBot[language]}</span>
          </button>

          {/* Safety Tips */}
          <button
            onClick={() => setActiveTab("safety")}
            className={`min-h-[44px] px-3.5 py-2 text-sm rounded-xl shrink-0 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "safety"
                ? "bg-[#12181A] text-white font-semibold"
                : "text-[#4B5563] hover:text-[#12181A] hover:bg-[#F7F8F6] font-medium"
            }`}
          >
            <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
            <span>{UI_STRINGS.safetyTips[language]}</span>
          </button>

          {/* Earnings Ledger / Receipts */}
          <button
            onClick={() => setActiveTab("ledger")}
            className={`min-h-[44px] px-3.5 py-2 text-sm rounded-xl shrink-0 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "ledger"
                ? "bg-[#12181A] text-white font-semibold"
                : "text-[#4B5563] hover:text-[#12181A] hover:bg-[#F7F8F6] font-medium"
            }`}
          >
            <Coins className="w-4 h-4" strokeWidth={1.75} />
            <span>{UI_STRINGS.digitalReceipts[language]}</span>
          </button>

          {/* Group Pickup */}
          <button
            onClick={() => setActiveTab("group-pool")}
            className={`header-overflow-item min-h-[44px] px-3.5 py-2 text-sm rounded-xl shrink-0 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "group-pool"
                ? "bg-[#12181A] text-white font-semibold"
                : "text-[#4B5563] hover:text-[#12181A] hover:bg-[#F7F8F6] font-medium"
            }`}
          >
            <Truck className="w-4 h-4" strokeWidth={1.75} />
            <span>{UI_STRINGS.groupPickup[language]}</span>
          </button>

          {/* Recycler Portal Tab (if Recycler or Admin) */}
          {(persona === "recycler" || persona === "admin") && (
            <button
              onClick={() => setActiveTab("compliance")}
              className={`header-overflow-item min-h-[44px] px-3.5 py-2 text-sm rounded-xl shrink-0 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "compliance"
                  ? "bg-[#12181A] text-white font-semibold"
                  : "text-[#4B5563] hover:text-[#12181A] hover:bg-[#F7F8F6] font-medium"
              }`}
            >
              <Building2 className="w-4 h-4" strokeWidth={1.75} />
              <span>CPCB Recycler Portal</span>
            </button>
          )}

          {/* Admin & Datasets Tab */}
          <button
            onClick={() => setActiveTab("admin")}
            className={`header-overflow-item min-h-[44px] px-3.5 py-2 text-sm rounded-xl shrink-0 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "admin"
                ? "bg-[#1E5128] text-white font-semibold shadow-xs"
                : "text-[#1E5128] hover:bg-[#F0FDF4] bg-[#F0FDF4]/60 border border-[#1E5128]/20 font-semibold"
            }`}
          >
            <Database className="w-4 h-4" strokeWidth={1.75} />
            <span>CPCB Admin & Datasets</span>
          </button>

          {/* Field Research Tab */}
          <button
            onClick={() => setActiveTab("field-research")}
            className={`header-overflow-item min-h-[44px] px-3.5 py-2 text-sm rounded-xl shrink-0 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "field-research"
                ? "bg-[#12181A] text-white font-semibold shadow-xs"
                : "text-[#4B5563] hover:text-[#12181A] hover:bg-[#F7F8F6] font-medium"
            }`}
          >
            <ClipboardList className="w-4 h-4" strokeWidth={1.75} />
            <span>Field Research</span>
          </button>

          {/* Offline Queue Tab */}
          <button
            onClick={() => setActiveTab("offline-queue")}
            className={`header-overflow-item min-h-[44px] px-3.5 py-2 text-sm rounded-xl shrink-0 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "offline-queue"
                ? "bg-[#92400E] text-white font-semibold shadow-xs"
                : "text-[#92400E] hover:bg-[#FFFBEB] bg-[#FFFBEB]/60 border border-[#FDE68A] font-semibold"
            }`}
          >
            <WifiOff className="w-4 h-4" strokeWidth={1.75} />
            <span>Offline Shed Queue</span>
            {offlineQueueCount > 0 && (
              <span className="bg-[#92400E] text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                {offlineQueueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsMoreOpen((open) => !open)}
            aria-expanded={isMoreOpen}
            className="min-h-[44px] px-3.5 py-2 text-sm rounded-xl shrink-0 flex items-center gap-2 text-[#617067] hover:bg-[#E8F3E9] hover:text-[#244C3B] font-semibold cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span>More</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? "rotate-180" : ""}`} />
          </button>

          {isMoreOpen && (
            <div className="absolute right-4 top-[calc(100%+8px)] z-50 w-64 rounded-2xl border border-[#D9E1DB] bg-white p-2 shadow-xl">
              <button onClick={() => { setActiveTab("group-pool"); setIsMoreOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-[#617067] hover:bg-[#E8F3E9] hover:text-[#244C3B]"><Truck className="w-4 h-4" />Group Pickup</button>
              <button onClick={() => { setActiveTab("compliance"); setIsMoreOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-[#617067] hover:bg-[#E8F3E9] hover:text-[#244C3B]"><Building2 className="w-4 h-4" />Recycler Portal</button>
              <button onClick={() => { setActiveTab("admin"); setIsMoreOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-[#617067] hover:bg-[#E8F3E9] hover:text-[#244C3B]"><Database className="w-4 h-4" />CPCB Admin & Datasets</button>
              <button onClick={() => { setActiveTab("field-research"); setIsMoreOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-[#617067] hover:bg-[#E8F3E9] hover:text-[#244C3B]"><ClipboardList className="w-4 h-4" />Field Research</button>
              <button onClick={() => { setActiveTab("offline-queue"); setIsMoreOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-[#617067] hover:bg-[#FFF4D6] hover:text-[#8A5A00]"><WifiOff className="w-4 h-4" />Offline Shed Queue</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


