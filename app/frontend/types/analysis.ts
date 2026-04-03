/** Evidence synthesized by the AI model */
export type Evidence = { source: string; text: string };

/** Raw, traceable evidence collected directly from Tavily searches */
export type RawEvidence = {
  source: string;    // domain (e.g. "reddit.com")
  url: string;       // full URL for traceability
  text: string;      // verbatim snippet (≤ 200 chars)
  type: 'complaint' | 'research';
  publishedDate?: string;  // ISO date from source, or collection timestamp if unavailable
};

export type AnalysisResult = {
  /** AI-synthesized evidences (always present, exactly 3) */
  evidences: Evidence[];
  painScore: number;
  aiSummaryScore: number;
  paymentScore: number;
  nextSteps: string[];
  verdict: 'VÁLIDO' | 'INVÁLIDO';
  verdictReason: string;
  /** Real market signals from Tavily (may be empty if API key missing) */
  rawEvidences?: RawEvidence[];
};

export type ApiError = 'RATE_LIMIT_EXCEEDED' | 'ANALYSIS_FAILED' | 'INVALID_INPUT' | null;
