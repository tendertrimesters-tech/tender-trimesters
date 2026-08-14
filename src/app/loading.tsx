export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-2 border-moss/20 border-t-moss rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Growing something beautiful...</p>
      </div>
    </div>
  );
}
