"use client";

import React, { useState } from 'react';
import SectionHeader from './ui/SectionHeader';
import ModeImpactChart from './charts/ModeImpactChart';
import FeatureAdoptionChart from './charts/FeatureAdoptionChart';
import PremiumModelsUsageChart from './charts/PremiumModelsUsageChart';
import type { CopilotMetrics, MetricsStats } from '../types/metrics';
import type { FeatureAdoptionData, AgentImpactData, CodeCompletionImpactData, ModeImpactData } from '../utils/metricsParser';

interface CustomerEmailViewProps {
  metrics: CopilotMetrics[];
  featureAdoptionData: FeatureAdoptionData | null;
  joinedImpactData: ModeImpactData[];
  agentImpactData: AgentImpactData[];
  codeCompletionImpactData: CodeCompletionImpactData[];
  stats: MetricsStats;
  enterpriseName: string | null;
  onBack: () => void;
}

export default function CustomerEmailView({
  metrics,
  featureAdoptionData,
  joinedImpactData,
  agentImpactData,
  codeCompletionImpactData,
  stats,
  enterpriseName,
  onBack
}: CustomerEmailViewProps) {
  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const topModelName = stats?.topModel?.name || 'N/A';
  const enterpriseDisplayName = enterpriseName || '[Enterprise Name]';

  // Calculate total lines added for Agent Mode vs Code Completion
  const totalAgentLinesAdded = agentImpactData.reduce((sum, entry) => sum + entry.locAdded, 0);
  const totalCodeCompletionLinesAdded = codeCompletionImpactData.reduce((sum, entry) => sum + entry.locAdded, 0);
  const isAgentModeHealthy = totalAgentLinesAdded > totalCodeCompletionLinesAdded;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <SectionHeader
        title="Customer Email Report"
        description="Curated summary of key Copilot impact, adoption, and premium model usage metrics suitable for sharing in a customer-facing update."
        onBack={onBack}
        className="mb-6"
      />

      {/* Input Fields */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
            Contact Name
          </label>
          <input
            type="text"
            id="contactName"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Enter contact name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Email Content */}
      <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Content</h3>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          <p>Hi {contactName || '[Contact Name]'},</p>
          
          <p>I hope you&apos;re doing well, it&apos;s been a while since we last spoke.</p>
          
          <p>I wanted to give you a few updates on GitHub Copilot.</p>
          
          <p>
            A few days ago I signed you up for a Copilot Insights Dashboard and User Level Statistics API private preview.
            You can find it at:
            <br />
            <a 
              href={`https://github.com/enterprises/ENTERPRISE/insights/copilot?period=28d&interval=1d`}
              className="text-indigo-600 hover:text-indigo-800 underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/enterprises/ENTERPRISE/insights/copilot?period=28d&interval=1d
            </a>
          </p>
          
          <p>
            As this is a private preview, I can share preview docs with you:
            <br />
            <a 
              href="https://docs.github.com/en/enterprise-cloud@latest/early-access/copilot-metrics"
              className="text-indigo-600 hover:text-indigo-800 underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://docs.github.com/en/enterprise-cloud@latest/early-access/copilot-metrics
            </a>
          </p>
          
          <p>
            There you&apos;d find a lot of useful information about Copilot Adoption at {enterpriseDisplayName}.
          </p>
          
          <p>
            While the native dashboard is still under development, and currently shows aggregate statistics, 
            the user level data (api or file export) provides useful insights. This is IDE-only data, that 
            doesn&apos;t take into account usage from other surfaces, such as Code Review, Copilot Coding Agent 
            and Chat in github.com.
          </p>
          
          <p>I analyzed the export to show you what&apos;s possible.</p>
          
          <p>The top used model in your enterprise is <strong>{topModelName}</strong>.</p>
          
          <p>From the overall Copilot Impact point of view, things look pretty good, though.</p>
        </div>
      </div>

      <div className="space-y-8">
        <ModeImpactChart
          data={joinedImpactData || []}
          title="Combined Copilot Impact"
          description="Aggregate impact across Code Completion, Agent Mode, Edit Mode, and Inline Mode activities."
          emptyStateMessage="No combined impact data available."
        />
        
        {/* Agent Mode vs Code Completion Analysis */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            {isAgentModeHealthy ? (
              <>There is a healthy balance between autocomplete and Agent Mode.</>
            ) : (
              <>Agent Mode seems to be underutilized in {enterpriseDisplayName}.</>
            )}
          </p>
        </div>

        <ModeImpactChart
          data={agentImpactData || []}
          title="Copilot Agent Mode Impact"
          description="Daily lines of code added and deleted through Copilot Agent Mode sessions."
          emptyStateMessage="No agent mode impact data available."
        />
        <ModeImpactChart
          data={codeCompletionImpactData || []}
          title="Code Completion Impact"
          description="Daily lines of code added and deleted when developers accept Copilot code completions."
          emptyStateMessage="No code completion impact data available."
        />
        
        {/* LoC productivity note */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            LoC is not the best way to measure productivity impact, of course, but it&apos;s a good indicator of adoption level and the level of user engagement.
          </p>
        </div>

        <div>
          <FeatureAdoptionChart data={featureAdoptionData as FeatureAdoptionData} />
        </div>
        <div>
          <PremiumModelsUsageChart metrics={metrics} />
        </div>
      </div>
    </div>
  );
}
