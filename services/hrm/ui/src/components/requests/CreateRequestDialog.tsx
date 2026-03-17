import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
  Button, Input, Label, Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@venizia/ardor-ui-kit';
import { Plus } from 'lucide-react';
import type { RequestType } from '@/types';

interface CreateRequestDialogProps {
  onSubmit: (data: { type: RequestType; title: string; description: string }) => Promise<void> | void;
  isLoading?: boolean;
}

export function CreateRequestDialog({ onSubmit, isLoading }: CreateRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<RequestType>('leave');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({ type, title, description });
      setType('leave');
      setTitle('');
      setDescription('');
      setOpen(false);
    } catch {
      // Keep dialog open with form data on failure
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Request
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as RequestType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="leave">Leave</SelectItem>
                <SelectItem value="asset">Asset</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-[hsl(var(--primary))] text-white" disabled={isLoading}>Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
