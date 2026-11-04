import { Music2 } from "lucide-react";
import SongUploadForm from "../../features/admin/components/SongUploadForm.jsx";

function SongUploadPage() {
  return (
    <div className="bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
            <Music2 size={25} className="text-primary" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Upload a Song
          </h1>

          <p className="mt-2 text-muted">
            Add a new song and its lyrics to the Lyricist collection.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8">
          <SongUploadForm />
        </div>
      </div>
    </div>
  );
}

export default SongUploadPage;
