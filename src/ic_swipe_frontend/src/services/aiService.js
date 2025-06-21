const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export class AIService {
  static async generateTokens(userPrompt) {
    if (!GEMINI_API_KEY) {
      console.warn('Gemini API key not found. Using fallback tokens.');
      return this.getFallbackTokens(userPrompt);
    }

    const prompt = `
Based on the user's request: "${userPrompt}"

Generate exactly 4-5 realistic cryptocurrency tokens that match their criteria. Return ONLY a valid JSON array with no additional text or formatting. Each token should have this exact structure:

[
  {
    "id": 1,
    "name": "Token Name",
    "symbol": "SYMBOL",
    "price": 0.00001234,
    "priceChange": { "h24": "45.67" },
    "marketCap": 1500000,
    "liquidity": { "usd": 25000 },
    "fdv": 1600000,
    "svgIcon": "AI",
    "url": "https://dexscreener.com/ethereum/0x...",
    "pairCreatedAt": ${Math.floor(Date.now() / 1000) - 86400 * 7},
    "baseToken": { "name": "Token Name", "symbol": "SYMBOL" },
    "description": "Brief description of what makes this token special",
    "aiReasoning": "Why this token matches the user's request",
    "category": "AI/DeFi/Gaming/Meme/etc",
    "riskLevel": "Low/Medium/High",
    "volume24h": 150000,
    "holders": 2500,
    "website": "https://tokenname.io",
    "twitter": "https://twitter.com/tokenname"
  }
]

Guidelines:
- Generate exactly 4-5 tokens, no more, no less
- Make tokens realistic and relevant to the user's prompt
- Use varied price ranges: micro-cap ($50K-$500K), small-cap ($500K-$10M), mid-cap ($10M-$100M)
- Include both positive and negative price changes (-80% to +300%)
- Create unique, believable token names and 3-5 character symbols
- Make descriptions engaging and specific to each token's use case
- Explain in aiReasoning why each token matches the user's criteria
- Use "AI" as svgIcon for all tokens
- Vary the pairCreatedAt timestamps (1-90 days ago)
- Include realistic volume, holder count, and social links
- Assign appropriate risk levels and categories
- Ensure each token has a distinct value proposition
`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        console.warn(`Gemini API request failed: ${response.status}. Using fallback tokens.`);
        return this.getFallbackTokens(userPrompt);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        console.warn('No content generated from Gemini AI. Using fallback tokens.');
        return this.getFallbackTokens(userPrompt);
      }

      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('No valid JSON found in Gemini response. Using fallback tokens.');
        return this.getFallbackTokens(userPrompt);
      }

      const tokens = JSON.parse(jsonMatch[0]);
      
      // Validate the structure and limit to 4-5 tokens
      if (!Array.isArray(tokens) || tokens.length === 0) {
        console.warn('Invalid token data structure from Gemini. Using fallback tokens.');
        return this.getFallbackTokens(userPrompt);
      }

      // Ensure we have exactly 4-5 tokens
      const limitedTokens = tokens.slice(0, 5);
      
      // Validate each token has required fields
      const validatedTokens = limitedTokens.map((token, index) => ({
        id: token.id || index + 1,
        name: token.name || `AI Token ${index + 1}`,
        symbol: token.symbol || `AI${index + 1}`,
        price: parseFloat(token.price) || Math.random() * 0.001,
        priceChange: token.priceChange || { h24: (Math.random() * 200 - 100).toFixed(2) },
        marketCap: parseInt(token.marketCap) || Math.floor(Math.random() * 10000000) + 100000,
        liquidity: token.liquidity || { usd: Math.floor(Math.random() * 100000) + 10000 },
        fdv: parseInt(token.fdv) || parseInt(token.marketCap) + Math.floor(Math.random() * 1000000),
        svgIcon: "AI",
        url: token.url || `https://dexscreener.com/ethereum/0x${Math.random().toString(16).substr(2, 40)}`,
        pairCreatedAt: token.pairCreatedAt || Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 90),
        baseToken: token.baseToken || { name: token.name, symbol: token.symbol },
        description: token.description || `AI-generated token for ${userPrompt}`,
        aiReasoning: token.aiReasoning || `This token matches your search for "${userPrompt}" based on its innovative features.`,
        category: token.category || "AI",
        riskLevel: token.riskLevel || "Medium",
        volume24h: parseInt(token.volume24h) || Math.floor(Math.random() * 500000) + 50000,
        holders: parseInt(token.holders) || Math.floor(Math.random() * 5000) + 100,
        website: token.website || `https://${token.symbol?.toLowerCase() || 'token'}.io`,
        twitter: token.twitter || `https://twitter.com/${token.symbol?.toLowerCase() || 'token'}`
      }));

      console.log(`Generated ${validatedTokens.length} tokens using Gemini AI for prompt: "${userPrompt}"`);
      return validatedTokens;

    } catch (error) {
      console.error('Gemini AI Service Error:', error);
      console.warn('Falling back to default tokens due to error.');
      return this.getFallbackTokens(userPrompt);
    }
  }

  static getFallbackTokens(userPrompt) {
    // Enhanced fallback tokens with complete metadata
    const fallbackTokens = [
      {
        id: 1,
        name: "Neural Network Protocol",
        symbol: "NEURAL",
        price: 0.000234,
        priceChange: { h24: "67.89" },
        marketCap: 2400000,
        liquidity: { usd: 45000 },
        fdv: 2500000,
        svgIcon: "AI",
        url: "https://dexscreener.com/ethereum/0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        pairCreatedAt: Math.floor(Date.now() / 1000) - 86400 * 14,
        baseToken: { name: "Neural Network Protocol", symbol: "NEURAL" },
        description: "AI-powered decentralized trading algorithm with machine learning capabilities",
        aiReasoning: `Matches your search for "${userPrompt}" with advanced AI and neural network technology`,
        category: "AI",
        riskLevel: "Medium",
        volume24h: 180000,
        holders: 1250,
        website: "https://neuralprotocol.io",
        twitter: "https://twitter.com/neuralprotocol"
      },
      {
        id: 2,
        name: "Quantum Leap Finance",
        symbol: "QLAP",
        price: 0.000567,
        priceChange: { h24: "-23.45" },
        marketCap: 1800000,
        liquidity: { usd: 32000 },
        fdv: 1900000,
        svgIcon: "AI",
        url: "https://dexscreener.com/ethereum/0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
        pairCreatedAt: Math.floor(Date.now() / 1000) - 86400 * 21,
        baseToken: { name: "Quantum Leap Finance", symbol: "QLAP" },
        description: "Next-generation quantum computing for DeFi optimization and yield farming",
        aiReasoning: `Perfect for "${userPrompt}" as it represents cutting-edge quantum technology in finance`,
        category: "DeFi",
        riskLevel: "High",
        volume24h: 95000,
        holders: 890,
        website: "https://quantumleap.finance",
        twitter: "https://twitter.com/qlapfinance"
      },
      {
        id: 3,
        name: "Smart Contract AI",
        symbol: "SCAI",
        price: 0.00123,
        priceChange: { h24: "145.67" },
        marketCap: 5600000,
        liquidity: { usd: 89000 },
        fdv: 5800000,
        svgIcon: "AI",
        url: "https://dexscreener.com/ethereum/0x3c4d5e6f7890abcdef1234567890abcdef123456",
        pairCreatedAt: Math.floor(Date.now() / 1000) - 86400 * 7,
        baseToken: { name: "Smart Contract AI", symbol: "SCAI" },
        description: "Automated smart contract deployment and optimization using artificial intelligence",
        aiReasoning: `Ideal match for "${userPrompt}" combining AI with blockchain automation technology`,
        category: "AI",
        riskLevel: "Low",
        volume24h: 320000,
        holders: 2100,
        website: "https://smartcontractai.io",
        twitter: "https://twitter.com/scai_protocol"
      },
      {
        id: 4,
        name: "MetaVerse Builder",
        symbol: "MVBLD",
        price: 0.00089,
        priceChange: { h24: "78.23" },
        marketCap: 3200000,
        liquidity: { usd: 67000 },
        fdv: 3300000,
        svgIcon: "AI",
        url: "https://dexscreener.com/ethereum/0x4d5e6f7890abcdef1234567890abcdef12345678",
        pairCreatedAt: Math.floor(Date.now() / 1000) - 86400 * 35,
        baseToken: { name: "MetaVerse Builder", symbol: "MVBLD" },
        description: "AI-powered metaverse construction toolkit for creating immersive virtual worlds",
        aiReasoning: `Aligns with "${userPrompt}" through innovative AI-driven virtual world creation`,
        category: "Gaming",
        riskLevel: "Medium",
        volume24h: 210000,
        holders: 1680,
        website: "https://metaversebuilder.xyz",
        twitter: "https://twitter.com/mvbld_official"
      }
    ];

    console.log(`Using ${fallbackTokens.length} fallback tokens for prompt: "${userPrompt}"`);
    return fallbackTokens;
  }
} 