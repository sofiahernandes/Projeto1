"use client";
{/* Para fazer um teste depois*/}

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Contribution {
  IdContribuicao: number;
  RaUsuario: number;
  TipoDoacao: string;
  Quantidade: number;
  Meta?: number;
  Gastos?: number;
  Fonte?: string;
  comprovante?: {
  IdComprovante: number;
  Imagem: string;}
  DataContribuicao: string;
}

export default function RenderContribution() {
  const [contributions, setContributions] = useState<Contribution[]>([]);

  return (
    <Table>
      <TableCaption>Lista de contribuições</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Fonte</TableHead>
          <TableHead>Tipo de Doação</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead className="text-right">Data</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {contributions.map((c) => (
          <TableRow key={c.IdContribuicao}>
            <TableCell className="font-medium">{c.Fonte}</TableCell>
            <TableCell>{c.TipoDoacao}</TableCell>
            <TableCell>{c.Quantidade}</TableCell>
            <TableCell className="text-right">
              {new Date(c.DataContribuicao).toLocaleDateString()}
            </TableCell>
            <TableCell>{c.comprovante?.Imagem}</TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell colSpan={2} className="text-right">
            {contributions.reduce((sum, c) => sum + c.Quantidade, 0)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
