"use client";

import React, { useState } from "react";
import BackHome from "@/components/back-home";
import RecordsMentor from "@/components/records-mentor";
import RenderContributionCard from "@/components/grid-contribution-admin";
import Loading from "@/components/loading";

import { MajorContributionsChart } from "@/components/reports-charts/tooltip-chart/page";
import { FoodDonationsChart } from "@/components/reports-charts/pie-chart-label/page";
import { FinanContribuitionsChart } from "@/components/reports-charts/area-chart/page";
import { TeamsRankingChart } from "@/components/reports-charts/bar-label-costum/page";

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

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedContribution, setSelectedContribution] =
    React.useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editions = generateEditions();

  return (
    <div className="min-h-screen w-screen bg-background p-6">
      <div className="absolute left-0 top-0 m-4">
        <BackHome />
      </div>

      <div className="mx-auto mt-5 grid grid-cols-1 md:grid-cols-3">
        <div className="w-full h-full md:col-span-2">
          {/* Edition Selector */}
          {/*
          <div className="flex justify-center mb-6">
            <select
              title="Filtrar por edição"
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
          */}

          {/* Table / Loading / Error */}
          {loading && (
            <div className="w-screen h-full text-center text-gray-600">
              <Loading />
            </div>
          )}

          {!loading && !error && (
            <div className="w-full overflow-y-hidden overflow-x-hidden flex flex-col">
              <div className="*:w-full flex justify-center pt-4 transition-all duration-300 ease-in-out">
                <main className="w-full ">
                  {selectedContribution && (
                    <RecordsMentor
                      data={selectedContribution}
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                    />
                  )}

                  <div className="mt-2">
                      <RenderContributionCard
                        isPublicReport
                        onSelect={(contribution: any) => {
                          setSelectedContribution(contribution);
                          setIsOpen(true);
                        }}
                      />
                  </div>
                </main>
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-full flex flex-col gap-6">
          <MajorContributionsChart />
          <FoodDonationsChart />
          <FinanContribuitionsChart />
          <TeamsRankingChart />
        </div>
      </div>
    </div>
  );
}
