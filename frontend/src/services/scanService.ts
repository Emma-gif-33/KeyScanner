import { request } from '../core/apiClient';
import { Scan, ScanReport } from '../types';

export interface ScanListResponse {
  total: number;
  scans: Scan[];
}

export const scanService = {
  async uploadScan(file: File, projectName?: string): Promise<Scan> {
    const formData = new FormData();
    formData.append('file', file);
    if (projectName && projectName.trim()) {
      formData.append('project_name', projectName.trim());
    }

    return request<Scan>('/scans/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async listScans(): Promise<ScanListResponse> {
    return request<ScanListResponse>('/scans');
  },

  async getScan(scanId: string): Promise<Scan> {
    return request<Scan>(`/scans/${scanId}`);
  },

  async getScanReport(scanId: string): Promise<ScanReport> {
    return request<ScanReport>(`/scans/${scanId}/report`);
  },

  async deleteScan(scanId: string): Promise<void> {
    return request<void>(`/scans/${scanId}`, {
      method: 'DELETE',
    });
  },
};
