export type Evidence = { source: string; text: string };

export type AnalysisResult = {
  evidences: Evidence[];
  painScore: number;
  aiSummaryScore: number;
  paymentScore: number;
  nextSteps: string[];
  verdict: 'VÁLIDO' | 'INVÁLIDO';
  verdictReason: string;
};

export type ApiError = 'RATE_LIMIT_EXCEEDED' | 'ANALYSIS_FAILED' | 'INVALID_INPUT' | null;
