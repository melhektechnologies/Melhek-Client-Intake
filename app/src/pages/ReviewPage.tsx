import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '@/store/formStore';
import {
  Briefcase, Building, GitBranch, Package, Monitor, AlertOctagon,
  BarChart3, Lock, Target, ShieldCheck, FileText, ChevronDown, Send,
  Check, ArrowLeft, AlertTriangle, ExternalLink
} from 'lucide-react';
import gsap from 'gsap';

interface RS {
  id: string;
  icon: React.ElementType;
  title: string;
  step: number;
}

const SECTIONS: RS[] = [
  { id: 'businessInfo', icon: Briefcase, title: 'Business Information', step: 1 },
  { id: 'businessOverview', icon: Building, title: 'Business Overview', step: 2 },
  { id: 'currentWorkflow', icon: GitBranch, title: 'Current Workflow', step: 3 },
  { id: 'inventory', icon: Package, title: 'Inventory Structure', step: 4 },
  { id: 'currentSoftware', icon: Monitor, title: 'Current Software & Systems', step: 5 },
  { id: 'businessChallenges', icon: AlertOctagon, title: 'Business Challenges', step: 6 },
  { id: 'reporting', icon: BarChart3, title: 'Reporting & Decisions', step: 7 },
  { id: 'securityRoles', icon: Lock, title: 'Security & Access Roles', step: 8 },
  { id: 'projectGoals', icon: Target, title: 'Project Goals', step: 9 },
  { id: 'projectQualification', icon: ShieldCheck, title: 'Project Qualification', step: 10 },
  { id: 'additionalNotes', icon: FileText, title: 'Additional Notes', step: 11 },
];

const BT_LABELS: Record<string, string> = {
  'sole-proprietorship': 'Sole Proprietorship',
  'partnership': 'Partnership',
  'private-limited': 'Private Limited Company (PLC)',
  'share-company': 'Share Company (SC)',
  'ngo': 'NGO / Non-Profit',
  'government': 'Government / Public Entity',
  'other': 'Other',
};

const SALES_LABELS: Record<string, string> = {
  'under-50k': 'Under ETB 50,000',
  '50k-200k': 'ETB 50,000 – 200,000',
  '200k-500k': 'ETB 200,000 – 500,000',
  '500k-1m': 'ETB 500,000 – 1,000,000',
  '1m-5m': 'ETB 1,000,000 – 5,000,000',
  'above-5m': 'Above ETB 5,000,000',
  'prefer-not': 'Prefer not to disclose',
};

const EXPORT_LABELS: Record<string, string> = {
  'csv': 'CSV Export',
  'excel': 'Excel Export',
  'api': 'API Integration',
  'database': 'Direct Database Access',
  'pos-integrate': 'POS Can Integrate',
  'unknown': 'Not Sure',
  'none': 'None Available',
};

const PERM_LABELS: Record<string, string> = {
  'yes-same': 'Yes — same permissions for everyone',
  'no-restricted': 'No — restricted roles & access layers',
  'undecided': 'Undecided — need consulting support',
};

const URGENCY_LABELS: Record<string, string> = {
  'immediately': 'Immediately (Crucial need)',
  '1-month': 'Within 1 Month',
  '1-3-months': '1 – 3 Months',
  'researching': 'Just Researching / Planning',
};

const DM_LABELS: Record<string, string> = {
  'owner': 'Business Owner',
  'partners': 'Managing Partners',
  'manager': 'General Manager',
  'board': 'Board of Directors',
};

const BUDGET_LABELS: Record<string, string> = {
  'yes': 'Yes — Approved',
  'no': 'No — Building case',
  'not-yet': 'Not Yet — Open to typical pricing guidance',
};

function Field({ label, value }: { label: string; value?: string | string[] | boolean }) {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return null;
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;

  return (
    <div style={{ marginBottom: 12 }}>
      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4, letterSpacing: '0.08em' }}>
        {label.toUpperCase()}
      </span>
      {Array.isArray(displayValue) ? (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {displayValue.map((v, i) => <span key={i} className="tag-pill">{v}</span>)}
        </div>
      ) : (
        <p style={{ fontSize: 13.5, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
          {displayValue}
        </p>
      )}
    </div>
  );
}

function ReviewCard({ s, expanded, onToggle, onEdit, children }: {
  s: RS; expanded: boolean; onToggle: () => void; onEdit: () => void; children: React.ReactNode;
}) {
  const Icon = s.icon;
  return (
    <div
      className="overflow-hidden transition-all duration-300"
      style={{
        background: expanded ? 'rgba(7,15,60,0.7)' : 'rgba(7,15,60,0.3)',
        border: `1px solid ${expanded ? 'rgba(127,169,255,0.25)' : 'var(--border)'}`,
        borderRadius: 16,
        boxShadow: expanded ? '0 0 30px rgba(127,169,255,0.06)' : 'none',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left transition-all duration-200 p-4 sm:p-5"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300"
            style={{
              width: 40, height: 40,
              background: expanded ? 'var(--electric)' : 'rgba(127,169,255,0.08)',
              border: `1px solid ${expanded ? 'transparent' : 'var(--border)'}`,
            }}
          >
            <Icon size={18} color={expanded ? 'var(--dark)' : 'var(--electric-dim)'} />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--ice)' }}>
              {s.title}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              SECTION {String(s.step).padStart(2, '0')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--electric-dim)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--electric)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--electric-dim)')}
          >
            <ExternalLink size={12} />
            Edit
          </button>
          <div style={{
            transition: 'transform 0.3s ease',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          }}>
            <ChevronDown size={18} color="var(--text-tertiary)" />
          </div>
        </div>
      </button>

      {expanded && (
        <div
          className="px-5 pb-5 space-y-4"
          style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function ReviewPage() {
  const { formData, validateStep, clearErrors, setSubmissionId, saveDraft } = useFormStore();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['businessInfo']));
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (pageRef.current) {
      gsap.fromTo(Array.from(pageRef.current.querySelectorAll('[data-card]')), 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'power2.out' }
      );
    }
  }, []);

  const toggle = (id: string) =>
    setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleSubmit = async () => {
    setValidationError(null);
    clearErrors();
    let firstBad = -1;
    for (let i = 1; i <= 11; i++) {
      if (!validateStep(i)) { firstBad = i; break; }
    }
    if (firstBad !== -1) {
      setValidationError(`Section ${firstBad} is incomplete. Please click 'Edit' next to Section ${firstBad} to finish it.`);
      return;
    }
    if (!confirmed) { setValidationError('Please check the confirmation box below to verify your information.'); return; }

    setSubmitting(true);
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    const id = `MT-${year}-${rand}`;
    setSubmissionId(id);
    saveDraft();

    // Direct submit to Google Sheets
    const webAppUrl = import.meta.env.VITE_GOOGLE_SHEET_WEBAPP;
    const isPlaceholder = webAppUrl === 'https://api.example.com';
    
    if (webAppUrl && !isPlaceholder) {
      try {
        await fetch(webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ id, ...formData }),
        });
      } catch (error) {
        console.error('Submission failed:', error);
      }
    } else {
      await new Promise((r) => setTimeout(r, 1800));
    }

    setSubmitting(false);
    navigate(`/success?id=${id}`);
  };

  const bi = formData.businessInfo;
  const bo = formData.businessOverview;
  const cw = formData.currentWorkflow;
  const iv = formData.inventory;
  const cs = formData.currentSoftware;
  const bc = formData.businessChallenges;
  const rp = formData.reporting;
  const sr = formData.securityRoles;
  const pg = formData.projectGoals;
  const pq = formData.projectQualification;
  const an = formData.additionalNotes;

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--dark)' }}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.035]" style={{
        backgroundImage: 'radial-gradient(circle, #7fa9ff 1px, transparent 1px)',
        backgroundSize: '40px 40px', zIndex: 0,
      }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 border-b"
        style={{
          height: 68, background: 'rgba(5,8,22,0.9)',
          backdropFilter: 'blur(20px)', borderColor: 'var(--border)',
        }}
      >
        <img src="/melhek-logo.png" alt="Melhek" className="h-9" />
        <button
          onClick={() => navigate('/step/11')}
          className="flex items-center gap-2 transition-colors"
          style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--electric)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </nav>

      <main className="relative z-10 py-12 px-4">
        <div ref={pageRef} style={{ maxWidth: 860, margin: '0 auto' }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,52px)',
              fontWeight: 800, color: 'var(--ice)', letterSpacing: '-0.03em',
            }}>
              Review Assessment{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--electric-dim), var(--electric-bright))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Brief
              </span>
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 12 }}>
              Please review your operational profiles, goals, and qualifiers before final transmission.
            </p>
            {validationError && (
              <div className="mt-6 flex items-center justify-center gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}>
                <AlertTriangle size={16} color="var(--error)" />
                <span style={{ fontSize: 14, color: 'var(--error)', fontWeight: 600 }}>{validationError}</span>
              </div>
            )}
          </div>

          {/* Cards */}
          <div className="space-y-3.5">
            {/* 1 Business Info */}
            <div data-card>
              <ReviewCard s={SECTIONS[0]} expanded={expanded.has('businessInfo')} onToggle={() => toggle('businessInfo')} onEdit={() => navigate('/step/1')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Business Name" value={bi.businessName} />
                  <Field label="Industry" value={bi.industry} />
                  <Field label="Business Type" value={BT_LABELS[bi.businessType] || bi.businessType} />
                  <Field label="Branches" value={bi.branches} />
                  <Field label="Address" value={bi.address} />
                  <Field label="Website" value={bi.website} />
                  <Field label="Facebook" value={bi.facebook} />
                  <Field label="Instagram" value={bi.instagram} />
                  <Field label="Contact Person" value={bi.contactPerson} />
                  <Field label="Position" value={bi.position} />
                  <Field label="Phone" value={bi.phone} />
                  <Field label="Email" value={bi.email} />
                </div>
              </ReviewCard>
            </div>

            {/* 2 Business Overview */}
            <div data-card>
              <ReviewCard s={SECTIONS[1]} expanded={expanded.has('businessOverview')} onToggle={() => toggle('businessOverview')} onEdit={() => navigate('/step/2')}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Field label="Years in Operation" value={bo.yearsInOperation} />
                  <Field label="Total Employees" value={bo.totalEmployees} />
                  <Field label="Cashiers" value={bo.cashiers} />
                  <Field label="Managers" value={bo.managers} />
                  <Field label="Storekeepers" value={bo.storekeepers} />
                  <Field label="Daily Customers" value={bo.dailyCustomers} />
                </div>
                <Field label="Monthly Sales Range" value={SALES_LABELS[bo.monthlySalesRange] || bo.monthlySalesRange} />
                <Field label="Products / Services Description" value={bo.productsServices} />
                <Field label="Strategic Business Goals" value={bo.businessGoals} />
              </ReviewCard>
            </div>

            {/* 3 Current Workflow */}
            <div data-card>
              <ReviewCard s={SECTIONS[2]} expanded={expanded.has('currentWorkflow')} onToggle={() => toggle('currentWorkflow')} onEdit={() => navigate('/step/3')}>
                <Field label="Product Purchasing Process" value={cw.purchasing} />
                <Field label="Stock Deliveries & Arrival" value={cw.stockArrival} />
                <Field label="Incoming Stock Recording" value={cw.stockRecording} />
                <Field label="Stock Quantity Updates (Post-sale)" value={cw.stockUpdates} />
                <Field label="Checkout & Sales Process" value={cw.salesProcess} />
                <Field label="Receipt & Invoice Issuance" value={cw.receipts} />
                <Field label="Restocking Approval Chain" value={cw.purchaseApprovals} />
                <Field label="Customer Returns & Exchanges" value={cw.returns} />
                <Field label="Damaged & Expired Items Ledger" value={cw.damagedItems} />
                <Field label="Inventory Discrepancy Corrections" value={cw.inventoryCorrections} />
                <Field label="Month-End Counting Protocol" value={cw.monthEndCounting} />
                <Field label="Year-End Counting Protocol" value={cw.yearEndCounting} />
              </ReviewCard>
            </div>

            {/* 4 Inventory Structure */}
            <div data-card>
              <ReviewCard s={SECTIONS[3]} expanded={expanded.has('inventory')} onToggle={() => toggle('inventory')} onEdit={() => navigate('/step/4')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Approximate SKUs" value={iv.approximateProducts} />
                  <Field label="Weekly Stock Arrivals" value={iv.weeklyStockArrivals} />
                  <Field label="Units of Measurement" value={iv.unitsOfMeasurement} />
                  <Field label="Barcode Usage Status" value={iv.barcodes} />
                  <Field label="Supplier Code Matching" value={iv.supplierCodes} />
                  <Field label="Stock Movement Between Branches" value={iv.multipleBranches} />
                </div>
                <Field label="Warehouse Locations" value={iv.warehouseLocations} />
                <Field label="Product Categories" value={iv.categories} />
                <Field label="Fast-Moving Inventory" value={iv.fastMovingProducts} />
                <Field label="Slow-Moving Inventory" value={iv.slowMovingProducts} />
                <Field label="Difficult-to-Track Inventory" value={iv.difficultToTrack} />
              </ReviewCard>
            </div>

            {/* 5 Current Software & Systems */}
            <div data-card>
              <ReviewCard s={SECTIONS[4]} expanded={expanded.has('currentSoftware')} onToggle={() => toggle('currentSoftware')} onEdit={() => navigate('/step/5')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="POS System" value={cs.posSystem} />
                  <Field label="Inventory Software" value={cs.inventorySoftware} />
                  <Field label="Accounting Software" value={cs.accountingSoftware} />
                  <Field label="Cloud Storage Provider" value={cs.cloudStorage} />
                  <Field label="Uses Excel" value={cs.usesExcel} />
                  <Field label="Uses Paper Ledgers" value={cs.paperRecords} />
                </div>
                <Field label="System Data Export Capabilities" value={cs.exportCapabilities.map(x => EXPORT_LABELS[x] || x)} />
              </ReviewCard>
            </div>

            {/* 6 Business Challenges */}
            <div data-card>
              <ReviewCard s={SECTIONS[5]} expanded={expanded.has('businessChallenges')} onToggle={() => toggle('businessChallenges')} onEdit={() => navigate('/step/6')}>
                <Field label="Operational Time Waste" value={bc.timeWaste} />
                <Field label="Key Inventory Challenge" value={bc.inventoryChallenge} />
                <Field label="Key Sales Challenge" value={bc.salesChallenge} />
                <Field label="Common Employee Mistakes" value={bc.employeeMistakes} />
                <Field label="Costliest Recurring Problem" value={bc.recurringProblem} />
                <Field label="Direct Financial Loss Points" value={bc.moneyLoss} />
                <Field label="Direct Time Loss Points" value={bc.timeLoss} />
                <Field label="System Frustrations" value={bc.frustration} />
                <Field label="Customer Service Impact" value={bc.customerImpact} />
              </ReviewCard>
            </div>

            {/* 7 Reporting & Decisions */}
            <div data-card>
              <ReviewCard s={SECTIONS[6]} expanded={expanded.has('reporting')} onToggle={() => toggle('reporting')} onEdit={() => navigate('/step/7')}>
                <Field label="Crucial Decision Reports" value={rp.selectedReports} />
                <Field label="Daily Opening Information Needs" value={rp.morningInformation} />
              </ReviewCard>
            </div>

            {/* 8 Security & Access Roles */}
            <div data-card>
              <ReviewCard s={SECTIONS[7]} expanded={expanded.has('securityRoles')} onToggle={() => toggle('securityRoles')} onEdit={() => navigate('/step/8')}>
                <Field label="Expected System Roles" value={sr.userRoles.map(x => x.toUpperCase())} />
                <Field label="Equal System Permissions" value={PERM_LABELS[sr.samePermissions] || sr.samePermissions} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <Field label="Stock adjustment approver" value={sr.stockAdjustmentApprover} />
                  <Field label="Price change approver" value={sr.priceChangeApprover} />
                  <Field label="Delete records approver" value={sr.deleteRecordsApprover} />
                </div>
              </ReviewCard>
            </div>

            {/* 9 Project Goals */}
            <div data-card>
              <ReviewCard s={SECTIONS[8]} expanded={expanded.has('projectGoals')} onToggle={() => toggle('projectGoals')} onEdit={() => navigate('/step/9')}>
                <Field label="Operational Trigger Event (Why Now)" value={pg.whyNow} />
                <Field label="6-Month Success Definition" value={pg.successDefinition} />
                <Field label="Top Three Expected Improvements" value={pg.topImprovements} />
                <Field label="Target Manual Processes to Eliminate" value={pg.manualWorkToEliminate} />
                <Field label="Strategic Loss from Inaction" value={pg.ifNothingChanges} />
              </ReviewCard>
            </div>

            {/* 10 Project Qualification */}
            <div data-card>
              <ReviewCard s={SECTIONS[9]} expanded={expanded.has('projectQualification')} onToggle={() => toggle('projectQualification')} onEdit={() => navigate('/step/10')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Project Urgency" value={URGENCY_LABELS[pq.urgency] || pq.urgency} />
                  <Field label="Final Decision Authority" value={DM_LABELS[pq.decisionMaker] || pq.decisionMaker} />
                  <Field label="Dedicated Budget Allocated" value={BUDGET_LABELS[pq.budgetAllocated] || pq.budgetAllocated} />
                  <Field label="Expected Investment Range" value={pq.investmentRange} />
                  <Field label="Spoken with another software company?" value={pq.spokenToVendor} />
                </div>
                {pq.spokenToVendor === 'yes' && <Field label="Previous Vendor Proposals" value={pq.vendorProposal} />}
              </ReviewCard>
            </div>

            {/* 11 Additional Notes */}
            <div data-card>
              <ReviewCard s={SECTIONS[10]} expanded={expanded.has('additionalNotes')} onToggle={() => toggle('additionalNotes')} onEdit={() => navigate('/step/11')}>
                <Field label="Consulting Context & Notes" value={an.notes} />
              </ReviewCard>
            </div>
          </div>

          {/* Submit Block */}
          <div className="mt-12 p-8 rounded-2xl"
            style={{
              background: 'rgba(7,15,60,0.7)',
              border: '1px solid rgba(127,169,255,0.2)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 60px rgba(127,169,255,0.05)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ background: 'rgba(127,169,255,0.1)', border: '1px solid var(--border)' }}>
                <Lock size={18} color="var(--electric-dim)" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ice)' }}>Encrypted & Confidential</p>
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>This discovery profile will be evaluated confidentially by Melhek Solutions Architects.</p>
              </div>
            </div>

            <label className="flex gap-4 cursor-pointer items-start">
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-lg mt-0.5 transition-all duration-200"
                style={{
                  width: 22, height: 22,
                  background: confirmed ? 'var(--electric)' : 'transparent',
                  border: `2px solid ${confirmed ? 'var(--electric)' : 'rgba(127,169,255,0.3)'}`,
                  boxShadow: confirmed ? '0 0 10px rgba(127,169,255,0.4)' : 'none',
                }}
              >
                {confirmed && <Check size={13} color="var(--dark)" strokeWidth={3.5} />}
              </div>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="sr-only"
              />
              <span style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6 }}>
                I confirm this discovery assessment accurately reflects our business requirements and goals.
              </span>
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary btn-submit w-full mt-6 py-5 text-lg"
              style={{ borderRadius: 14, justifyContent: 'center', opacity: confirmed ? 1 : 0.5 }}
            >
              {submitting ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                    <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Transmitting Discovery Profile...
                </span>
              ) : (
                <>
                  <Send size={20} />
                  Submit Discovery Profile
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
