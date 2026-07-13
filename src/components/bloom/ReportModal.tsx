'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

const REPORT_REASONS = [
  'Harassment or bullying',
  'Hate speech',
  'Self-harm or suicide content',
  'Eating disorder content',
  'Explicit or sexual content',
  'Spam or misleading',
  'Underage user (under 15)',
  'Other',
];

export default function ReportModal() {
  const { showReportModal, setShowReportModal, reportTargetEntryId, currentUser } = useAppStore();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason || !currentUser || !reportTargetEntryId) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporterId: currentUser.id, targetEntryId: reportTargetEntryId, reason, description }),
      });
      if (res.ok) {
        toast.success('Report submitted. Thank you for keeping Bloom safe 💜');
        setShowReportModal(false);
        setReason('');
        setDescription('');
      }
    } catch {
      toast.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Report Content
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Help us keep Bloom safe. Your report will be reviewed by our moderation team.
          </p>
          <div>
            <Label className="mb-2 block text-sm">Reason</Label>
            <div className="flex flex-wrap gap-1.5">
              {REPORT_REASONS.map(r => (
                <Badge
                  key={r}
                  variant={reason === r ? 'destructive' : 'outline'}
                  className="cursor-pointer rounded-full text-xs"
                  onClick={() => setReason(r)}
                >
                  {reason === r && '⚠️ '}{r}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-1 block text-sm">Additional details (optional)</Label>
            <Textarea
              placeholder="Tell us more about what happened..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="rounded-xl"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowReportModal(false)}>Cancel</Button>
            <Button
              className="flex-1 rounded-xl"
              onClick={handleSubmit}
              disabled={!reason || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}