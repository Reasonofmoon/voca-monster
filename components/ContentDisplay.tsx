/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface ContentDisplayProps {
  content: string;
  isLoading: boolean;
  // onWordClick is kept for prop compatibility but is no longer used.
  onWordClick: (word: string) => void;
}

const StreamingContent: React.FC<{ content: string }> = ({ content }) => (
  <p style={{ margin: 0 }}>
    {content}
    <span className="blinking-cursor">|</span>
  </p>
);

const FinalContent: React.FC<{ content: string }> = ({ content }) => (
  <p style={{ margin: 0 }}>{content}</p>
);

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, isLoading }) => {
  if (isLoading) {
    return <StreamingContent content={content} />;
  }
  
  return <FinalContent content={content} />;
};

export default ContentDisplay;
