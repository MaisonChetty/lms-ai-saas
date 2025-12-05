"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useDocuments,
  useDocumentProjection,
  useApplyDocumentActions,
  createDocument,
  createDocumentHandle,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Plus, ChevronRight, Loader2, Search, X } from "lucide-react";

interface DocumentListProps {
  documentType: string;
  title: string;
  description?: string;
  basePath: string;
  projectId: string;
  dataset: string;
  showCreateButton?: boolean;
}

function DocumentListFallback() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full bg-zinc-800" />
      ))}
    </div>
  );
}

function DocumentItem({
  documentId,
  documentType,
  projectId,
  dataset,
  basePath,
}: DocumentHandle & { basePath: string }) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: "{ title, description }",
  });

  const title = (data as { title?: string })?.title || "Untitled";
  const description = (data as { description?: string })?.description;

  return (
    <Link href={`${basePath}/${documentId}`}>
      <div className="p-4 rounded-xl bg-card border border-border hover:bg-secondary/70 hover:border-border transition-all cursor-pointer group">
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {description}
              </p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0 ml-4" />
        </div>
      </div>
    </Link>
  );
}

function DocumentListContent({
  documentType,
  basePath,
  projectId,
  dataset,
  onCreateDocument,
  isCreating,
  searchQuery,
}: Omit<DocumentListProps, "title" | "description" | "showCreateButton"> & {
  onCreateDocument: () => void;
  isCreating: boolean;
  searchQuery: string;
}) {
  const { data: documents } = useDocuments({
    documentType,
    projectId,
    dataset,
    search: searchQuery || undefined,
  });

  if (!documents || documents.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-card border border-border text-center">
        <p className="text-muted-foreground">No {documentType}s found</p>
        <button
          type="button"
          onClick={onCreateDocument}
          disabled={isCreating}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-secondary/70 disabled:opacity-50 transition-colors"
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isCreating ? "Creating..." : `Create your first ${documentType}`}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <Suspense
          key={doc.documentId}
          fallback={<Skeleton className="h-16 w-full bg-zinc-800" />}
        >
          <DocumentItem {...doc} basePath={basePath} />
        </Suspense>
      ))}
    </div>
  );
}

export function DocumentList({
  documentType,
  title,
  description,
  basePath,
  projectId,
  dataset,
  showCreateButton = true,
}: DocumentListProps) {
  const router = useRouter();
  const [isCreating, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const apply = useApplyDocumentActions();

  const handleCreateDocument = () => {
    startTransition(async () => {
      const newDocHandle = createDocumentHandle({
        documentId: crypto.randomUUID(),
        documentType,
      });

      await apply(createDocument(newDocHandle));
      router.push(`${basePath}/${newDocHandle.documentId}`);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {showCreateButton && (
          <button
            type="button"
            onClick={handleCreateDocument}
            disabled={isCreating}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 rounded-lg shadow-lg shadow-violet-500/20 transition-all"
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {isCreating ? "Creating..." : `New ${documentType}`}
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={`Search ${documentType}s...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:ring-violet-500/20"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Suspense fallback={<DocumentListFallback />}>
        <DocumentListContent
          documentType={documentType}
          basePath={basePath}
          projectId={projectId}
          dataset={dataset}
          onCreateDocument={handleCreateDocument}
          isCreating={isCreating}
          searchQuery={searchQuery}
        />
      </Suspense>
    </div>
  );
}
