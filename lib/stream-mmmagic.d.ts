declare module 'stream-mmmagic' {
  import ReadableStream = NodeJS.ReadableStream

  export type MimeType = string | {
      type: string,
      encoding: string
  }

  export interface SniffStreamMimeTypeOptions {
      magicFile?: string
      splitMime?: boolean
      peekBytes?: number
  }

  interface SniffStreamMimeType {
      (
          input: ReadableStream,
          callback: (error: Error, mime: MimeType, output: ReadableStream) => void
      ): void

      (
          input: ReadableStream,
          options: SniffStreamMimeTypeOptions,
          callback: (error: Error, mime: MimeType, output: ReadableStream) => void
      ): void

      promise (input: ReadableStream, options?: SniffStreamMimeTypeOptions): Promise<[MimeType, ReadableStream]>
  }

  const sniffStreamMimeType: SniffStreamMimeType

  export default sniffStreamMimeType
}
