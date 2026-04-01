export type EvidenceType = 'RELATO_DIRETO' | 'FORUM_DISCUSSAO' | 'DADOS_MERCADO';

export type Evidence = {
  source: string;
  /** Verifiable URL where the evidence can be independently confirmed */
  sourceUrl: string;
  text: string;
  /** Classifies the nature of the evidence: direct complaint, forum discussion, or market data */
  evidenceType: EvidenceType;
};

export type AnalysisResult = {
  evidences: Evidence[];
  /** 0–100 score reflecting the actual volume and quality of evidence found */
  dataConfidence: number;
  painScore: number;
  aiSummaryScore: number;
  paymentScore: number;
  nextSteps: string[];
  verdict: 'VÁLIDO' | 'INVÁLIDO';
  verdictReason: string;
};

export type ApiError = 'RATE_LIMIT_EXCEEDED' | 'ANALYSIS_FAILED' | null;
