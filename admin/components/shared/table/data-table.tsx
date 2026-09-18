"use client";

import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowData,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { features, type DataTableFeatures } from "./data-table-features";
import React from "react";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData, any>[];
  data: TData[];
  children?: (
    table: ReturnType<typeof useTable<DataTableFeatures, TData>>,
  ) => React.ReactNode;
  hideheader?: boolean;
  renderMobileCard?: (row: TData) => React.ReactNode;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  children,
  hideheader = false,  /* props olarak verdm opsiyonel */
  renderMobileCard,   /* tabloya prop verdım */
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const table = useTable({
    features,
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  return (
    <div className="min-w-0 overflow-x-auto rounded-md border">
      <div className="space-y-4 flex flex-col gap-2 pl-2 sm:flex-wrap mr-4">
        {children && children(table)}
        {/* tablet ve mobılde calıs  */}
        <div className={renderMobileCard ? "hidden tablet:block" : "block"}>
          <Table>
            {!hideheader && (
              <TableHeader className="bg-sidebar">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            )}

            <TableBody className="font-body">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center font-heading"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/*burası tablet ve mobıle ekranlarda render olucak */}
        {renderMobileCard && (
          <div className="grid grid-cols-1 gap-4 p-4 tablet:hidden">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  {/* Motorun içindeki saf datayı (row.original) kanban karta verıyorm */}
                  {renderMobileCard(row.original)}
                </React.Fragment>
              ))
            ) : (
              <div className="h-24 text-center font-heading p-4">
                No results.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
