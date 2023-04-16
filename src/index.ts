export const handler = async (event: any = {}): Promise<any> => {
    console.log('Event:', JSON.stringify(event));
    const response = {
      statusCode: 200,
      body: 'Hello, world!'
    };
    return response;
  };
