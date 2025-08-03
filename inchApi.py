import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

ETH = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
BASE_URL = "https://api.1inch.dev/swap/v5.2/1/quote"

def get_eth_to_usdt_quote(amount_eth: float) -> float:
    ONE_INCH_API_KEY = os.getenv('ONE_INCH_API_KEY')
    if not ONE_INCH_API_KEY:
        raise Exception("ONE_INCH_API_KEY not found in environment variables")
    
    amount_wei = int(amount_eth * 10**18)
    params = {
        "fromTokenAddress": ETH,
        "toTokenAddress": USDT,
        "amount": str(amount_wei)
    }
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {ONE_INCH_API_KEY}"
    }

    response = requests.get(BASE_URL, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        
        # Handle the actual API response structure
        if 'toAmount' in data:
            # USDT has 6 decimals
            to_token_amount = int(data['toAmount']) / (10 ** 6)
            return round(to_token_amount, 2)
        else:
            raise Exception("Unexpected API response structure")
    else:
        raise Exception(f"1inch API error: {response.status_code} → {response.text}")
