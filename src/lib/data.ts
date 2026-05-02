import { promises as fs } from 'fs';
import path from 'path';
import { NDASubmission, NDALog, DownloadEntry, DownloadLog, Lead, LeadsLog, VisitorEntry, AnalyticsData } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJSON<T>(filename: string, defaultValue: T): Promise<T> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
}

async function writeJSON<T>(filename: string, data: T): Promise<void> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Silently fail in serverless environments where filesystem is read-only
    console.warn(`[data] Could not write to ${filename} - filesystem may be read-only`);
  }
}

// NDA Log Operations
export async function getNDALog(): Promise<NDALog> {
  return readJSON<NDALog>('nda_log.json', { submissions: [] });
}

export async function appendNDASubmission(submission: NDASubmission): Promise<void> {
  const log = await getNDALog();
  log.submissions.push(submission);
  await writeJSON('nda_log.json', log);
}

// Download Log Operations
export async function getDownloadLog(): Promise<DownloadLog> {
  return readJSON<DownloadLog>('download_log.json', { downloads: [] });
}

export async function appendDownload(entry: DownloadEntry): Promise<void> {
  const log = await getDownloadLog();
  log.downloads.push(entry);
  await writeJSON('download_log.json', log);
}

// Leads Operations
export async function getLeads(): Promise<LeadsLog> {
  return readJSON<LeadsLog>('leads.json', { leads: [] });
}

export async function appendLead(lead: Lead): Promise<void> {
  const log = await getLeads();
  log.leads.push(lead);
  await writeJSON('leads.json', log);
}

// Analytics Operations
export async function getAnalytics(): Promise<AnalyticsData> {
  return readJSON<AnalyticsData>('analytics.json', { visitors: [] });
}

export async function updateVisitor(visitor: VisitorEntry): Promise<void> {
  const data = await getAnalytics();
  const existingIndex = data.visitors.findIndex(v => v.sessionId === visitor.sessionId);
  
  if (existingIndex >= 0) {
    data.visitors[existingIndex] = visitor;
  } else {
    data.visitors.push(visitor);
  }
  
  await writeJSON('analytics.json', data);
}

// Utility to clear data older than 90 days (PDPA compliance)
export async function cleanupOldData(): Promise<void> {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  // Clean NDA log
  const ndaLog = await getNDALog();
  ndaLog.submissions = ndaLog.submissions.filter(
    s => new Date(s.timestamp) > ninetyDaysAgo
  );
  await writeJSON('nda_log.json', ndaLog);
  
  // Clean download log
  const downloadLog = await getDownloadLog();
  downloadLog.downloads = downloadLog.downloads.filter(
    d => new Date(d.timestamp) > ninetyDaysAgo
  );
  await writeJSON('download_log.json', downloadLog);
  
  // Clean analytics
  const analytics = await getAnalytics();
  analytics.visitors = analytics.visitors.filter(
    v => new Date(v.firstVisit) > ninetyDaysAgo
  );
  await writeJSON('analytics.json', analytics);
}
