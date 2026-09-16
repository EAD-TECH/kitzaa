"use client";

/* ortak kalıp */
import { DataTable } from "@/components/shared/table/data-table";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useListCategories } from "../hooks/useListCategories";
import { columns } from "./columns";
import { KanbanCard } from "@/components/shared/KanbanCard";
import DynamicIcon from "@/components/shared/table/DynamicIcon";

export default function CategoriesBoard() {
  /* telsizi acıp verimi cagırıyorm */
  const { data, isLoading, isError } = useListCategories();
  console.log(data);

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
            <Button className="w-full shrink-0 border border-border bg-primary p-4 text-accent hover:bg-foreground tablet:w-auto tablet:p-2">
              <PlusIcon size={16} />
              Kategori ekle
            </Button>
          }
        />
      </div>

      <DataTable
        columns={columns}
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
              description: category.description,
              icon: (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                  <DynamicIcon name={category.icon} />
                </div>
              ),
              onEdit: (id: string) => console.log("Düzenle", id),
              onDelete: (id: string) => console.log("Sil", id),
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
    </Card>
  );
}
