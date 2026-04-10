import api from './api';

export interface ShapBreakdown {
  feature: string;
  value: number;
  impact: number;
}

export interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

export interface CreditDNA {
  score: number;
  base_value: number;
  shap_breakdown: ShapBreakdown[];
  radar_data: RadarData[];
  recommendations: string[];
}

export async function fetchCreditDNA(): Promise<CreditDNA> {
  const { data } = await api.get<CreditDNA>('/credit/dna/');
  return data;
}
