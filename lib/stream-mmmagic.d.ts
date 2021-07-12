declare module 'stream-mmmagic' {
  import ReadableStream = NodeJS.ReadableStream

  type MimeType = {
      type: string,
      encoding: string
  }

  interface SplitMime {
      splitMime?: true
  }

  interface DoNotSplitMime {
      splitMime: false
  }

  interface SniffStreamMimeTypeOptions {
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
          options: SniffStreamMimeTypeOptions & SplitMime,
          callback: (error: Error, mime: MimeType, output: ReadableStream) => void
      ): void

      (
        input: ReadableStream,
        options: SniffStreamMimeTypeOptions & DoNotSplitMime,
        callback: (error: Error, mime: string, output: ReadableStream) => void
      ): void

      (
        input: ReadableStream,
        options: SniffStreamMimeTypeOptions,
        callback: (error: Error, mime: string | MimeType, output: ReadableStream) => void
      ): void

      promise (input: ReadableStream, options?: SniffStreamMimeTypeOptions & SplitMime): Promise<[MimeType, ReadableStream]>
      promise (input: ReadableStream, options: SniffStreamMimeTypeOptions & DoNotSplitMime): Promise<[string, ReadableStream]>
      promise (input: ReadableStream, options: SniffStreamMimeTypeOptions): Promise<[string | MimeType, ReadableStream]>
  }

  const sniffStreamMimeType: SniffStreamMimeType
  export = sniffStreamMimeType
}
