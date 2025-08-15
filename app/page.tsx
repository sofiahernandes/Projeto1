"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  FileText,
  BookOpen,
} from "lucide-react";

import { overallMetrics } from "@/lib/overall-metrics";
import { donations } from "@/lib/donations";
import { teams } from "@/lib/teams";

export default function ActivityMonitor() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const recentDonations = donations.slice(0, 5);
  const recentActiveTeams = teams.slice(0, 5);

  if (activeSection !== "dashboard") {
    return (
      <div className="container-alt">
        <div className="wrapper-narrow">
          <div className="header">
            <h1 className="title">Arkana Dashboard</h1>
          </div>

          <Card className="card card--center">
            <CardContent>
              <div className="section-space">
                <div className="icon-bubble">
                  <Plus className="icon-xxl" />
                </div>
                <h2 className="subtitle">
                  {activeSection === "new-activity" && "Registrar Doações"} {/* Formulário Login */}
                  {activeSection === "reports" && "Ver Relatórios"} {/* Mudar total: redirecionar para página de relatórios */}
                </h2>
              </div>
              <Button className="btn-back" onClick={() => setActiveSection("dashboard")}>
                ← Voltar ao Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              <Button
                key={1}
                className="btn-qa activity-name"
                onClick={() => setActiveSection("new-activity")}
              >
                <BookOpen className="qa-icon" />
                <span>Registrar Doações</span>
              </Button>
              <Button
                key={2}
                className="btn-qa-alt activity-name"
                onClick={() => setActiveSection("reports")}
              >
                <FileText className="qa-icon" />
                <span>Ver Relatórios</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
