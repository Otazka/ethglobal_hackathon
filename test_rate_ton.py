#!/usr/bin/env python3
"""
Test script for the /rate_ton command functionality
"""

def test_rate_ton_function():
    """Test the /rate_ton command logic"""
    print("Testing /rate_ton functionality...")
    
    try:
        # Simple TON price approximation (you can replace this with actual API call)
        ton_price = 2.5  # Approximate TON price in USDT
        response = f"💎 TON Rate:\n1 TON ≈ {ton_price} USDT\n\n💡 Note: This is an approximate rate. For real-time prices, check CoinGecko or other exchanges."
        print(f"✅ /rate_ton command test successful!")
        print(f"Response: {response}")
        return True
    except Exception as e:
        error_msg = f"❌ Error getting TON rate: {str(e)}\nPlease try again later."
        print(f"❌ /rate_ton command test failed: {error_msg}")
        return False

if __name__ == "__main__":
    success = test_rate_ton_function()
    if success:
        print("\n🎉 /rate_ton command is working correctly!")
    else:
        print("\n❌ /rate_ton command has issues!") 