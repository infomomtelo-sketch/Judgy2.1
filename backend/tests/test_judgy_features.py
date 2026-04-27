"""
JudgyGPT Feature Tests - Testing theme, anonymous chat, token packages, and Stripe checkout
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndBasics:
    """Basic API health checks"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"PASS: API root returns: {data}")

class TestTokenPackages:
    """Token packages API tests"""
    
    def test_get_token_packages(self):
        """Test /api/tokens/packages returns 3 packages"""
        response = requests.get(f"{BASE_URL}/api/tokens/packages")
        assert response.status_code == 200
        packages = response.json()
        
        # Should return 3 packages
        assert len(packages) == 3, f"Expected 3 packages, got {len(packages)}"
        
        # Verify package IDs
        package_ids = [p['id'] for p in packages]
        assert 'starter' in package_ids, "Missing starter package"
        assert 'growth' in package_ids, "Missing growth package"
        assert 'power' in package_ids, "Missing power package"
        
        # Verify each package has required fields
        for pkg in packages:
            assert 'id' in pkg
            assert 'name' in pkg
            assert 'tokens' in pkg
            assert 'price' in pkg
            assert 'price_display' in pkg
            print(f"PASS: Package {pkg['id']}: {pkg['tokens']} tokens for {pkg['price_display']}")
        
        print(f"PASS: Token packages API returns {len(packages)} packages")

class TestAnonymousChat:
    """Anonymous chat endpoint tests"""
    
    def test_anonymous_chat_success(self):
        """Test /api/chat/anonymous works for unauthenticated users"""
        session_id = f"test_anon_{uuid.uuid4()}"
        
        response = requests.post(f"{BASE_URL}/api/chat/anonymous", json={
            "session_id": session_id,
            "message": "Hello, test message"
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert 'session_id' in data
        assert 'response' in data
        assert 'message_id' in data
        assert 'remaining_messages' in data
        assert 'requires_signup' in data
        
        # First message should have 4 remaining (5 - 1 = 4)
        assert data['remaining_messages'] == 4, f"Expected 4 remaining, got {data['remaining_messages']}"
        assert data['requires_signup'] == False
        
        print(f"PASS: Anonymous chat works, remaining: {data['remaining_messages']}")
    
    def test_anonymous_chat_limit(self):
        """Test anonymous chat enforces 5 message limit"""
        session_id = f"test_limit_{uuid.uuid4()}"
        
        # Send 5 messages to hit the limit
        for i in range(5):
            response = requests.post(f"{BASE_URL}/api/chat/anonymous", json={
                "session_id": session_id,
                "message": f"Test message {i+1}"
            })
            assert response.status_code == 200
            data = response.json()
            expected_remaining = 4 - i
            if expected_remaining < 0:
                expected_remaining = 0
            print(f"Message {i+1}: remaining={data['remaining_messages']}")
        
        # 6th message should trigger signup prompt
        response = requests.post(f"{BASE_URL}/api/chat/anonymous", json={
            "session_id": session_id,
            "message": "6th message - should require signup"
        })
        assert response.status_code == 200
        data = response.json()
        assert data['requires_signup'] == True, "Expected requires_signup=True after 5 messages"
        assert data['remaining_messages'] == 0
        
        print("PASS: Anonymous chat enforces 5 message limit")

class TestAuthAndTokens:
    """Authentication and token balance tests"""
    
    @pytest.fixture
    def test_user(self):
        """Create a test user and return credentials"""
        unique_id = uuid.uuid4().hex[:8]
        email = f"test_{unique_id}@thejudgy.com"
        password = "test123456"
        name = f"Test User {unique_id}"
        
        # Register user
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": password,
            "name": name
        })
        
        if response.status_code == 200:
            data = response.json()
            return {
                "email": email,
                "password": password,
                "token": data['access_token'],
                "user": data['user']
            }
        elif response.status_code == 400 and "already registered" in response.text:
            # User exists, try login
            response = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": email,
                "password": password
            })
            data = response.json()
            return {
                "email": email,
                "password": password,
                "token": data['access_token'],
                "user": data['user']
            }
        else:
            pytest.fail(f"Failed to create test user: {response.text}")
    
    def test_login_existing_user(self):
        """Test login with existing test user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test@thejudgy.com",
            "password": "test123456"
        })
        
        # User may or may not exist
        if response.status_code == 200:
            data = response.json()
            assert 'access_token' in data
            assert 'user' in data
            assert 'tokens' in data['user']
            print(f"PASS: Login successful, tokens: {data['user']['tokens']}")
        elif response.status_code == 401:
            print("INFO: Test user doesn't exist, skipping login test")
        else:
            pytest.fail(f"Unexpected response: {response.status_code}")
    
    def test_token_balance_requires_auth(self):
        """Test /api/tokens/balance requires authentication"""
        response = requests.get(f"{BASE_URL}/api/tokens/balance")
        assert response.status_code == 403 or response.status_code == 401, \
            f"Expected 401/403 without auth, got {response.status_code}"
        print("PASS: Token balance endpoint requires authentication")
    
    def test_token_balance_with_auth(self, test_user):
        """Test /api/tokens/balance returns token count for authenticated user"""
        headers = {"Authorization": f"Bearer {test_user['token']}"}
        response = requests.get(f"{BASE_URL}/api/tokens/balance", headers=headers)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert 'tokens' in data
        assert 'user_id' in data
        assert isinstance(data['tokens'], int)
        
        print(f"PASS: Token balance for user: {data['tokens']} tokens")
    
    def test_new_user_gets_50_tokens(self, test_user):
        """Test new users get 50 free tokens on signup"""
        # New user should have 50 tokens
        assert test_user['user']['tokens'] == 50, \
            f"Expected 50 tokens for new user, got {test_user['user']['tokens']}"
        print("PASS: New user received 50 free tokens")

class TestTokenCheckout:
    """Token checkout/Stripe integration tests"""
    
    @pytest.fixture
    def auth_headers(self):
        """Get auth headers for a test user"""
        unique_id = uuid.uuid4().hex[:8]
        email = f"checkout_test_{unique_id}@thejudgy.com"
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": "test123456",
            "name": f"Checkout Test {unique_id}"
        })
        
        if response.status_code == 200:
            token = response.json()['access_token']
        else:
            pytest.skip("Could not create test user for checkout test")
        
        return {"Authorization": f"Bearer {token}"}
    
    def test_token_checkout_requires_auth(self):
        """Test /api/tokens/checkout requires authentication"""
        response = requests.post(f"{BASE_URL}/api/tokens/checkout", json={
            "package_id": "starter",
            "origin_url": "https://example.com"
        })
        assert response.status_code in [401, 403], \
            f"Expected 401/403 without auth, got {response.status_code}"
        print("PASS: Token checkout requires authentication")
    
    def test_token_checkout_creates_stripe_url(self, auth_headers):
        """Test /api/tokens/checkout creates valid Stripe checkout URL"""
        response = requests.post(
            f"{BASE_URL}/api/tokens/checkout",
            json={
                "package_id": "starter",
                "origin_url": "https://sassy-ai-3.preview.emergentagent.com"
            },
            headers=auth_headers
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert 'url' in data, "Response should contain checkout URL"
        assert 'session_id' in data, "Response should contain session_id"
        assert 'checkout.stripe.com' in data['url'], "URL should be a Stripe checkout URL"
        
        print(f"PASS: Token checkout creates Stripe URL: {data['url'][:50]}...")
    
    def test_token_checkout_invalid_package(self, auth_headers):
        """Test /api/tokens/checkout rejects invalid package"""
        response = requests.post(
            f"{BASE_URL}/api/tokens/checkout",
            json={
                "package_id": "invalid_package",
                "origin_url": "https://example.com"
            },
            headers=auth_headers
        )
        
        assert response.status_code == 400, f"Expected 400 for invalid package, got {response.status_code}"
        print("PASS: Token checkout rejects invalid package")

class TestSubscriptionPlans:
    """Subscription plans API tests"""
    
    def test_get_subscription_plans(self):
        """Test /api/subscriptions/plans returns plans"""
        response = requests.get(f"{BASE_URL}/api/subscriptions/plans")
        assert response.status_code == 200
        plans = response.json()
        
        assert len(plans) >= 3, f"Expected at least 3 plans, got {len(plans)}"
        
        plan_ids = [p['id'] for p in plans]
        assert 'free' in plan_ids, "Missing free plan"
        assert 'standard' in plan_ids, "Missing standard plan"
        assert 'premium' in plan_ids, "Missing premium plan"
        
        print(f"PASS: Subscription plans API returns {len(plans)} plans")

class TestAuthenticatedChat:
    """Authenticated chat tests"""
    
    @pytest.fixture
    def auth_user(self):
        """Create authenticated user for chat tests"""
        unique_id = uuid.uuid4().hex[:8]
        email = f"chat_test_{unique_id}@thejudgy.com"
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": "test123456",
            "name": f"Chat Test {unique_id}"
        })
        
        if response.status_code == 200:
            data = response.json()
            return {
                "token": data['access_token'],
                "user": data['user'],
                "headers": {"Authorization": f"Bearer {data['access_token']}"}
            }
        else:
            pytest.skip("Could not create test user for chat test")
    
    def test_authenticated_chat_deducts_token(self, auth_user):
        """Test authenticated chat deducts 1 token per message"""
        initial_tokens = auth_user['user']['tokens']
        session_id = f"auth_chat_{uuid.uuid4()}"
        
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={
                "session_id": session_id,
                "message": "Test authenticated message"
            },
            headers=auth_user['headers']
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert 'tokens' in data, "Response should include token balance"
        assert data['tokens'] == initial_tokens - 1, \
            f"Expected {initial_tokens - 1} tokens after message, got {data['tokens']}"
        
        print(f"PASS: Authenticated chat deducted 1 token ({initial_tokens} -> {data['tokens']})")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
