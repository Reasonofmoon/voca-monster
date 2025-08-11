/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import type { WorksheetData } from '../services/geminiService';

interface WorksheetDisplayProps {
  data: WorksheetData;
  onBack: () => void;
}

const WorksheetDisplay: React.FC<WorksheetDisplayProps> = ({ data, onBack }) => {

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
        <div className="no-print flex justify-between items-center mb-8">
            <button onClick={onBack} className="text-indigo-600 hover:underline">
            &larr; Back to Analyzer
            </button>
            <button onClick={handlePrint} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
             🖨️ Print / Save as PDF
            </button>
        </div>
        
        <article className="bg-white p-8 rounded-lg shadow-lg">
            <header className="text-center border-b pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{data.title}</h1>
                <p className="text-lg text-gray-600">Vocabulary Worksheet</p>
            </header>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Summary & Keywords</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{data.summary}</p>
                <ul className="flex flex-wrap gap-2">
                    {data.keywords.map((keyword, index) => (
                        <li key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">{keyword}</li>
                    ))}
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Vocabulary List</h2>
                <ul className="space-y-4">
                    {data.wordDetails.map((detail, index) => (
                        <li key={index} className="p-4 bg-gray-50 rounded-lg">
                            <p className="font-bold text-lg text-indigo-700">{detail.word}</p>
                            <p><em className="font-semibold">Korean:</em> {detail.koreanMeaning}</p>
                            <p><em className="font-semibold">English:</em> {detail.englishDefinition}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Vocabulary Test</h2>
                <p className="text-gray-700 mb-4">Fill in the blank with the correct word from your vocabulary list.</p>
                <ol className="list-decimal list-inside space-y-4">
                    {data.test.map((item, index) => (
                        <li key={index} className="text-gray-800">
                            <p>{item.question}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="print-only mt-8 pt-4 border-t">
                <h2 className="text-2xl font-semibold mb-4">Answer Key</h2>
                <ol className="list-decimal list-inside space-y-2">
                    {data.test.map((item, index) => (
                        <li key={index} className="text-gray-800 font-bold">{item.answer}</li>
                    ))}
                </ol>
            </section>

        </article>
    </div>
  );
};

export default WorksheetDisplay;
