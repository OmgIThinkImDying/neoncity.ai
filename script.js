const token = 'hf_hf_STsoFnlAqwrgZsOYWLNHlibYWoEmgJjtWf'; // 👈 ВСТАВЬТЕ СВОЙ ТОКЕН!

document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('generate');
  if (button) {
    button.onclick = generateImage;
  }
});

async function generateImage() {
  const model = document.getElementById('model').value;
  const prompt = document.getElementById('prompt').value;
  const resultDiv = document.getElementById('result');
  
  if (!prompt.trim()) {
    resultDiv.innerHTML = '⚠️ Введите запрос';
    return;
  }
  
  resultDiv.innerHTML = '⏳ Генерация... (до 30 секунд)';

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    // --- РАСШИФРОВКА ОШИБОК ---
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMsg = '';
      
      switch (response.status) {
        case 401:
          errorMsg = '❌ Неверный токен. Проверьте ключ hf_...';
          break;
        case 403:
          errorMsg = '❌ Лимит запросов исчерпан (1000/день) или модель платная';
          break;
        case 404:
          errorMsg = '❌ Модель не найдена. Проверьте название';
          break;
        case 429:
          errorMsg = '❌ Слишком много запросов. Подождите 10 секунд';
          break;
        case 503:
          errorMsg = '⏳ Модель загружается... Подождите 20 секунд и нажмите ещё раз';
          break;
        default:
          errorMsg = `❌ Ошибка ${response.status}: ${errorData.error || 'Неизвестная ошибка'}`;
      }
      
      resultDiv.innerHTML = errorMsg;
      return;
    }

    // --- УСПЕШНАЯ ГЕНЕРАЦИЯ ---
    const blob = await response.blob();
    
    // Проверка, что пришла картинка, а не текст ошибки
    if (!blob.type.startsWith('image/')) {
      const text = await blob.text();
      resultDiv.innerHTML = `❌ Сервер вернул текст: ${text.substring(0, 100)}`;
      return;
    }
    
    const url = URL.createObjectURL(blob);
    resultDiv.innerHTML = `<img src="${url}" alt="NeonCity AI генерация" style="max-width:100%;border-radius:16px;margin-top:16px;">`;
    
  } catch (error) {
    resultDiv.innerHTML = `❌ Ошибка соединения: ${error.message}. Проверьте интернет.`;
  }
}
