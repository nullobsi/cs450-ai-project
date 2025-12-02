'use server';

import sharp from 'sharp';
import { olmOCR } from '@/app/lib/olmocr';

/**
 * @brief Converts an image of a document to Markdown.
 * @param img Image blob/file.
 * @returns text
 */
export async function imageToText(img: Blob) {
	const image = await sharp(await img.arrayBuffer()).resize({
		width: 1288,
		height: 1288,
		fit: 'inside',
	}).toFormat('png').toBuffer();

	const blob = new Blob([new Uint8Array(image)], { type: "image/png" })

	return await olmOCR(blob);
}

