import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export const TableSkeleton = ({ headers }: { headers: string[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((headerName, index) => (
            <TableHead key={index}>{headerName}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 4 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: headers.length }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton className="h-[3rem] w-[7rem]" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
