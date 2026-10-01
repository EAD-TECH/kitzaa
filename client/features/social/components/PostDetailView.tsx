"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { usePostById } from "../hooks/socialHooks";
import PostDetailContent from "./PostDetailContent";

interface PostDetailViewProps {
  postId: string;
}

export default function PostDetailView({ postId }: PostDetailViewProps) {
  const { data, error, isLoading, isError, refetch } = usePostById(postId);

  if (isLoading) {
    return (
      <div className="grid min-h-0 overflow-hidden desktop:h-[78dvh] desktop:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <Skeleton className="min-h-80 rounded-none desktop:min-h-0" />
        <div className="space-y-6 p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-28" />
          <div className="space-y-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const isNotFound = error instanceof ApiError && error.status === 404;

    return (
      <div className="flex min-h-80 items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle />
          <div className="space-y-4">
            <div>
              <AlertTitle>
                {isNotFound ? "Beitrag nicht gefunden" : "Beitrag konnte nicht geladen werden"}
              </AlertTitle>
              <AlertDescription>
                {isNotFound
                  ? "Der Beitrag wurde gelöscht oder ist nicht mehr verfügbar."
                  : "Bitte versuche es erneut oder kehre zum Social Feed zurück."}
              </AlertDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {!isNotFound ? (
                <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw />
                  Erneut versuchen
                </Button>
              ) : null}
              <Button nativeButton={false} render={<Link href="/social" />} size="sm">
                Zum Social Feed
              </Button>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return data?.post ? <PostDetailContent post={data.post} /> : null;
}
