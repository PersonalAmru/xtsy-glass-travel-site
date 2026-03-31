import { useState, useEffect } from "react";
import { UnifiedAdminLayout } from "@/layouts/UnifiedAdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  Plus, Search, Edit2, Trash2, Eye, EyeOff, Save, X,
  MapPin, Clock, Star, Users,
} from "lucide-react";

interface Tour {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description: string | null;
  duration: string;
  difficulty: string;
  price: number;
  original_price: number | null;
  images: string[];
  rating: number | null;
  category: string;
  location: string;
  highlights: string[];
  best_season: string | null;
  exclusive: boolean | null;
  group_size: string | null;
  inclusions: string[];
  exclusions: string[];
  itinerary: any;
  faqs: any;
  is_published: boolean | null;
  sort_order: number | null;
  created_at: string | null;
}

const EMPTY_TOUR: Partial<Tour> = {
  title: "",
  description: "",
  duration: "",
  difficulty: "Moderate",
  price: 0,
  category: "adventure",
  location: "",
  highlights: [],
  inclusions: [],
  exclusions: [],
  images: [],
  itinerary: [],
  faqs: [],
  is_published: false,
  sort_order: 0,
};

const toSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const AdminTours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Partial<Tour> | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state for array fields
  const [highlightsText, setHighlightsText] = useState("");
  const [inclusionsText, setInclusionsText] = useState("");
  const [exclusionsText, setExclusionsText] = useState("");
  const [imagesText, setImagesText] = useState("");

  const fetchTours = async () => {
    setLoading(true);
    // Query all tours (admin sees unpublished too) - use raw query
    const { data, error } = await supabase
      .from("tours" as any)
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setTours(data as unknown as Tour[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const openEditor = (tour?: Tour) => {
    const t = tour || { ...EMPTY_TOUR };
    setEditingTour(t);
    setHighlightsText((t.highlights || []).join("\n"));
    setInclusionsText((t.inclusions || []).join("\n"));
    setExclusionsText((t.exclusions || []).join("\n"));
    setImagesText((t.images || []).join("\n"));
    setIsEditorOpen(true);
  };

  const handleSave = async () => {
    if (!editingTour?.title || !editingTour?.description || !editingTour?.duration || !editingTour?.location) {
      toast({ title: "Missing required fields", description: "Title, description, duration, and location are required.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const slug = toSlug(editingTour.title);
    const payload = {
      slug,
      title: editingTour.title,
      description: editingTour.description,
      short_description: editingTour.short_description || null,
      duration: editingTour.duration,
      difficulty: editingTour.difficulty || "Moderate",
      price: editingTour.price || 0,
      original_price: editingTour.original_price || null,
      category: editingTour.category || "adventure",
      location: editingTour.location,
      highlights: highlightsText.split("\n").filter(Boolean),
      inclusions: inclusionsText.split("\n").filter(Boolean),
      exclusions: exclusionsText.split("\n").filter(Boolean),
      images: imagesText.split("\n").filter(Boolean),
      best_season: editingTour.best_season || null,
      exclusive: editingTour.exclusive || false,
      group_size: editingTour.group_size || null,
      itinerary: editingTour.itinerary || [],
      faqs: editingTour.faqs || [],
      is_published: editingTour.is_published || false,
      sort_order: editingTour.sort_order || 0,
      rating: editingTour.rating || 4.5,
    };

    let error;
    if (editingTour.id) {
      const res = await supabase.from("tours" as any).update(payload as any).eq("id", editingTour.id);
      error = res.error;
    } else {
      const res = await supabase.from("tours" as any).insert(payload as any);
      error = res.error;
    }

    if (error) {
      toast({ title: "Error saving tour", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingTour.id ? "Tour updated" : "Tour created" });
      setIsEditorOpen(false);
      fetchTours();
    }
    setSaving(false);
  };

  const togglePublish = async (tour: Tour) => {
    await supabase.from("tours" as any).update({ is_published: !tour.is_published } as any).eq("id", tour.id);
    fetchTours();
  };

  const deleteTour = async (id: string) => {
    if (!confirm("Delete this tour permanently?")) return;
    await supabase.from("tours" as any).delete().eq("id", id);
    fetchTours();
  };

  const filtered = tours.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UnifiedAdminLayout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Tour Packages CMS</h1>
            <p className="text-sm text-muted-foreground">{tours.length} tours in database</p>
          </div>
          <Button onClick={() => openEditor()} className="bg-emerald-600 hover:bg-emerald-500">
            <Plus className="h-4 w-4 mr-1.5" />
            New Tour
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tours..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tour list */}
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Loading tours...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-3">No tours found. Create your first tour package!</p>
            <Button onClick={() => openEditor()} variant="outline">
              <Plus className="h-4 w-4 mr-1.5" />
              Create Tour
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(tour => (
              <Card key={tour.id} className="bg-card/50 border-border/30">
                <CardContent className="p-4 flex items-center gap-4">
                  {/* Thumbnail */}
                  {tour.images?.[0] && (
                    <img src={tour.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm truncate">{tour.title}</h3>
                      <Badge className={tour.is_published ? "bg-emerald-600 text-white border-0" : "bg-muted text-muted-foreground border-0"}>
                        {tour.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{tour.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tour.duration}</span>
                      <span>₹{tour.price?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => togglePublish(tour)} title={tour.is_published ? "Unpublish" : "Publish"}>
                      {tour.is_published ? <Eye className="h-4 w-4 text-emerald-400" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => openEditor(tour)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteTour(tour.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Editor dialog */}
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTour?.id ? "Edit Tour" : "Create New Tour"}</DialogTitle>
              <DialogDescription>Fill in the tour package details below.</DialogDescription>
            </DialogHeader>

            {editingTour && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Title *</label>
                    <Input
                      value={editingTour.title || ""}
                      onChange={e => setEditingTour({ ...editingTour, title: e.target.value })}
                      placeholder="Tour title"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Location *</label>
                    <Input
                      value={editingTour.location || ""}
                      onChange={e => setEditingTour({ ...editingTour, location: e.target.value })}
                      placeholder="e.g. Meghalaya"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Description *</label>
                  <textarea
                    value={editingTour.description || ""}
                    onChange={e => setEditingTour({ ...editingTour, description: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                    placeholder="Tour description"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Duration *</label>
                    <Input
                      value={editingTour.duration || ""}
                      onChange={e => setEditingTour({ ...editingTour, duration: e.target.value })}
                      placeholder="5 Days"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Difficulty</label>
                    <Select value={editingTour.difficulty || "Moderate"} onValueChange={v => setEditingTour({ ...editingTour, difficulty: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Challenging">Challenging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Price (₹)</label>
                    <Input
                      type="number"
                      value={editingTour.price || ""}
                      onChange={e => setEditingTour({ ...editingTour, price: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                    <Select value={editingTour.category || "adventure"} onValueChange={v => setEditingTour({ ...editingTour, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adventure">Adventure</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                        <SelectItem value="leisure">Leisure</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Best Season</label>
                    <Input
                      value={editingTour.best_season || ""}
                      onChange={e => setEditingTour({ ...editingTour, best_season: e.target.value })}
                      placeholder="Oct-Mar"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Group Size</label>
                    <Input
                      value={editingTour.group_size || ""}
                      onChange={e => setEditingTour({ ...editingTour, group_size: e.target.value })}
                      placeholder="4-8 people"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Highlights (one per line)</label>
                  <textarea
                    value={highlightsText}
                    onChange={e => setHighlightsText(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                    placeholder="One highlight per line"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Image URLs (one per line)</label>
                  <textarea
                    value={imagesText}
                    onChange={e => setImagesText(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
                    placeholder="Paste image URLs, one per line"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Inclusions (one per line)</label>
                    <textarea
                      value={inclusionsText}
                      onChange={e => setInclusionsText(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Exclusions (one per line)</label>
                    <textarea
                      value={exclusionsText}
                      onChange={e => setExclusionsText(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingTour.is_published || false}
                      onChange={e => setEditingTour({ ...editingTour, is_published: e.target.checked })}
                      className="rounded"
                    />
                    Published
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingTour.exclusive || false}
                      onChange={e => setEditingTour({ ...editingTour, exclusive: e.target.checked })}
                      className="rounded"
                    />
                    Exclusive
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsEditorOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-500">
                    <Save className="h-4 w-4 mr-1.5" />
                    {saving ? "Saving..." : "Save Tour"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </UnifiedAdminLayout>
  );
};

export default AdminTours;
