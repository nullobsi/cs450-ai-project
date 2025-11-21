'use server';

import { definePDFJSModule, getMeta, renderPageAsImage, getDocumentProxy } from 'unpdf';
import { PDFDocumentProxy } from 'unpdf/pdfjs';
import { createCanvas } from '@napi-rs/canvas';
import napicanvas from '@napi-rs/canvas';
import { olmOCR } from './olmocr';
import pLimit from 'p-limit';

const canvasImport = await import('@napi-rs/canvas');

if (typeof globalThis.DOMMatrix === 'undefined')
    globalThis.DOMMatrix = napicanvas.DOMMatrix as unknown as typeof DOMMatrix

if (typeof globalThis.ImageData === 'undefined')
    globalThis.ImageData = napicanvas.ImageData as unknown as typeof ImageData

if (typeof globalThis.Path2D === 'undefined')
    globalThis.Path2D = napicanvas.Path2D as unknown as typeof Path2D

await definePDFJSModule(() => import('pdfjs-dist'));

const TARGET_IMAGE_DIMENSION = 1288;

async function pageToImage(proxy: PDFDocumentProxy, page: number): Promise<Blob> {
    const pageProxy = await proxy.getPage(page);
    const defaultVP = pageProxy.getViewport({ scale: 1.0 });
    let scale = 1.0;

    if (defaultVP.width > defaultVP.height) {
        scale = TARGET_IMAGE_DIMENSION / defaultVP.width;
    } else {
        scale = TARGET_IMAGE_DIMENSION / defaultVP.height;
    }

    const viewport = pageProxy.getViewport({ scale });

    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    await pageProxy.render({
        canvas: canvas as unknown as HTMLCanvasElement,
        canvasContext: ctx as unknown as CanvasRenderingContext2D,
        viewport,
    }).promise;

    return await canvas.convertToBlob();
}

export async function pdfToText(pdfFile: Blob): Promise<string[]> {
    const pdf = await getDocumentProxy(await pdfFile.bytes(), {
    });

    const limit = pLimit(20);

    let res = await Promise.all(Array(pdf.numPages).keys().map(n => n + 1).map(n => pageToImage(pdf, n)).map(p => p.then(b => limit(olmOCR, b))));

    return res.filter(v => v !== undefined);
}

