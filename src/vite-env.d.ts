/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module "html2pdf.js" {
  type Html2PdfOptions = {
    margin?: number | [number, number] | [number, number, number, number];
    filename?: string;
    image?: { type?: string; quality?: number };
    enableLinks?: boolean;
    html2canvas?: Record<string, unknown>;
    jsPDF?: Record<string, unknown>;
    pagebreak?: {
      mode?: string | string[];
      before?: string | string[];
      after?: string | string[];
      avoid?: string | string[];
    };
  };

  type Html2PdfInstance = {
    from: (element: HTMLElement | string) => Html2PdfInstance;
    set: (options: Html2PdfOptions) => Html2PdfInstance;
    save: (filename?: string) => Promise<void>;
    output: (
      type?: string,
      options?: Record<string, unknown>,
    ) => Promise<unknown>;
    outputPdf: (type?: string) => Promise<unknown>;
    toPdf: () => Html2PdfInstance;
    toCanvas: () => Html2PdfInstance;
    toImg: () => Html2PdfInstance;
    then: (cb: (instance: Html2PdfInstance) => void) => Html2PdfInstance;
  };

  function html2pdf(): Html2PdfInstance;
  function html2pdf(
    element: HTMLElement | string,
    options?: Html2PdfOptions,
  ): Html2PdfInstance;
  export default html2pdf;
}
