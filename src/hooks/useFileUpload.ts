'use client';

import { useCallback, useState } from 'react';
import { CopilotMetrics } from '../types/metrics';
import { parseMetricsStream, parseMultipleMetricsStreams, MultiFileProgress } from '../domain/metricsParser';
import { calculateStats } from '../domain/calculators/metricCalculators';
import { useRawMetrics } from '../components/MetricsContext';
import { getBasePath } from '../utils/basePath';

interface UseFileUploadReturn {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSampleLoad: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  uploadProgress: MultiFileProgress | null;
}

export function useFileUpload(): UseFileUploadReturn {
  const [uploadProgress, setUploadProgress] = useState<MultiFileProgress | null>(null);
  const {
    isLoading,
    error,
    setRawMetrics,
    setOriginalStats,
    setEnterpriseName,
    setIsLoading,
    setError,
  } = useRawMetrics();

  const deriveEnterpriseName = useCallback((firstMetric: CopilotMetrics): string | null => {
    const loginSuffix = firstMetric.user_login?.includes('_')
      ? firstMetric.user_login.split('_').pop()?.trim()
      : undefined;
    const enterpriseId = firstMetric.enterprise_id.trim();
    const derivedEnterpriseName = loginSuffix && loginSuffix.length > 0 
      ? loginSuffix 
      : (enterpriseId.length > 0 ? enterpriseId : null);
    return derivedEnterpriseName;
  }, []);

  const processMetrics = useCallback((parsedMetrics: CopilotMetrics[]) => {
    const calculatedStats = calculateStats(parsedMetrics);

    const firstMetric = parsedMetrics[0];
    if (firstMetric) {
      setEnterpriseName(deriveEnterpriseName(firstMetric));
    } else {
      setEnterpriseName(null);
    }
    
    setRawMetrics(parsedMetrics);
    setOriginalStats(calculatedStats);
  }, [deriveEnterpriseName, setRawMetrics, setOriginalStats, setEnterpriseName]);

  const processMetricsFile = useCallback(async (file: File) => {
    const parsedMetrics = await parseMetricsStream(file);
    processMetrics(parsedMetrics);
  }, [processMetrics]);

  const processMultipleFiles = useCallback(async (files: File[]) => {
    const parsedMetrics = await parseMultipleMetricsStreams(files, (progress) => {
      setUploadProgress(progress);
    });
    processMetrics(parsedMetrics);
  }, [processMetrics]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    
    for (const file of files) {
      const lowerName = file.name.toLowerCase();
      if (!lowerName.endsWith('.json') && !lowerName.endsWith('.ndjson')) {
        setError(`Unsupported file type: ${file.name}. Please upload .json or .ndjson files.`);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setUploadProgress(null);

    try {
      if (files.length === 1) {
        await processMetricsFile(files[0]);
      } else {
        await processMultipleFiles(files);
      }
    } catch (err) {
      setError(`Failed to parse files: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      setUploadProgress(null);
    }
  }, [processMetricsFile, processMultipleFiles, setIsLoading, setError]);

  const handleSampleLoad = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${getBasePath()}/data/sample-report.ndjson`);
      if (!response.ok) {
        throw new Error('Failed to load sample report');
      }
      
      const blob = await response.blob();
      const file = new File([blob], 'sample-report.ndjson', { type: 'application/x-ndjson' });
      
      await processMetricsFile(file);
    } catch (err) {
      setError(`Failed to load sample report: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [processMetricsFile, setIsLoading, setError]);

  return {
    handleFileUpload,
    handleSampleLoad,
    isLoading,
    error,
    uploadProgress,
  };
}
