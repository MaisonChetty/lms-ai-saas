"use client";

import { useState } from "react";
import {
  useEditDocument,
  useDocument,
  useApplyDocumentActions,
  publishDocument,
  unpublishDocument,
  deleteDocument,
  discardDocument,
  useDocumentEvent,
  createDocumentHandle,
  useQuery,
} from "@sanity/sdk-react";
import type { Note } from "@/sanity.types";

interface NoteCardProps {
  documentId: string;
}

export function NoteCard({ documentId }: NoteCardProps) {
  const [notifications, setNotifications] = useState<string[]>([]);

  const documentHandle = createDocumentHandle({
    documentId,
    documentType: "note",
  });

  const { data: note } = useDocument<Note>({
    documentId,
    documentType: "note",
  });

  const apply = useApplyDocumentActions();

  const isDraft = note?._id.startsWith("drafts.");
  const isPublished = !isDraft;

  const { data: publishedDoc } = useQuery<{ _id: string } | null>({
    query: `*[_id == $id][0]{ _id }`,
    params: { id: documentId },
    perspective: "published",
  });
  const hasPublishedVersion = !!publishedDoc;

  useDocumentEvent({
    ...documentHandle,
    onEvent: (event) => {
      const timestamp = new Date().toLocaleTimeString();
      const prepend = (label: string) =>
        setNotifications((prev) => [`${timestamp} - ${label}`, ...prev.slice(0, 4)]);

      switch (event.type) {
        case "edited":
          prepend("Edited");
          break;
        case "published":
          prepend("Published");
          break;
        case "unpublished":
          prepend("Unpublished");
          break;
        case "deleted":
          prepend("Deleted");
          break;
        case "created":
          prepend("Created");
          break;
      }
    },
  });

  const editTitle = useEditDocument<string>({
    documentId,
    documentType: "note",
    path: "title",
  });

  const editContent = useEditDocument<string>({
    documentId,
    documentType: "note",
    path: "content",
  });

  const editStatus = useEditDocument<"draft" | "inProgress" | "complete">({
    documentId,
    documentType: "note",
    path: "status",
  });

  if (!note) return null;

  return (
    <div className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
      {notifications.length > 0 && (
        <div className="mb-4 space-y-1">
          {notifications.map((msg, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Event notifications are transient and order-based
              key={i}
              className="text-xs text-primary bg-primary/10 px-2 py-1 rounded"
            >
              {msg}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <input
          type="text"
          value={note.title || ""}
          onChange={(e) => editTitle(e.currentTarget.value)}
          className="text-xl font-semibold bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none flex-1 mr-4"
          placeholder="Enter title..."
        />
        <div className="flex items-center gap-2">
          <select
            value={note.status || "draft"}
            onChange={(e) =>
              editStatus(
                e.currentTarget.value as "draft" | "inProgress" | "complete",
              )
            }
            className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
              note.status === "complete"
                ? "bg-emerald-500/15 text-emerald-500"
                : note.status === "inProgress"
                  ? "bg-blue-500/15 text-blue-500"
                  : "bg-muted text-foreground"
            }`}
          >
            <option value="draft">Draft</option>
            <option value="inProgress">In Progress</option>
            <option value="complete">Complete</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            isPublished
              ? "bg-emerald-500/15 text-emerald-500"
              : "bg-amber-500/15 text-amber-600"
          }`}
        >
          {isPublished ? "Published" : "Draft"}
        </span>
        {isPublished ? (
          <button
            type="button"
            onClick={() =>
              apply(
                unpublishDocument({
                  documentId: note._id,
                  documentType: "note",
                }),
              )
            }
            className="px-2 py-1 text-xs bg-secondary hover:bg-secondary/70 text-foreground rounded"
          >
            Unpublish
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              apply(
                publishDocument({
                  documentId: note._id.replace("drafts.", ""),
                  documentType: "note",
                }),
              )
            }
            className="px-2 py-1 text-xs bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 rounded"
          >
            Publish
          </button>
        )}
        <button
          type="button"
          onClick={async () => {
            const baseId = note._id.replace("drafts.", "");

            if (isDraft && hasPublishedVersion) {
              await apply(
                discardDocument({
                  documentId: baseId,
                  documentType: "note",
                }),
              );
            } else if (isDraft && !hasPublishedVersion) {
              await apply([
                publishDocument({
                  documentId: baseId,
                  documentType: "note",
                }),
                deleteDocument({
                  documentId: baseId,
                  documentType: "note",
                }),
              ]);
            } else {
              await apply(
                deleteDocument({
                  documentId: note._id,
                  documentType: "note",
                }),
              );
            }
          }}
          className="px-2 py-1 text-xs bg-red-500/15 hover:bg-red-500/25 text-red-500 rounded ml-auto"
        >
          {isDraft && hasPublishedVersion ? "Discard Draft" : "Delete"}
        </button>
      </div>

      <textarea
        value={note.content || ""}
        onChange={(e) => editContent(e.currentTarget.value)}
        className="w-full text-muted-foreground mb-2 bg-transparent border border-transparent hover:border-border focus:border-primary focus:outline-none p-2 rounded min-h-20 resize-y"
        placeholder="Enter content..."
      />
      <p className="text-xs text-muted-foreground">
        Created: {new Date(note._createdAt).toLocaleString()}
      </p>
    </div>
  );
}
