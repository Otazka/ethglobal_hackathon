import requests
import os

def get_ton_usdt_price() -> float:
    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {
        "ids": "the-open-network",
        "vs_currencies": "usd"
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        return round(data["the-open-network"]["usd"], 4)
    else:
        raise Exception(f"CoinGecko error: {response.status_code} → {response.text}")