async function fetchSummary(content) {
  const apiKey = '';
  const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

  const prompt = `Por favor resume el texto principal que está dentro de la página web:\n\n${content}\n\nSummary: `;
  const maxTokens = 400;

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', 
        messages: [
          {
            role: 'system',
            content: 'Ayuda' 
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        n: 1,
        stop: ["Summary: "],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`La solicitud del API fallo con el estado ${response.status}`);
    }

    const jsonResponse = await response.json();
    console.log('Respuesta del API:', jsonResponse); // Registra toda la respuesta de la API

    if (jsonResponse.choices && jsonResponse.choices.length > 0) {
      const summaryText = jsonResponse.choices[0].message.content.trim(); // Ajusta según la estructura de la respuesta
      return summaryText;
    } else {
      throw new Error('Estructura de respuesta inesperada del API');
    }
  } catch (error) {
    console.error('Error al obtener el resumen:', error);
    return 'Se produjo un error al obtener el resumen. Inténtalo de nuevo.';
  }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    const content = request.content;
    console.log('Contenido recibido en segundo plano:', content); 
    fetchSummary(content)
      .then((summary) => {
        console.log('Resumen generado:', summary);
        chrome.runtime.sendMessage({ action: 'showSummary', summary: summary });
      })
      .catch((error) => {
        console.error('Error:', error);
        chrome.runtime.sendMessage({
          action: 'showSummary',
          summary: 'Se produjo un error al obtener el resumen. Inténtalo de nuevo.'
        });
      });
  }
});
