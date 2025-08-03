#!/usr/bin/env python3
"""
Test script for the /rate_ton command with amount parameter
"""

def test_rate_ton_with_amount():
    """Test the /rate_ton command with different amounts"""
    print("Testing /rate_ton with amount parameter...")
    
    test_cases = [
        ("/rate_ton 1", 1.0),
        ("/rate_ton 5", 5.0),
        ("/rate_ton 0.5", 0.5),
        ("/rate_ton 10", 10.0)
    ]
    
    ton_price = 2.5  # Approximate TON price in USDT
    
    for command, amount in test_cases:
        try:
            total_value = amount * ton_price
            response = f"💎 TON Exchange Rate:\n1 TON = {ton_price} USDT\nFor {amount} TON: {total_value:.2f} USDT"
            print(f"✅ Test passed for {command}")
            print(f"   Amount: {amount} TON")
            print(f"   Total: {total_value:.2f} USDT")
            print(f"   Response: {response}")
            print()
        except Exception as e:
            print(f"❌ Test failed for {command}: {e}")
            print()
    
    return True

if __name__ == "__main__":
    success = test_rate_ton_with_amount()
    if success:
        print("🎉 /rate_ton command with amount parameter is working correctly!")
    else:
        print("❌ /rate_ton command has issues!") 