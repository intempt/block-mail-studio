
import React from 'react';
import { PerformanceAnalysisResult } from '@/services/EmailAIService';

interface PerformanceScoresProps {
  analysis: PerformanceAnalysisResult;
}

export const PerformanceScores: React.FC<PerformanceScoresProps> = ({ analysis }) => {
  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
      <div className="text-center p-3 bg-slate-50 rounded">
        <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
          {analysis.overallScore || '--'}
        </div>
        <div className="text-xs text-gray-600">Overall</div>
      </div>
      <div className="text-center p-3 bg-slate-50 rounded">
        <div className={`text-2xl font-bold ${getScoreColor(analysis.deliverabilityScore)}`}>
          {analysis.deliverabilityScore || '--'}
        </div>
        <div className="text-xs text-gray-600">Deliverability</div>
      </div>
      <div className="text-center p-3 bg-slate-50 rounded">
        <div className={`text-2xl font-bold ${getScoreColor(analysis.mobileScore)}`}>
          {analysis.mobileScore || '--'}
        </div>
        <div className="text-xs text-gray-600">Mobile</div>
      </div>
      <div className="text-center p-3 bg-slate-50 rounded">
        <div className={`text-2xl font-bold ${analysis.spamScore !== null ? analysis.spamScore > 20 ? 'text-red-600' : 'text-green-600' : 'text-gray-600'}`}>
          {analysis.spamScore || '--'}
        </div>
        <div className="text-xs text-gray-600">Spam Risk</div>
      </div>
    </div>
  );
};
