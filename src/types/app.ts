// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export interface Datenerfassung {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    feld_eins?: string;
    feld_zwei?: string;
  };
}

export const APP_IDS = {
  DATENERFASSUNG: '698d77713243f76fa48f2999',
} as const;

// Helper Types for creating new records
export type CreateDatenerfassung = Datenerfassung['fields'];