export async function POST(req) {
    const { message } = await req.json();
    
    try {
      const response = await fetch('https://api.langflow.astra.datastax.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ASTRA_DB_TOKEN}`
        },
        body: JSON.stringify({
          flow_id: '180be5c2-5808-490f-9a58-7555eea049b3',
          langflow_id: '79f415bc-232b-446f-b7cf-983ee7bb5c66',
          message: message,
          chat_type: 'chat'
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }