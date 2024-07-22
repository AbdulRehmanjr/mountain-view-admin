/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { DeleteRentGroup } from "~/app/_components/dashboard/my-rent/DeleteRentGroup";
import { EditGroup } from "~/app/_components/dashboard/my-rent/EditRentDialog";
import { Skeleton } from "~/components/ui/skeleton";
import { CreateGroup } from "~/app/_components/dashboard/my-rent/CreateGroup";

const columns: ColumnDef<MyRentGroupProps>[] = [
  {
    accessorKey: "groupId",
    header: "Group Id",
    cell: ({ row }) => <div>{row.getValue("groupId")}</div>,
  },
  {
    accessorKey: "groupName",
    header: "Group Name",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("groupName")}</div>;
    },
  },
  {
    id: "edit",
    header: "Edit",
    enableHiding: false,
    cell: ({ row }) => <EditGroup info={row.original} />,
  },
  {
    id: "delete",
    header: "Delete",
    enableHiding: false,
    cell: ({ row }) => <DeleteRentGroup rentId={row.original.id} />,
  },
];

export const MyRentTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<MyRentGroupProps[]>([]);

  const myRentInfos = api.myrent.getMyRentGroups.useQuery();

  useEffect(() => {
    if (myRentInfos.data) setData(myRentInfos.data);
  }, [myRentInfos.data]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 py-4">
        <Input
          placeholder="Search group"
          value={(table.getColumn("groupId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("groupId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-4">
          <CreateGroup />
          <Button
            variant={"outline"}
            type="button"
            onClick={async () => await myRentInfos.refetch()}
          >
            <ReloadIcon className="mx-1 h-3 w-3" /> Refresh
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
