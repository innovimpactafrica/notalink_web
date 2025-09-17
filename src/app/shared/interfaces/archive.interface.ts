export interface ArchiveItem {
  id: string;
  title: string;
  dossierNumber: string;
  type: string;
  archivedDate: Date;
  clientName: string;
  icon?: string;
}

export interface ArchiveFilter {
  client: string;
  type: string;
  year: string;
  month: string;
}