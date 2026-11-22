export type ScanStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type RiskLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface SecretFinding {
  id: string;
  scan_id: string;
  rule_id: string;
  secret_type: string;
  file_path: string;
  line_number: number;
  masked_snippet: string;
  entropy_score: number | null;
  severity: Severity;
  remediation_tip: string | null;
  created_at: string;
}

export interface DependencyFinding {
  id: string;
  scan_id: string;
  package_name: string;
  installed_version: string;
  ecosystem: 'PyPI' | 'npm' | string;
  manifest_file: string;
  osv_id: string;
  severity: Severity;
  fixed_version: string | null;
  summary: string | null;
  advisory_url: string | null;
  created_at: string;
}

export interface SeverityBreakdown {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface CategoryBreakdown {
  secrets: number;
  dependencies: number;
}

export interface ReportSummary {
  total_findings: number;
  total_secrets: number;
  total_vulnerabilities: number;
  files_extracted: number;
  scan_duration_seconds: number | null;
  by_severity: SeverityBreakdown;
  by_category: CategoryBreakdown;
}

export interface Scan {
  id: string;
  user_id: string;
  project_name: string;
  source_filename: string;
  file_hash_sha256: string;
  status: ScanStatus;
  total_secrets: number;
  total_vulnerabilities: number;
  risk_level: RiskLevel;
  summary_metrics?: Record<string, any>;
  error_message?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
  created_at: string;
}

export interface ScanReport {
  scan_id: string;
  project_name: string;
  status: ScanStatus;
  risk_level: RiskLevel;
  source_filename: string;
  file_hash_sha256: string;
  created_at: string;
  started_at?: string | null;
  finished_at?: string | null;
  summary: ReportSummary;
  secrets: SecretFinding[];
  dependencies: DependencyFinding[];
}
