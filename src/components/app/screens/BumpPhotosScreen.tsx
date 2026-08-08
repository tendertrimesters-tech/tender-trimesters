"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile, calcWeek } from "@/components/providers";
import { Camera, Lock, X, Plus } from "lucide-react";
import EmptyState from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type BumpPhoto = {
  id: string;
  week: number;
  photoUrl: string;
  caption: string | null;
  createdAt: string;
};

export default function BumpPhotosScreen() {
  const { profile } = useProfile();
  const currentWeek = calcWeek(profile?.dueDate);

  const [photos, setPhotos] = useState<BumpPhoto[]>([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/bump-photos")
      .then((r) => r.json())
      .then((d) => {
        setPhotos((d.photos || []).sort((a: BumpPhoto, b: BumpPhoto) => a.week - b.week));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      fetch("/api/bump-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          week: currentWeek,
          photoUrl: dataUrl,
          caption: caption.trim() || null,
        }),
      })
        .then((r) => r.json())
        .then(() => {
          toast.success("Bump photo added");
          setCaption("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          fetch("/api/bump-photos")
            .then((r) => r.json())
            .then((d) => setPhotos((d.photos || []).sort((a: BumpPhoto, b: BumpPhoto) => a.week - b.week)));
        })
        .catch(() => toast.error("Failed to upload photo"))
        .finally(() => setUploading(false));
    };
    reader.readAsDataURL(file);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/bump-photos?id=${id}`, { method: "DELETE" });
    toast.success("Photo removed");
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  if (!profile?.isPremium) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="rounded-3xl p-8 text-center max-w-sm mx-auto bg-card border-moss/15 shadow-soft">
          <Lock className="w-12 h-12 text-rose-gold mx-auto mb-4" />
          <div className="font-serif text-xl text-moss-deep">Bump Gallery</div>
          <p className="text-sm text-muted-foreground mt-2">
            A Premium keepsake — capture your beautiful journey week by week
          </p>
          <Button className="mt-6 bg-gradient-moss hover:opacity-90 rounded-full">
            Upgrade to unlock
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="font-serif text-2xl text-moss-deep">Bump Gallery</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          Your beautiful growing story
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card
          className="rounded-2xl p-4 border-dashed border-moss/30 hover:border-moss/60 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex items-center justify-center gap-2 text-moss-deep">
            <Plus className="w-5 h-5" />
            <Camera className="w-5 h-5" />
            <span className="text-sm font-medium">Add a bump photo</span>
          </div>
          {uploading && (
            <p className="text-xs text-muted-foreground text-center mt-2">Uploading…</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <input
          type="text"
          placeholder="A note for this week..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full text-sm rounded-xl border border-moss/20 bg-blush/30 placeholder:text-muted-foreground/60 px-3 py-2 outline-none focus:border-moss/50 focus:ring-1 focus:ring-moss/20 transition-all"
        />
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <EmptyState
          icon={<Camera className="w-7 h-7 text-muted-foreground/40" />}
          title="No bump photos yet"
          description="Start capturing your beautiful journey."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card className="rounded-2xl overflow-hidden relative bg-card border-moss/15 shadow-soft">
                <img
                  src={photo.photoUrl}
                  alt={photo.caption || `Week ${photo.week}`}
                  className="w-full aspect-square object-cover"
                />
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm text-cream flex items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/40 to-transparent">
                  <span className="text-[10px] bg-cream/90 backdrop-blur-sm rounded-full px-2 py-0.5 font-medium text-moss-deep">
                    Week {photo.week}
                  </span>
                  {photo.caption && (
                    <p className="text-xs text-cream font-medium mt-1 truncate">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
