/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"


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
} from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { Input } from "~/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import { api } from '~/trpc/react'
import { OrderDetailDialog } from "~/app/_components/dashboard/orders/OrderDetailDialog"
import { OrderRefundDialog } from "~/app/_components/dashboard/orders/OrderRefundDialog"
import Loading from "~/app/loading"


const columns: ColumnDef<BookingDetailProps>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: any) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ row }) => (
            <div>{row.getValue("startDate")}</div>
        ),
    },
    {
        accessorKey: "endDate",
        header: "End Date",
        cell: ({ row }) => (
            <div>{row.getValue("endDate")}</div>
        ),
    },
    {
        accessorKey: "fullName",
        header: 'Full Name',
        cell: ({ row }) => {
            const data = row.original
            return <div>{data.bookingDetails.fullName}</div>
        },
    },
    {
        accessorKey: "surName",
        header: 'Surname',
        cell: ({ row }) => {
            const data = row.original
            return <div>{data.bookingDetails.surName}</div>
        },
    },
    {
        accessorKey: "phone",
        header: 'Phone',
        cell: ({ row }) => {
            const data = row.original
            return <div>{data.bookingDetails.phone}</div>
        },
    },
    {
        accessorKey: "country",
        header: 'Country',
        cell: ({ row }) => {
            const data = row.original
            return <div>{data.bookingDetails.country}</div>
        },
    },
    {
        accessorKey: "city",
        header: 'City',
        cell: ({ row }) => {
            const data = row.original
            return <div>{data.bookingDetails.city}</div>
        },
    },
    {
        accessorKey: "postalCode",
        header: 'Postal code',
        cell: ({ row }) => {
            const data = row.original
            return <div>{data.bookingDetails.postalCode}</div>
        },
    },
    {
        accessorKey: "streetName",
        header: 'Address',
        cell: ({ row }) => {
            const data = row.original
            return <div>{data.bookingDetails.streetName}</div>
        },
    },
    {
        id: 'detail',
        header: 'Detail',
        cell: ({ row }) => {
            return (
                <OrderDetailDialog order={row.original} />
            )
        },
    },
    {
        id: 'refund',
        header: 'Refund',
        cell: ({ row }) => {
            return (
                <OrderRefundDialog order={row.original} />
            )
        },
    },
]

export const OrderTable = () => {

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState<BookingDetailProps[]>([])

    const orderData = api.booking.getAllBookings.useQuery()

    // useEffect(() => {
    //     if (orderData.data)
    //         setData(orderData.data)
    // }, [orderData.data])

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
    })

    if (orderData.isFetching)
        return (<Loading />)

    return (
        <div className="w-full">
            <div className="flex justify-between items-center gap-2 py-4">
                <Input
                    placeholder="Search name"
                    value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("fullName")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
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
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
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
                                                cell.getContext()
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
                <div className="flex-1 text-sm text-muted-foreground">
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
    )
}
