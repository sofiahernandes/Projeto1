"use client";

import { useEffect, useState } from "react";
import BackHome from "@/components/back-home";
import { DataTable } from "@/components/contribution-table-admin/data-table";
import {
  makeContributionColumns,
  Contribution,
} from "@/components/contribution-table-admin/columns";
import { toast } from "sonner"; // optional if you use toast notifications
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { MajorContributionsChart } from "@/components/reports-charts/tooltip-chart/page";
import { FoodDonationsChart } from "@/components/reports-charts/pie-chart-label/page";
import { FinanContribuitionsChart } from "@/components/reports-charts/area-chart/page";
import { TeamsRankingChart } from "@/components/reports-charts/bar-label-costum/page";
import { HandHeart } from "lucide-react";

// Generate editions automatically
function generateEditions(startEdition = 7, startYear = 2025) {
  const editions = [];
  const currentDate = new Date();
  const yearDiff = currentDate.getFullYear() - startYear;
  const currentEdition =
    startEdition + yearDiff * 2 + (currentDate.getMonth() >= 7 ? 1 : 0);

  for (let ed = startEdition; ed <= currentEdition + 1; ed++) {
    const baseYear = startYear + Math.floor((ed - startEdition) / 2);
    const isFirstSemester = ed % 2 === 1;
    const period = isFirstSemester
      ? `Jan - Jul ${baseYear}`
      : `Ago - Dez ${baseYear}`;
    editions.push({
      value: ed,
      label: `${ed}ª Edição (${period})`,
    });
  }
  return editions;
}

export default function PublicReports() {
  const [edition, setEdition] = useState<number>(() => {
    // auto-select the current edition
    const now = new Date();
    const startEdition = 7;
    const startYear = 2025;
    const yearDiff = now.getFullYear() - startYear;
    const currentEdition =
      startEdition + yearDiff * 2 + (now.getMonth() >= 7 ? 1 : 0);
    return currentEdition;
  });

  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editions = generateEditions();

  // Fetch contributions filtered by edition
  useEffect(() => {
    async function fetchContributions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/contributions/edition/${edition}`
        );
        if (!res.ok) throw new Error("Erro ao buscar contribuições");
        const data = await res.json();
        setContributions(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchContributions();
  }, [edition]);

  const columns = makeContributionColumns({
    onCopied: (id) => toast.success(`ID ${id} copiado!`),
    onView: (c) => {
      // open a modal or navigate to a detail view (optional)
      console.log("Visualizar contribuição:", c);
    },
  });

  if (!contributions.length) {
    return (
      <>
        <div className="absolute left-0 top-0 m-4">
          <BackHome />
        </div>
        <div className="col-start-2 border rounded-xl border-gray-200 shadow-xl w-auto max-w-[90%] md:max-w-100 mx-auto">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HandHeart size={44} strokeWidth={1.2} />
              </EmptyMedia>
              <EmptyTitle>Nenhuma contribuição por enquanto!</EmptyTitle>
              <EmptyDescription>
                Ainda não foi arrecadada nenhuma doação. Quando os alunos
                adicionarem contribuições ao Arkana, aparecerão aqui!
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
          </Empty>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-background p-6">
      <div className="absolute left-0 top-0 m-4">
        <BackHome />
      </div>

      <div className="max-w-6xl mx-auto mt-5">
        {/* Edition Selector */}
        <div className="flex justify-center mb-6">
          <select
            value={edition}
            onChange={(e) => setEdition(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            {editions.map((ed) => (
              <option key={ed.value} value={ed.value}>
                {ed.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table / Loading / Error */}
        {loading && (
          <p className="text-center text-gray-600">
            Carregando contribuições...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500">Ocorreu um erro: {error}</p>
        )}

        {!loading && !error && (
          <DataTable
            columns={columns}
            data={contributions}
            onRowClick={(c) => console.log("Clicked row:", c)}
          />
        )}

        <MajorContributionsChart/>
        <FoodDonationsChart/>
        <FinanContribuitionsChart/>
        <TeamsRankingChart/>
      </div>
    </div>
  );
}
