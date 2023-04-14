export async function OpenAIStream(res: { body: any }) {
  const reader = res.body.getReader();

  const stream = new ReadableStream({
    // https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
    // https://github.com/whichlight/chatgpt-api-streaming/blob/master/pages/api/OpenAIStream.ts
    start(controller) {
      return pump();
      function pump() {
        return reader.read().then(({ done, value }: any) => {
          // When no more data needs to be consumed, close the stream
          if (done) {
            controller.close();
            return;
          }
          // Enqueue the next data chunk into our target stream
          controller.enqueue(value);
          return pump();
        });
      }
    },
  });

  return stream;
}