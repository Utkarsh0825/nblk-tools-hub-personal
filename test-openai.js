import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API key...');
    console.log('API Key (first 10 chars):', process.env.OPENAI_API_KEY?.substring(0, 10));
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say hello' }],
      max_tokens: 10,
    });

    console.log('✅ OpenAI API working!');
    console.log('Response:', response.choices[0]?.message?.content);
  } catch (error) {
    console.error('❌ OpenAI API error:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
  }
}

testOpenAI(); 