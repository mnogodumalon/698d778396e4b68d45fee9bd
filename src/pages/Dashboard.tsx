import { useState, useEffect, useMemo } from 'react';
import type { Datenerfassung } from '@/types/app';
import { LivingAppsService } from '@/services/livingAppsService';
import { formatDistance, parseISO, format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Plus, Pencil, Trash2, Database, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// ─── Record Dialog (Create + Edit) ──────────────────────────────────────────

interface RecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: Datenerfassung | null;
  onSuccess: () => void;
}

function RecordDialog({ open, onOpenChange, record, onSuccess }: RecordDialogProps) {
  const isEditing = !!record;
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    feld_eins: '',
    feld_zwei: '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        feld_eins: record?.fields.feld_eins ?? '',
        feld_zwei: record?.fields.feld_zwei ?? '',
      });
    }
  }, [open, record]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing) {
        await LivingAppsService.updateDatenerfassungEntry(record!.record_id, formData);
        toast.success('Gespeichert', { description: 'Eintrag wurde aktualisiert.' });
      } else {
        await LivingAppsService.createDatenerfassungEntry(formData);
        toast.success('Erstellt', { description: 'Neuer Eintrag wurde erstellt.' });
      }
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error('Fehler', {
        description: `Fehler beim ${isEditing ? 'Speichern' : 'Erstellen'}: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feld_eins">Feld 1</Label>
            <Input
              id="feld_eins"
              value={formData.feld_eins}
              onChange={(e) => setFormData((prev) => ({ ...prev, feld_eins: e.target.value }))}
              placeholder="Feld 1 eingeben..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feld_zwei">Feld 2</Label>
            <Input
              id="feld_zwei"
              value={formData.feld_zwei}
              onChange={(e) => setFormData((prev) => ({ ...prev, feld_zwei: e.target.value }))}
              placeholder="Feld 2 eingeben..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Speichert...' : isEditing ? 'Speichern' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirmation Dialog ─────────────────────────────────────────────

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordName: string;
  onConfirm: () => Promise<void>;
}

function DeleteConfirmDialog({ open, onOpenChange, recordName, onConfirm }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onConfirm();
      toast.success('Geloescht', { description: `"${recordName}" wurde geloescht.` });
      onOpenChange(false);
    } catch {
      toast.error('Fehler', {
        description: 'Eintrag konnte nicht geloescht werden.',
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eintrag loeschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Moechtest du &quot;{recordName}&quot; wirklich loeschen? Diese Aktion kann nicht
            rueckgaengig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleting ? 'Loescht...' : 'Loeschen'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Loading State ──────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8 md:py-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="mb-6 h-36 w-full rounded-xl" />
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Error State ────────────────────────────────────────────────────────────

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="text-center space-y-4 max-w-md px-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Fehler beim Laden</h2>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Erneut versuchen
        </Button>
      </div>
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────

function EmptyState({ onCreateFirst }: { onCreateFirst: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent mb-4">
        <FileText className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">Noch keine Eintraege</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Erstelle deinen ersten Eintrag, um mit der Datenerfassung zu beginnen.
      </p>
      <Button onClick={onCreateFirst}>
        <Plus className="mr-2 h-4 w-4" />
        Ersten Eintrag erstellen
      </Button>
    </div>
  );
}

// ─── Mobile Entry Card ──────────────────────────────────────────────────────

interface EntryCardProps {
  record: Datenerfassung;
  onEdit: () => void;
  onDelete: () => void;
}

function EntryCard({ record, onEdit, onDelete }: EntryCardProps) {
  const createdDate = record.createdat
    ? format(parseISO(record.createdat), 'dd.MM.yyyy', { locale: de })
    : '';

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-3 transition-shadow hover:shadow-md">
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-semibold text-card-foreground">
          {record.fields.feld_eins || '(Kein Wert)'}
        </div>
        <div className="truncate text-[13px] text-muted-foreground">
          {record.fields.feld_zwei || '(Kein Wert)'}
        </div>
      </div>
      <div className="ml-3 flex flex-shrink-0 items-center gap-1">
        <span className="mr-2 hidden text-xs text-muted-foreground sm:inline">{createdDate}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onEdit}
          aria-label="Bearbeiten"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
          aria-label="Loeschen"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────

export default function Dashboard() {
  const [records, setRecords] = useState<Datenerfassung[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // CRUD dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editRecord, setEditRecord] = useState<Datenerfassung | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<Datenerfassung | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const data = await LivingAppsService.getDatenerfassung();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Sorted records (newest first)
  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => (b.createdat ?? '').localeCompare(a.createdat ?? '')),
    [records]
  );

  // Recent entries (top 5)
  const recentEntries = useMemo(() => sortedRecords.slice(0, 5), [sortedRecords]);

  // Last updated relative time
  const lastUpdatedText = useMemo(() => {
    if (sortedRecords.length === 0) return null;
    const newest = sortedRecords[0];
    const dateStr = newest.updatedat ?? newest.createdat;
    if (!dateStr) return null;
    try {
      return formatDistance(parseISO(dateStr), new Date(), { addSuffix: true, locale: de });
    } catch {
      return null;
    }
  }, [sortedRecords]);

  async function handleDelete() {
    if (!deleteRecord) return;
    await LivingAppsService.deleteDatenerfassungEntry(deleteRecord.record_id);
    setDeleteRecord(null);
    fetchData();
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchData} />;

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="mx-auto max-w-[1200px] px-4 pt-6 pb-2 md:px-8 md:pt-8">
        <h1 className="text-xl font-bold text-foreground md:text-2xl">Datenerfassung</h1>
      </header>

      {/* ── Content ────────────────────────────────────────────── */}
      <main className="mx-auto max-w-[1200px] px-4 pb-24 md:px-8 md:pb-8">
        {/* Desktop: 2-column layout */}
        <div className="md:grid md:grid-cols-[2fr_1fr] md:gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* ── Hero KPI ─────────────────────────────────────── */}
            <Card className="relative overflow-hidden border-l-4 border-l-primary shadow-sm animate-in fade-in duration-500">
              <CardContent className="p-6 md:p-8">
                <p className="text-[13px] font-medium text-muted-foreground md:text-sm">
                  Eintraege gesamt
                </p>
                <p className="mt-1 text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
                  {records.length}
                </p>
                {lastUpdatedText && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Zuletzt aktualisiert: {lastUpdatedText}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* ── All Entries Section ──────────────────────────── */}
            <div className="animate-in fade-in duration-500 delay-150">
              {/* Section Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground md:text-lg">Alle Eintraege</h2>
                  <Badge variant="secondary" className="font-semibold">
                    {records.length}
                  </Badge>
                </div>
                {/* Desktop: Create Button in header */}
                <Button
                  size="sm"
                  className="hidden md:inline-flex"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Neuen Eintrag erstellen
                </Button>
              </div>

              {records.length === 0 ? (
                <EmptyState onCreateFirst={() => setShowCreateDialog(true)} />
              ) : (
                <>
                  {/* ── Mobile: Card List ────────────────────────── */}
                  <div className="space-y-2 md:hidden">
                    {sortedRecords.map((record) => (
                      <EntryCard
                        key={record.record_id}
                        record={record}
                        onEdit={() => setEditRecord(record)}
                        onDelete={() => setDeleteRecord(record)}
                      />
                    ))}
                  </div>

                  {/* ── Desktop: Table ───────────────────────────── */}
                  <Card className="hidden overflow-hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Feld 1
                          </TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Feld 2
                          </TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Erstellt am
                          </TableHead>
                          <TableHead className="w-[100px] text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Aktionen
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedRecords.map((record, idx) => (
                          <TableRow
                            key={record.record_id}
                            className={`transition-colors hover:bg-muted/50 ${idx % 2 === 1 ? 'bg-muted/25' : ''}`}
                          >
                            <TableCell className="font-medium">
                              {record.fields.feld_eins || '(Kein Wert)'}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {record.fields.feld_zwei || '(Kein Wert)'}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {record.createdat
                                ? format(parseISO(record.createdat), 'dd.MM.yyyy HH:mm', {
                                    locale: de,
                                  })
                                : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setEditRecord(record)}
                                  aria-label="Bearbeiten"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => setDeleteRecord(record)}
                                  aria-label="Loeschen"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </>
              )}
            </div>
          </div>

          {/* ── Right Column: Recent Entries (Desktop only) ────── */}
          <div className="hidden md:block animate-in fade-in duration-500 delay-300">
            <Card className="border-l-4 border-l-primary sticky top-8">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Letzte Eintraege</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {recentEntries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Noch keine Eintraege vorhanden.</p>
                ) : (
                  <div className="space-y-0">
                    {recentEntries.map((entry, idx) => {
                      const relTime = entry.createdat
                        ? formatDistance(parseISO(entry.createdat), new Date(), {
                            addSuffix: true,
                            locale: de,
                          })
                        : '';
                      return (
                        <div key={entry.record_id}>
                          {idx > 0 && <Separator className="my-3" />}
                          <div className="space-y-0.5">
                            <p className="truncate text-sm font-medium text-foreground">
                              {entry.fields.feld_eins || '(Kein Wert)'}
                            </p>
                            <p className="truncate text-[13px] text-muted-foreground">
                              {entry.fields.feld_zwei || '(Kein Wert)'}
                            </p>
                            <p className="text-xs text-muted-foreground">{relTime}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* ── Mobile: Fixed Bottom Action Button ─────────────────── */}
      <div className="fixed inset-x-0 bottom-0 border-t bg-background/95 p-4 backdrop-blur-sm md:hidden">
        <Button className="h-12 w-full rounded-xl text-base font-semibold" onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-5 w-5" />
          Neuen Eintrag erstellen
        </Button>
      </div>

      {/* ── Dialogs ────────────────────────────────────────────── */}
      <RecordDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        record={null}
        onSuccess={fetchData}
      />

      <RecordDialog
        open={!!editRecord}
        onOpenChange={(open) => !open && setEditRecord(null)}
        record={editRecord}
        onSuccess={fetchData}
      />

      <DeleteConfirmDialog
        open={!!deleteRecord}
        onOpenChange={(open) => !open && setDeleteRecord(null)}
        recordName={deleteRecord?.fields.feld_eins || 'Eintrag'}
        onConfirm={handleDelete}
      />
    </div>
  );
}
