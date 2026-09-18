"use client";

/* ortak kalıp */
import { DataTable } from "@/components/shared/table/data-table";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useListCategories } from "../hooks/useListCategories";

import { KanbanCard } from "@/components/shared/KanbanCard";
import DynamicIcon from "@/components/shared/table/DynamicIcon";
import { ResponsiveModal } from "@/components/shared/modal/ResponsiveModal";
import { useState } from "react";
import { CategoryCreateForm } from "./categoryCreateForm";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { createCategoryColumns } from "./columns";

export default function CategoriesBoard() {
  /* telsizi acıp verimi cagırıyorm */
  const { data, isLoading, isError } = useListCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  console.log(data);

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
    return <div className="p-10 text-center"> (Yükleniyor)...</div>;
  if (isError)
    return <div className="p-10 text-center text-red-500">veri cekilemedi</div>;

  return (
    <Card className="flex flex-col min-w-0  p-4   gap-6 self-stretch rounded-2xl border border-border bg-background tablet:p-6 ring-0 shadow-none">
      <div className="flex min-w-0 flex-col gap-4">
        <PageHeader
          title="Kategori Yönetimi"
          description="Eventlara ait kategorileri yönetin"
          actionButton={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full shrink-0 border border-border bg-primary p-4 text-accent hover:bg-foreground tablet:w-auto tablet:p-2"
            >
              <PlusIcon size={16} />
              Kategori ekle
            </Button>
          }
        />
      </div>

      <DataTable
        columns={createCategoryColumns({
          onEdit: handleOpenDrawer,
          onDelete: setCategoryToDelete,
        })}
        data={data?.categories || []}
        renderMobileCard={(category) => (
          <KanbanCard
            data={{
              id: category._id,
              title: category.name,
              subtitle: category.slug,
              time: category.createdAt
                ? new Date(category.createdAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : undefined,
              status: category.isActive ? "Aktif" : "Pasif",
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
              placeholder="Kategori ara ..."
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

      <ResponsiveModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        title="Yeni Kategori Ekle"
        description="Oluşturulacak Eventlar için alternatif kategoriler eklenecektir  "
      >
        <CategoryCreateForm onSuccess={() => setIsModalOpen(false)} />
      </ResponsiveModal>
      <ResponsiveModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        title="Category Sil"
        description="Bu işlem geri alınamaz. Bu kategoriyi sistemden silmek istediğinize emin misiniz?"
      >
        <div className="flex w-full justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setCategoryToDelete(null)}>
            Vazgeç
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Siliniyor..." : "Evet, Sil"}
          </Button>
        </div>
      </ResponsiveModal>
    </Card>
  );
}
