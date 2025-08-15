"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BookOpen } from "lucide-react";
import Link from "next/link";

import { overallMetrics } from "@/lib/overall-metrics";
import { donations } from "@/lib/donations";
import { teams } from "@/lib/teams";

export default function PublicDashboard() {
  const recentDonations = donations.slice(0, 5);
  const recentActiveTeams = teams.slice(0, 5);

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Arkana Dashboard</h1>
      </div>

      <div className="wrapper">
        {/* Cards de Estatísticas */}
        <div className="stats-grid">
          {overallMetrics.map((metric, index) => (
            <Card key={index} className="stat-card">
              <CardContent className="card-content-px6">
                <div className="stat-content">
                  <div className="stat-icon">
                    <metric.icon className="icon-md icon-green" />
                  </div>
                  <div>
                    <p className="stat-label">{metric.label}</p>
                    <p className="stat-value">{metric.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard */}
        <div className="two-col-grid">
          {/* Contribuições Recentes */}
          <Card className="card-default">
            <CardContent className="card-content-px6 card-content-pb">
              <h2 className="section-title">Contribuições Recentes</h2>
              <div>
                {recentDonations.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon-box">
                      <activity.icon className="icon-sm" />
                    </div>
                    <div className="activity-name">{activity.name}</div>
                    <p className="activity-team">{activity.team}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Times Recentemente Ativos */}
          <Card className="card-default">
            <CardContent className="card-content-px6">
              <h2 className="section-title">Maiores Doações</h2>
              <div>
                {recentActiveTeams.map((team, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-name">{team.name}</div>
                    <p className="activity-team">{team.activities} logs</p>
                    <span className="activity-amount">R${team.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="card-quick">
          <CardContent className="card-content--no-x">
            <div className="quick-grid">
              <Link
                className="btn-qa activity-name"
                href="/sign-in"
              >
                <BookOpen className="qa-icon" />
                <span>Registrar Doações</span>
              </Link>
              <Link
                className="btn-qa-alt activity-name"
                href="/complete-reports"
              >
                <FileText className="qa-icon" />
                <span>Ver Relatórios</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
