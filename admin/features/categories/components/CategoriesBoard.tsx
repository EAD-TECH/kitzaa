"use client";

/* ortak kalıp */
import { DataTable } from "@/components/shared/table/data-table";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import { KanbanCard } from "@/components/shared/KanbanCard";
import DynamicIcon from "@/components/shared/table/DynamicIcon";
import { ResponsiveModal } from "@/components/shared/modal/ResponsiveModal";
import { useEffect, useRef, useState } from "react";
import { CategoryCreateForm } from "./categoryCreateForm";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useListCategories } from "../hooks/useListCategories";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { createCategoryColumns } from "./columns";
import UpdateCategoryForm from "./UpdateCategoryForm";

export default function CategoriesBoard() {
  /* telsizi acıp verimi cagırıyorm */
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const sensorRef = useRef<HTMLDivElement>(null);

  /* kamera */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          if (fetchNextPage) fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    if (sensorRef.current) {
      observer.observe(sensorRef.current);
    }
    return () => observer.disconnect(); // Bileşen kapandığında kamerayı kapat
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const categories = data?.pages.flatMap((page) => page.categories || []) ?? [];
  console.log(categories);

  const handleOpenDrawer = (id: string) => {
    const currentParams = new URLSearchParams(params.toString());
    currentParams.set("categoryId", id);
    router.push(`${pathname}?${currentParams.toString()}`);
  };
  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete, {
        onSuccess: () => setCategoryToDelete(null),
      });
    }
  };

  if (isLoading)
    return <div className="p-10 text-center">Wird geladen...</div>;
  if (isError)
    return <div className="p-10 text-center text-red-500">Daten konnten nicht geladen werden.</div>;

  return (
    <Card className="flex flex-col min-w-0  p-4   gap-6 self-stretch rounded-2xl border border-border bg-background tablet:p-6 ring-0 shadow-none">
      <div className="flex min-w-0 flex-col gap-4">
        <PageHeader
          title="Kategorieverwaltung"
          description="Verwalte die Kategorien für Events"
          actionButton={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full shrink-0 border border-border bg-primary p-4 text-accent hover:bg-foreground tablet:w-auto tablet:p-2"
            >
              <PlusIcon size={16} />
              Kategorie hinzufügen
            </Button>
          }
        />
      </div>

      <DataTable
        columns={createCategoryColumns({
          onEdit: handleOpenDrawer,
          onDelete: setCategoryToDelete,
        })}
        data={categories}
        renderMobileCard={(category) => (
          <KanbanCard
            data={{
              id: category._id,
              title: category.name,
              subtitle: category.slug,
              time: category.createdAt
                ? new Date(category.createdAt).toLocaleDateString("de-DE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : undefined,
              status: category.isActive ? "Aktiv" : "Inaktiv",
              description: category.description ?? undefined,
              icon: (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                  <DynamicIcon name={category.icon} />
                </div>
              ),
              onEdit: (id: string) => handleOpenDrawer(id),
              onDelete: (id: string) => setCategoryToDelete(id),
            }}
          />
        )}
      >
        {(table) => (
          <div className="flex w-full min-w-0 flex-col items-stretch gap-3 py-4 tablet:flex-row tablet:items-center tablet:justify-between">
            {/* children olarak data table a verdıgm bılesenlerım */}
            <Input
              placeholder="Kategorie suchen ..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="w-full min-w-0 max-w-none focus-visible:ring-0 tablet:max-w-sm "
            />
          </div>
        )}
      </DataTable>

      {hasNextPage ? (
        <div
          ref={sensorRef}
          className="flex w-full items-center justify-center p-4"
        >
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin text-terracotta-500" />
          ) : (
            <span className="text-xs text-muted-foreground">
              Weitere werden geladen...
            </span>
          )}
        </div>
      ) : null}

      <ResponsiveModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        title="Neue Kategorie hinzufügen"
        description="Füge weitere Kategorien hinzu, die beim Erstellen von Events zur Auswahl stehen."
      >
        <CategoryCreateForm onSuccess={() => setIsModalOpen(false)} />
      </ResponsiveModal>
      <ResponsiveModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        title="Kategorie löschen"
        description="Diese Aktion kann nicht rückgängig gemacht werden. Möchtest du diese Kategorie wirklich aus dem System löschen?"
      >
        <div className="flex w-full justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setCategoryToDelete(null)}>
            Abbrechen
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Wird gelöscht..." : "Ja, löschen"}
          </Button>
        </div>
      </ResponsiveModal>

      <UpdateCategoryForm />
    </Card>
  );
}
