import * as React from 'react';

import './style.css';

interface SectionProps {
  title: string;
}

export const Section: React.SFC<SectionProps> = ({title, children}) => {
  return (
    <section className="section">
      <div className="section__title">{title}</div>
      {children}
      <div className="separator" />
    </section>
  );
};

export default Section;
