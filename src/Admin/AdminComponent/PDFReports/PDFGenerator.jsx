import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';

const PDFGenerator = ({ document, fileName, buttonText }) => {
  return (
    <PDFDownloadLink
      document={document}
      fileName={fileName}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
    >
      {({ loading }) => (
        <>
          <Download className="w-4 h-4 mr-2" />
          {loading ? 'Generating PDF...' : buttonText}
        </>
      )}
    </PDFDownloadLink>
  );
};

export default PDFGenerator; 