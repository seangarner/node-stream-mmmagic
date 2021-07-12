import * as magic from 'stream-mmmagic';

declare const input: NodeJS.ReadableStream
declare const splitMime: boolean

type MimeType = {
    type: string,
    encoding: string
}

magic(input, (error: Error, mime: MimeType, output: NodeJS.ReadableStream) => {})
magic(input, { peekBytes: 4 * 1024 }, (error: Error, mime: MimeType, output: NodeJS.ReadableStream) => {})
magic(input, { splitMime: true }, (error: Error, mime: MimeType, output: NodeJS.ReadableStream) => {})
magic(input, { splitMime: false }, (error: Error, mime: string, output: NodeJS.ReadableStream) => {})
magic(input, { splitMime }, (error: Error, mime: string | MimeType, output: NodeJS.ReadableStream) => {})

// @ts-expect-error
magic(input, { splitMime: false }, (error: Error, mime: MimeType, output: NodeJS.ReadableStream) => {})

// @ts-expect-error
magic(input, { splitMime: true }, (error: Error, mime: string, output: NodeJS.ReadableStream) => {})

async function testPromise() {
    let mimeObject: MimeType
    let mimeString: string
    let mimeBoth: MimeType | string
    let output: NodeJS.ReadableStream

    [mimeObject, output] = await magic.promise(input);
    [mimeObject, output] = await magic.promise(input, { peekBytes: 4 * 1024 });
    [mimeString, output] = await magic.promise(input, { splitMime: false });
    [mimeBoth, output] = await magic.promise(input, { splitMime });

    // @ts-expect-error
    [mimeString, output] = await magic.promise(input);

    // @ts-expect-error
    [mimeString, output] = await magic.promise(input, { splitMime: true });
}
