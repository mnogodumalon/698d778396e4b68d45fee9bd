// AUTOMATICALLY GENERATED SERVICE
import { APP_IDS } from '@/types/app';
import type { Datenerfassung } from '@/types/app';

// Base Configuration
const API_BASE_URL = 'https://my.living-apps.de/rest';

// --- HELPER FUNCTIONS ---
export function extractRecordId(url: string | null | undefined): string | null {
  if (!url) return null;
  // Extrahiere die letzten 24 Hex-Zeichen mit Regex
  const match = url.match(/([a-f0-9]{24})$/i);
  return match ? match[1] : null;
}

export function createRecordUrl(appId: string, recordId: string): string {
  return `https://my.living-apps.de/rest/apps/${appId}/records/${recordId}`;
}

async function callApi(method: string, endpoint: string, data?: any) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // Nutze Session Cookies für Auth
    body: data ? JSON.stringify(data) : undefined
  });
  if (!response.ok) throw new Error(await response.text());
  // DELETE returns often empty body or simple status
  if (method === 'DELETE') return true;
  return response.json();
}

export class LivingAppsService {
  // --- DATENERFASSUNG ---
  static async getDatenerfassung(): Promise<Datenerfassung[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.DATENERFASSUNG}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getDatenerfassungEntry(id: string): Promise<Datenerfassung | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.DATENERFASSUNG}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createDatenerfassungEntry(fields: Datenerfassung['fields']) {
    return callApi('POST', `/apps/${APP_IDS.DATENERFASSUNG}/records`, { fields });
  }
  static async updateDatenerfassungEntry(id: string, fields: Partial<Datenerfassung['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.DATENERFASSUNG}/records/${id}`, { fields });
  }
  static async deleteDatenerfassungEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.DATENERFASSUNG}/records/${id}`);
  }

}