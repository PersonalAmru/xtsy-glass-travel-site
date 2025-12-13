import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Trash2, Shield, Info, AlertTriangle } from 'lucide-react';
import { useGDPRCompliance } from '../hooks/useGDPRCompliance';
import { useToast } from '@/components/ui/use-toast';

interface GDPRComplianceModalProps {
  children: React.ReactNode;
}

export const GDPRComplianceModal = ({ children }: GDPRComplianceModalProps) => {
  const [open, setOpen] = useState(false);
  const [dataSummary, setDataSummary] = useState<any>(null);
  const [deletionInfo, setDeletionInfo] = useState<any>(null);
  const [deletionReason, setDeletionReason] = useState('');
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  
  const { 
    loading, 
    error, 
    exportUserData, 
    getDataSummary, 
    getDeletionInfo, 
    deleteUserData 
  } = useGDPRCompliance();
  
  const { toast } = useToast();

  const handleOpenChange = async (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      try {
        const [summary, deletion] = await Promise.all([
          getDataSummary(),
          getDeletionInfo()
        ]);
        setDataSummary(summary);
        setDeletionInfo(deletion);
      } catch (err) {
        console.error('Error loading GDPR data:', err);
      }
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      await exportUserData({ format });
      toast({
        title: "Data Export Successful",
        description: `Your data has been exported as ${format.toUpperCase()} format.`,
      });
    } catch (err: any) {
      toast({
        title: "Export Failed",
        description: err.message || "Failed to export your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!confirmDeletion) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that you understand the consequences of data deletion.",
        variant: "destructive"
      });
      return;
    }

    try {
      await deleteUserData(true, deletionReason);
      toast({
        title: "Account Deleted",
        description: "Your account and personal data have been successfully deleted.",
      });
      setOpen(false);
      // User will be automatically logged out
    } catch (err: any) {
      toast({
        title: "Deletion Failed",
        description: err.message || "Failed to delete your data. Please contact support.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        data-testid="gdpr-modal"
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(calc(100vw - 16px), 56rem)',
          maxWidth: '56rem',
          maxHeight: 'min(calc(100vh - 32px), 90vh)',
          boxSizing: 'border-box',
          margin: 0,
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            GDPR Data Rights & Privacy
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="delete">Delete Account</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Your Data Rights
                </CardTitle>
                <CardDescription>
                  Under GDPR, you have the following rights regarding your personal data:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Badge variant="outline" className="p-2 justify-start">
                    Right to Access - Export your data
                  </Badge>
                  <Badge variant="outline" className="p-2 justify-start">
                    Right to Erasure - Delete your data
                  </Badge>
                  <Badge variant="outline" className="p-2 justify-start">
                    Right to Rectification - Update incorrect data
                  </Badge>
                  <Badge variant="outline" className="p-2 justify-start">
                    Right to Portability - Move your data
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {dataSummary && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Data Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {dataSummary.data_summary.booking_count}
                      </div>
                      <div className="text-sm text-muted-foreground">Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {dataSummary.data_summary.profile_exists ? '1' : '0'}
                      </div>
                      <div className="text-sm text-muted-foreground">Profile</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {dataSummary.export_options.formats.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Export Formats</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        Protected
                      </div>
                      <div className="text-sm text-muted-foreground">GDPR Compliant</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Export Your Data</CardTitle>
                <CardDescription>
                  Download a complete copy of your personal data stored in our system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleExport('json')}
                    disabled={loading}
                    className="h-20 flex-col"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    Export as JSON
                    <span className="text-xs opacity-70">Machine readable format</span>
                  </Button>
                  <Button
                    onClick={() => handleExport('csv')}
                    disabled={loading}
                    variant="outline"
                    className="h-20 flex-col"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    Export as CSV
                    <span className="text-xs opacity-70">Spreadsheet format</span>
                  </Button>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Your export will include your profile information, booking history, and transaction records. 
                    Sensitive data is anonymized for security.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delete" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> Account deletion is permanent and cannot be undone.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Delete Account & Data</CardTitle>
                <CardDescription>
                  Permanently remove your account and all associated personal data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {deletionInfo && (
                  <>
                    {!deletionInfo.can_delete && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          You cannot delete your account while you have active bookings ({deletionInfo.active_bookings} active).
                          Please complete or cancel your bookings first.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <h4 className="font-medium">What will be deleted:</h4>
                      <ul className="text-sm space-y-1">
                        {deletionInfo.deletion_info.what_will_be_deleted.map((item: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-destructive rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {deletionInfo.can_delete && (
                      <>
                        <div className="space-y-3">
                          <label className="text-sm font-medium">
                            Reason for deletion (optional):
                          </label>
                          <Textarea
                            value={deletionReason}
                            onChange={(e) => setDeletionReason(e.target.value)}
                            placeholder="Please let us know why you're deleting your account..."
                            rows={3}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="confirm-deletion"
                            checked={confirmDeletion}
                            onCheckedChange={(checked) => setConfirmDeletion(checked === true)}
                          />
                          <label htmlFor="confirm-deletion" className="text-sm">
                            I understand that this action is permanent and cannot be undone.
                          </label>
                        </div>

                        <Button
                          onClick={handleDelete}
                          disabled={loading || !confirmDeletion}
                          variant="destructive"
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {loading ? 'Deleting...' : 'Delete My Account Permanently'}
                        </Button>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};