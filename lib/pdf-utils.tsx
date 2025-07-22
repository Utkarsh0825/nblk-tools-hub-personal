import { renderToBuffer, Document } from '@react-pdf/renderer';
import React from 'react';
import { BusinessReportPDF } from '../pdf/BusinessReportPDF';

export async function generateBusinessReportPDF(props: any): Promise<Buffer> {
  const doc = (
    <Document>
      <BusinessReportPDF {...props} />
    </Document>
  );
  const buffer = await renderToBuffer(doc);
  return buffer;
} 