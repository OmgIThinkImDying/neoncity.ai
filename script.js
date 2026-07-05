const token = 'hf_hf_VWpmfRTHvomQBIpjrCgJrqpSIXISvlnZsX'; // замените!

document.getElementById('generate').onclick = async () => {
  const model = document.getElementById('model').value;
  const prompt = document.getElementById('prompt').value;
  const resultDiv = document.getElementById('result');
  
  if (!prompt) { resultDiv.innerHTML = 'Введите запрос'; return; }
  resultDiv.innerHTML = '⏳ Генерация...';

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) throw new Error('Ошибка API');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    resultDiv.innerHTML = `<img src="${url}" alt="генерация">`;
  } catch {
    resultDiv.innerHTML = '❌ Ошибка. Попробуйте другую модель.';
  }
};
