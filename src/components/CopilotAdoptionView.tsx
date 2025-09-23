"use client";

import React from 'react';
import FeatureAdoptionChart from './charts/FeatureAdoptionChart';
import AgentModeHeatmapChart from './charts/AgentModeHeatmapChart';
import MetricTile from './MetricTile';
import type { FeatureAdoptionData, AgentModeHeatmapData } from '../utils/metricsParser';
import type { MetricsStats } from '../types/metrics';

interface CopilotAdoptionViewProps {
  featureAdoptionData: FeatureAdoptionData | null;
  agentModeHeatmapData: AgentModeHeatmapData[];
  stats: MetricsStats;
  onBack: () => void;
}

export default function CopilotAdoptionView({ featureAdoptionData, agentModeHeatmapData, stats, onBack }: CopilotAdoptionViewProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Copilot Adoption Analysis</h2>
          <p className="text-gray-600 text-sm mt-1 max-w-2xl">
            Understand Copilot feature adoption patterns and Agent Mode usage intensity across days.
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors"
        >
          ← Back to Overview
        </button>
      </div>

      {/* User Adoption Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Adoption Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricTile
            title="Chat Users"
            value={stats.chatUsers}
            accent="emerald"
            subtitle={`Out of ${stats.uniqueUsers.toLocaleString()} unique users`}
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
          />
          <MetricTile
            title="Agent Mode Users"
            value={stats.agentUsers}
            accent="violet"
            subtitle={`Out of ${stats.uniqueUsers.toLocaleString()} unique users`}
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
          <MetricTile
            title="Completion Only Users"
            value={stats.completionOnlyUsers}
            accent="amber"
            subtitle={`Out of ${stats.uniqueUsers.toLocaleString()} unique users`}
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
          />
        </div>
      </div>

      <div className="mb-12">
        <FeatureAdoptionChart data={featureAdoptionData || {
          totalUsers: 0,
          completionUsers: 0,
          chatUsers: 0,
          agentModeUsers: 0,
          askModeUsers: 0,
          editModeUsers: 0,
          inlineModeUsers: 0,
          codeReviewUsers: 0
        }} />
      </div>

      <div className="mb-6 pt-4">
        <AgentModeHeatmapChart data={agentModeHeatmapData || []} />
      </div>
    </div>
  );
}
