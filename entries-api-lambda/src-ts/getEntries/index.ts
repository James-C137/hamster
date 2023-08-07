import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';

const insertEntryBodySchema = z.object({
  timestamp: z.coerce.date(),
  username: z.string(),
  analysisName: z.string().optional(),
  entryName: z.string().optional(),
  data: z.string().optional(),
});

type InsertEntryBody = z.infer<typeof insertEntryBodySchema>;

export async function getEntries(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body = insertEntryBodySchema.parse(JSON.parse(event.body ?? ''));
  }
  catch (e) {
    let message: string = 'Bad Request';
    if (e instanceof Error) {
      message = e.message;
    }
    else if (typeof e === 'string') {
      message = e;
    }
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
      },
      body: message,
    }
  }

  return {
    statusCode: 200,
    body: '',
  }
}
