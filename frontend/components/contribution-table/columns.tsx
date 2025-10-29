"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Clipboard, Eye } from "lucide-react";
import formatBRL from "../formatBRL";

export type Contribution = {
  RaUsuario: number;
  TipoDoacao: string;
  Quantidade: number;
  Meta?: number;
  Gastos?: number;
  Fonte?: string;
  Comprovante?: string;
  IdContribuicao: string;
  DataContribuicao: string;
  NomeAlimento?: string;
  PontuacaoAlimento?: number;
  PesoTotal?: number;
  PontuacaoTotal?: number;
  uuid: string
};

export type ContributionActions = {
  onView?: (c: Contribution) => void;
  onCopied?: (id: string) => void;
};

export const makeContributionColumns = (
  actions: ContributionActions = {}
): ColumnDef<Contribution>[] => [
    {
      accessorKey: "Fonte",
      header: ({ column }) => {
        return (
          <Button
            variant="prettyHeader"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fonte da doação
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className="font-medium">{row.original.Fonte ?? "-"}</span>
      ),
    },
    {
      accessorKey: "DataContribuicao",
      header: ({ column }) => {
        return (
          <Button
            variant="prettyHeader"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Data
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const d = row.original.DataContribuicao;
        const date = d ? new Date(d) : null;
        return <span>{date ? date.toLocaleDateString("pt-BR") : "-"}</span>;
      },
    },
    {
      accessorKey: "TipoDoacao",
      header: ({ column }) => {
        return (
          <Button
            variant="prettyHeader"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tipo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Quantidade",
      header: ({ column }) => {
        return (
          <Button
            variant="prettyHeader"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantidade
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const q = row.original.Quantidade;
        return (
          <span>
            {Number.isFinite(q)
              ? new Intl.NumberFormat("pt-BR").format(q)
              : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "NomeAlimento",
      header: "Tipo de Alimento",
      cell: ({ row }) => {
        return row.original.TipoDoacao === "Alimenticia"
          ? row.original.NomeAlimento || "-"
          : "-";
      },
    },
    {
      accessorKey: "PesoTotal",
      header: "Peso Total",
      cell: ({ row }) => {
        return row.original.TipoDoacao === "Alimenticia"
          ? `${row.original.PesoTotal?.toFixed(2)} kg ` || "-"
          : "-";
      },
    },
    {
      accessorKey: "PontuacaoTotal",
      header: "Pontuação Total",
      cell: ({ row }) => {
        return row.original.TipoDoacao === "Alimenticia"
          ? row.original.PontuacaoTotal?.toString() || "-"
          : "-";
      },
    },
    {
      accessorKey: "Gastos",
      header: ({ column }) => {
        return (
          <Button
            variant="prettyHeader"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Gastos
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <span>{formatBRL(row.original.Gastos)}</span>,
    },
    {
      accessorKey: "Meta",
      header: ({ column }) => {
        return (
          <Button
            variant="prettyHeader"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Meta
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const meta = row.original.Meta;
        return (
          <span>
            {typeof meta === "number" && Number.isFinite(meta)
              ? new Intl.NumberFormat("pt-BR").format(meta)
              : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "Comprovante",
      header: "Comprovante",
      cell: ({ row }) => {
        const url = row.original.Comprovante;
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Abrir comprovante
          </a>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const c = row.original;
        const hasReceipt = !!c.Comprovante;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={async () => {
                  await navigator.clipboard.writeText(String(c.IdContribuicao));
                  actions.onCopied?.(c.IdContribuicao);
                }}
              >
                <Clipboard className="mr-2 h-4 w-4" /> Copiar ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => actions.onView?.(c)}>
                <Eye className="mr-2 h-4 w-4" /> Ver detalhes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
``;
