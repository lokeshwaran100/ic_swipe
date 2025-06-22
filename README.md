# <img src="asset/logo.png" width="25px" alt="logo"> IC Swipe - Gamified Crypto Discovery Platform

IC Swipe is a gamified crypto discovery and trading platform built on the Internet Computer Protocol (ICP). Users can discover and trade tokens through an intuitive Tinder-like swiping interface.

## Features

- **Swipe to Trade**: Swipe right to buy tokens, left to skip
- **Category-based Discovery**: Explore tokens by categories (DeFi, Gaming, AI, etc.)
- **AI Hunt**: AI-powered token discovery using natural language prompts
- **Portfolio Management**: Track your holdings and trading history
- **ICP Integration**: Seamless integration with ICP blockchain

## AI Hunt Feature

The AI Hunt feature uses Google's Gemini AI to generate personalized token recommendations based on your natural language prompts. Simply describe what you're looking for (e.g., "AI tokens with strong fundamentals" or "DeFi projects with high yield"), and the AI will generate 4-5 relevant tokens with complete metadata.

### Environment Setup for AI Hunt

To use the AI Hunt feature, you need to set up a Google Gemini API key:

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the following environment variable to your `.env` file in the frontend directory:

```
VITE_GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: The AI Hunt feature will work with fallback tokens if no API key is provided, but the full AI experience requires the API key.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local replica**:
   ```bash
   dfx start --clean --background
   ```

3. **Deploy the canisters**:
   ```bash
   dfx deploy
   ```

4. **Start the frontend**:
   ```bash
   cd src/ic_swipe_frontend
   npm start
   ```

## Project Structure

- `src/ic_swipe_backend/` - Rust backend canister
- `src/ic_swipe_frontend/` - React frontend application
- `src/ic_swipe_frontend/src/components/` - React components
- `src/ic_swipe_frontend/src/services/` - AI and backend services

## Backend Functions

- `deposit_icp(amount)` - Deposit ICP to your account
- `swap_icp_to_token(token_id, amount)` - Buy tokens with ICP
- `swap_token_to_icp(token_id, amount)` - Sell tokens for ICP
- `get_user_portfolio()` - Get your complete portfolio
- `get_user_icp_balance()` - Get your ICP balance

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
