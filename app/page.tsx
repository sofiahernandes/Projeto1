"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BookOpen } from "lucide-react";
import Link from "next/link";

import { overallMetrics } from "@/lib/overall-metrics";
import { donations } from "@/lib/donations";

export default function PublicDashboard() {
  const recentDonations = donations.slice(0, 6);
  const biggestDonations = donations.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-6 pb-4">
      <div className="flex justify-center w-full pb-4">
          <h1 className="font-light text-slate-600 text-sm">Arkana Dashboard</h1>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Catões de Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {overallMetrics.map((metric, index) => (
            <Card key={index} className="h-22 justify-center bg-[#85963A]/40 shadow-sm overflow-hidden">
              <CardContent className="px-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <metric.icon className={"w-6 h-6 text-[#537B2F]"} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{metric.label}</p>
                    <p className="text-2xl text-gray-900 font-semibold">{metric.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Contribuições Recentes */}
          <Card className="shadow-sm">
            <CardContent className="px-6">
              <h2 className="text-lg text-center font-semibold text-gray-900 pb-3">Contribuições Recentes</h2>
              <div>
                {recentDonations.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-[#dbdaaf]/20 cursor-pointer transition-colors"
                  >
                    <div className="w-6 h-6 rounded-3xl flex items-center justify-center text-white">
                      <activity.icon className={"w-4 h-4 text-[#537B2F]"} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.name}</p>
                    </div>
                    <p className="text-sm text-gray-600">{activity.team}</p>
                    <span className="text-sm text-gray-500">{activity.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Times Recentemente Ativos */}
          <Card className="shadow-sm">
            <CardContent className="px-6">
              <h2 className="text-lg text-center font-semibold text-gray-900 pb-3">Maiores Doações</h2>
              <div>
                {biggestDonations.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-[#dbdaaf]/20 cursor-pointer transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-gray-900">{item.team}</p>
                    </div>
                    <span className="text-[#537B2F] text-md">R${item.ammount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-50 shadow-none border-none">
          <CardContent className="px-0">
            <div className="grid grid-cols-2 gap-4">
              <Button className="overflow-hidden h-18 flex-col gap-2 hover:bg-[#85963A]/20 hover:border-[#6f6e26]/60 border border-[#6f6e26]/40 transition-colors bg-white">
                <Link href="/sign-in" className="flex flex-col gap-2 items-center">
                  <BookOpen className="w-6 h-6 text-gray-600" />
                  <span className="text-sm text-gray-900 font-medium">Registrar Doações</span>
                </Link>
              </Button>
              <Button className="overflow-hidden h-18 gap-2 bg-[#85963A]/30 hover:bg-[#85963A]/60 border border-[#6f6e26]/40 transition-colors">
                <Link href="/complete-reports" className="flex flex-col gap-2 items-center">
                  <FileText className="w-6 h-6 text-gray-600" />
                  <span className="text-sm text-gray-900 font-medium">Ver Relatórios</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
