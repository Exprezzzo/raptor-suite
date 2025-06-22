// tested with Next.js 15.3.x + Firebase + All AI APIs + Node 20
require('dotenv').config({ path: '.env.local' });

const https = require('https');

const TESTS = [
  {
    name: 'OpenAI GPT-4',
    key: process.env.OPENAI_API_KEY,
    hostname: 'api.openai.com',
    path: '/v1/models',
    method: 'GET',
    headers: (key) => ({ 'Authorization': `Bearer ${key}` })
  },
  {
    name: 'Anthropic Claude',
    key: process.env.ANTHROPIC_API_KEY,
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: (key) => ({ 
      'x-api-key': key, 
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'ping' }]
    })
  },
  {
    name: 'Google Gemini',
    key: process.env.GEMINI_API_KEY,
    hostname: 'generativelanguage.googleapis.com',
    path: (key) => `/v1beta/models/gemini-1.5-pro:generateContent?key=${key}`,
    method: 'POST',
    headers: () => ({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'ping' }] }],
      generationConfig: { maxOutputTokens: 10 }
    })
  },
  {
    name: 'GitHub API',
    key: process.env.GITHUB_TOKEN,
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    headers: (key) => ({ 
      'Authorization': `Bearer ${key}`,
      'User-Agent': 'Raptor-Suite-Test/1.0'
    })
  }
];

async function testAllKeys() {
  console.log('\n RAPTOR SUITE - API KEY VERIFICATION');
  console.log('=====================================\n');

  for (const test of TESTS) {
    if (!test.key || test.key.includes('[REGENERATE') || test.key.includes('YOUR_')) {
      console.log(`  ${test.name}: SKIPPED (no key provided)`);
      continue;
    }

    console.log(` Testing ${test.name}...`);
    
    try {
      const result = await makeApiCall(test);
      if (result.success) {
        console.log(` ${test.name}: PASS`);
      } else {
        console.log(` ${test.name}: FAIL - ${result.error}`);
      }
    } catch (error) {
      console.log(` ${test.name}: ERROR - ${error.message}`);
    }
  }
}

function makeApiCall(test) {
  return new Promise((resolve) => {
    const options = {
      hostname: test.hostname,
      path: typeof test.path === 'function' ? test.path(test.key) : test.path,
      method: test.method,
      headers: test.headers(test.key),
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ success: true });
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          resolve({ success: false, error: 'Invalid API key' });
        } else {
          resolve({ success: false, error: `HTTP ${res.statusCode}` });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Request timeout' });
    });

    if (test.body) {
      req.write(test.body);
    }

    req.end();
  });
}

if (require.main === module) {
  testAllKeys();
}
