"use client";

/* ortak kalıp */
import { DataTable } from "@/components/shared/table/data-table";
import { columns } from "./column";
import { useListUsers } from "../hooks/useListUsers";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import FilterPills from "@/components/shared/FilterPills";
import { Input } from "@/components/ui/input";

export default function UsersPage() {
  /* telsizi acıp verimi cagırıyorm */
  const { data, isLoading, isError } = useListUsers();
  console.log(data);

  if (isLoading)
    return (
      <div className="p-10 text-center"> (Yükleniyor)...</div>
    );
  if (isError)
    return (
      <div className="p-10 text-center text-red-500">
        veri cekilemedi
      </div>
    );

  return (
    <Card className="flex flex-col min-w-0  p-4   gap-6 self-stretch rounded-2xl border border-border bg-background tablet:p-6 ring-0 shadow-none">
      <div className="flex min-w-0 flex-col gap-4">
        <PageHeader
          title="Kullanıcı Yönetimi"
          description="Ebeveyn,organizator ve kişileri yönetin"
          actionButton={
            <Button className="w-full shrink-0 border border-border bg-primary p-4 text-accent hover:bg-foreground tablet:w-auto tablet:p-2">
              <PlusIcon size={16} />
              Kullanıcı ekle
            </Button>
          }
        />
      </div>

      <DataTable columns={columns} data={data?.user || []}>
        {(table) => (
          <div className="flex w-full min-w-0 flex-col items-stretch gap-3 py-4 tablet:flex-row tablet:items-center tablet:justify-between">
            {/* children olarak data table a verdıgm bılesenlerım */}
            <FilterPills
              kategoriler={["Hepsi", "user", "organizer", "admin"]}
              aktifKategori={
                (table.getColumn("role")?.getFilterValue() as string) || "Hepsi"
              }
              onKategoriSec={(kategori) => {
                const filterValue = kategori === "Hepsi" ? "" : kategori;
                table.getColumn("role")?.setFilterValue(filterValue);
              }}
            />

            <Input
              placeholder="Ad, e-posta veya ID ."
              value={
                (table.getColumn("email")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
              className="w-full min-w-0 max-w-none focus-visible:ring-0 tablet:max-w-sm "
            />
          </div>
        )}
      </DataTable>
    </Card>
  );
}
