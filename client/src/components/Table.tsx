import dayjs from "dayjs";
import { InteractionType } from "../App";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export function InteractionsTable({
  interactions,
}: {
  interactions: InteractionType[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Query</TableHead>
          <TableHead>Response</TableHead>
          <TableHead>Interaction Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interactions.map((interaction) => (
          <TableRow key={interaction.id}>
            <TableCell className="font-medium">{interaction.id}</TableCell>
            <TableCell className="text-left">{interaction.query}</TableCell>
            <TableCell className="text-left">{interaction.response}</TableCell>
            <TableCell className="text-right">
              {dayjs(interaction.interactionDate).format("DD-MM-YYYY")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
