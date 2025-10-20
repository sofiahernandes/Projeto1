"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import Hero from "@/components/hero"

import { overallMetrics } from "@/lib/overall-metrics";
import { donations } from "@/lib/donations";

export default function PublicDashboard() {
  const recentDonations = donations.slice(0, 6);
  const biggestDonations = donations.slice(0, 6);

  return (
    <div className="flex flex-col scroll-smooth">
    <Hero />

    <main id="public-graph" className="w-full lg:p-10 p-6 min-h-screen flex align-center justify-center">
      <div className="w-full">
        <div className="flex justify-center w-full pb-4">
          <h1 className="font-light text-white text-sm">
            Arkana Dashboard
          </h1>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Catões de Estatísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {overallMetrics.map((metric, index) => (
              <Card
                key={index}
                className="h-22 justify-center bg-primary border-none shadow-sm overflow-hidden"
              >
                <CardContent className="px-6">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                      <metric.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm">{metric.label}</p>
                      <p className="text-2xl font-semibold">{metric.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Contribuições Recentes */}
            <Card className="hover:border-secondary/50 bg-transparent border border-secondary/40">
              <CardContent className="px-6">
                <h2 className="text-lg text-center font-semibold text-gray-900 pb-3">
                  Contribuições Recentes
                </h2>
                <div>
                  {recentDonations.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/20 cursor-pointer transition-colors"
                    >
                      <div className="w-6 h-6 rounded-3xl flex items-center justify-center text-white">
                        <activity.icon className="w-4 h-4 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{activity.name}</p>
                      </div>
                      <p className="text-sm text-gray-600">{activity.team}</p>
                      <span className="text-sm text-gray-500">
                        {activity.date}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Times Recentemente Ativos */}
            <Card className="hover:border-secondary/50 bg-transparent border border-secondary/40">
              <CardContent className="px-6">
                <h2 className="text-lg text-center font-semibold text-gray-900 pb-3">
                  Maiores Doações
                </h2>
                <div>
                  {biggestDonations.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/20 cursor-pointer transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900">{item.team}</p>
                      </div>
                      <span className="text-secondary text-md">
                        R${item.ammount}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="px-0">
              <div className="grid grid-cols-2 gap-4">
                <Button className="overflow-hidden h-18 flex-col gap-2 bg-secondary/40 hover:bg-secondary/50 hover:border-secondary/60 border border-secondary/40 transition-colors">
                  <Link
                    href="/register/login"
                    className="flex flex-col gap-2 items-center"
                  >
                    <BookOpen className="w-6 h-6 text-gray-600" />
                    <span className="text-sm text-gray-900 font-medium">
                      Registrar Doações
                    </span>
                  </Link>
                </Button>
                <Button className="bg-secondary/40 overflow-hidden h-18 gap-2 hover:bg-secondary/50 border border-secondary/40">
                  <Link
                    href="/public-reports"
                    className="flex flex-col gap-2 items-center"
                  >
                    <FileText className="w-6 h-6 text-gray-600" />
                    <span className="text-sm text-gray-900 font-medium">
                      Ver Relatórios
                    </span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
    </div>
  );
}
