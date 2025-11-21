'use server';

import { definePDFJSModule, getDocumentProxy } from 'unpdf';
import { PDFDocumentProxy } from 'unpdf/pdfjs';
import NodeCanvas from '@napi-rs/canvas';
import { olmOCR } from '@/app/lib/olmocr';
import pLimit from 'p-limit';

/************
 * TUNABLES *
 ************/
// 20 concurrent requests to the endpoint max.
const parallelRequests = 20;

// This is needed for PDFjs which uses some globals.
if (typeof globalThis.DOMMatrix === 'undefined')
    globalThis.DOMMatrix = NodeCanvas.DOMMatrix as unknown as typeof DOMMatrix

if (typeof globalThis.ImageData === 'undefined')
    globalThis.ImageData = NodeCanvas.ImageData as unknown as typeof ImageData

if (typeof globalThis.Path2D === 'undefined')
    globalThis.Path2D = NodeCanvas.Path2D as unknown as typeof Path2D

// Use the full-featured version of PDFjs.
await definePDFJSModule(() => import('pdfjs-dist'));

const TARGET_IMAGE_DIMENSION = 1288;

/**
 * @brief Convert a PDF page to a 1288px image.
 * @param proxy PDFDocumentProxy of PDF.
 * @param page Page number.
 * @returns Blob(image/png) of the page.
 */
export async function pageToImage(proxy: PDFDocumentProxy, page: number): Promise<Blob> {
    const pageProxy = await proxy.getPage(page);

    // Calculate size of viewport according to target size.
    const defaultVP = pageProxy.getViewport({ scale: 1.0 });
    let scale = 1.0;

    if (defaultVP.width > defaultVP.height) {
        scale = TARGET_IMAGE_DIMENSION / defaultVP.width;
    } else {
        scale = TARGET_IMAGE_DIMENSION / defaultVP.height;
    }

    // Get scaled viewport.
    const viewport = pageProxy.getViewport({ scale });

    // Create canvas, and render the PDF into it.
    const canvas = NodeCanvas.createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    await pageProxy.render({
        canvas: canvas as unknown as HTMLCanvasElement,
        canvasContext: ctx as unknown as CanvasRenderingContext2D,
        viewport,
    }).promise;

    // Return the canvas encoded as a PNG.
    return await canvas.convertToBlob();
}

const limit = pLimit(parallelRequests);

/**
 * @brief Converts a PDF file to text.
 * @param pdfFile Blob(application/pdf) of PDF file.
 * @returns an array of strings for the text of each page.
 */
export async function pdfToText(pdfFile: Blob): Promise<string[]> {
    // Open PDF.
    const pdf = await getDocumentProxy(await pdfFile.bytes(), {
    });

    let res = await Promise.all(
        // For each page (1-indexed)
        Array(pdf.numPages).keys().map(n => n + 1)
            // convert page to image
            .map(n => pageToImage(pdf, n))
            // convert image to text with olmOCR, limit parallelism
            .map(p => p.then(b => limit(olmOCR, b)))
    );

    return res;
}

