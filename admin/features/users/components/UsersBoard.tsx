"use client";

/* ortak kalıp */
import { DataTable } from "@/components/shared/table/data-table";
import { createColumns } from "./column";
import { useListUsers } from "../hooks/useListUsers";
import { useDeleteUser } from "../hooks/useDelete";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, PlusIcon } from "lucide-react";
import FilterPills from "@/components/shared/FilterPills";
import { Input } from "@/components/ui/input";
import { KanbanCard } from "@/components/shared/KanbanCard";
import { useEffect, useRef, useState } from "react";
import { ResponsiveModal } from "@/components/shared/modal/ResponsiveModal";
import { UserCreateForm } from "./UserCreateForm";
import UserActionDrawer from "./UserActionDrawer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ROLE_LABELS, type UserRole } from "../types/users.types";

export default function UsersPage() {
  /* telsizi açıp verimi çağırıyorum */
  const {
    data: usersData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const users = usersData?.pages.flatMap((p) => p.user || []) || [];

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

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

  if (isLoading)
    return <div className="p-10 text-center">Wird geladen...</div>;
  if (isError)
    return <div className="p-10 text-center text-red-500">Daten konnten nicht geladen werden.</div>;

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
          title="Benutzerverwaltung"
          description="Verwalte Eltern, Organisatoren und weitere Personen"
          actionButton={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full shrink-0 border border-border bg-primary p-4 text-accent hover:bg-foreground tablet:w-auto tablet:p-2"
            >
              <PlusIcon size={16} />
              Benutzer hinzufügen
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
        data={users}
        renderMobileCard={(user) => (
          <KanbanCard
            data={{
              id: user._id,
              title:
                `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                "Ohne Namen",
              subtitle: user.email,
              time: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("de-DE", {
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
              kategoriler={["Alle", "user", "organizer", "admin"]}
              getLabel={(kategori) => ROLE_LABELS[kategori as UserRole] ?? kategori}
              aktifKategori={
                (table.getColumn("role")?.getFilterValue() as string) || "Alle"
              }
              onKategoriSec={(kategori) => {
                const filterValue = kategori === "Alle" ? "" : kategori;
                table.getColumn("role")?.setFilterValue(filterValue);
              }}
            />

            <Input
              placeholder="Name, E-Mail ..."
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

      {/* Yeni Kullanıcı Ekleme Modalı */}
      <ResponsiveModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        title="Neuen Benutzer hinzufügen"
        description="Der Benutzer erhält eine Einladung per E-Mail."
      >
        <UserCreateForm onSuccess={() => setIsModalOpen(false)} />
      </ResponsiveModal>

      {/* Silme Onay Modalı */}
      <ResponsiveModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title="Benutzer löschen"
        description="Diese Aktion kann nicht rückgängig gemacht werden. Möchtest du diesen Benutzer wirklich aus dem System löschen?"
      >
        <div className="flex w-full justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setUserToDelete(null)}>
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

      {/* Detay/Düzenleme Çekmecesi */}
      <UserActionDrawer />
    </Card>
  );
}
