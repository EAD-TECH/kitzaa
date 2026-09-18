"use client";

/* ortak kalıp */
import { DataTable } from "@/components/shared/table/data-table";
import { createColumns } from "./column";
import { useListUsers } from "../hooks/useListUsers";
import { useDeleteUser } from "../hooks/useDelete";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import FilterPills from "@/components/shared/FilterPills";
import { Input } from "@/components/ui/input";
import { KanbanCard } from "@/components/shared/KanbanCard";
import { useState } from "react";
import { ResponsiveModal } from "@/components/shared/modal/ResponsiveModal";
import { UserCreateForm } from "./UserCreateForm";
import UserActionDrawer from "./UserActionDrawer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function UsersPage() {
  /* telsizi açıp verimi çağırıyorum */
  const { data, isLoading, isError } = useListUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  if (isLoading)
    return <div className="p-10 text-center"> (Yükleniyor)...</div>;
  if (isError)
    return <div className="p-10 text-center text-red-500">veri çekilemedi</div>;

  /* Çekmeceyi açan ortak kumanda (Görüntüle & Düzenle) */
  const handleOpenDrawer = (id: string) => {
    const currentParams = new URLSearchParams(params.toString());
    currentParams.set("userId", id);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  /* Silme onay tetikleyicisi */
  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUser(userToDelete, {
        onSuccess: () => setUserToDelete(null),
      });
    }
  };

  return (
    <Card className="flex flex-col min-w-0 p-4 gap-6 self-stretch rounded-2xl border border-border bg-background tablet:p-6 ring-0 shadow-none">
      <div className="flex min-w-0 flex-col gap-4">
        <PageHeader
          title="Kullanıcı Yönetimi"
          description="Ebeveyn, organizatör ve kişileri yönetin"
          actionButton={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full shrink-0 border border-border bg-primary p-4 text-accent hover:bg-foreground tablet:w-auto tablet:p-2"
            >
              <PlusIcon size={16} />
              Kullanıcı ekle
            </Button>
          }
        />
      </div>

      <DataTable
        hideheader
        columns={createColumns({
          
          onEdit: handleOpenDrawer,
          onDelete: (id: string) => setUserToDelete(id),
        })}
        data={data?.user || []}
        renderMobileCard={(user) => (
          <KanbanCard
            data={{
              id: user._id,
              title:
                `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                "İsimsiz",
              subtitle: user.email,
              time: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : undefined,
              status: user.role,
              onEdit: (id: string) => handleOpenDrawer(id),
              onDelete: (id: string) => setUserToDelete(id),
            }}
          />
        )}
      >
        {(table) => (
          <div className="flex w-full min-w-0 flex-col items-stretch gap-3 py-4 tablet:flex-row tablet:items-center tablet:justify-between">
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
              placeholder="Ad, e-posta .."
              value={
                (table.getColumn("email")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
              className="w-full min-w-0 max-w-none focus-visible:ring-0 tablet:max-w-sm"
            />
          </div>
        )}
      </DataTable>

      {/* Yeni Kullanıcı Ekleme Modalı */}
      <ResponsiveModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        title="Yeni Kullanıcı Ekle"
        description="Kullanıcıya e-posta üzerinden bir sistem daveti gönderilecektir."
      >
        <UserCreateForm onSuccess={() => setIsModalOpen(false)} />
      </ResponsiveModal>

      {/* Silme Onay Modalı */}
      <ResponsiveModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title="Kullanıcıyı Sil"
        description="Bu işlem geri alınamaz. Bu kullanıcıyı sistemden silmek istediğinize emin misiniz?"
      >
        <div className="flex w-full justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setUserToDelete(null)}>
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

      {/* Detay/Düzenleme Çekmecesi */}
      <UserActionDrawer />
    </Card>
  );
}