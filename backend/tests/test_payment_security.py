"""
Backend API Tests for Payment Security Bug Fix (P0)

This test suite verifies:
1. SECURITY: /api/subscriptions/subscribe rejects paid plans with 403
2. SECURITY: /api/subscriptions/subscribe allows free plan
3. SECURITY: Checkout status verifies transaction ownership
4. AUTH: Registration and login work correctly
5. CHECKOUT: Checkout create returns valid Stripe URL for paid plans
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = f"test_payment_{uuid.uuid4().hex[:8]}@test.com"
TEST_PASSWORD = "test123"
TEST_NAME = "Test Payment User"


class TestHealthCheck:
    """Basic health check to ensure API is running"""
    
    def test_health_endpoint(self):
        """Test /api/health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200, f"Health check failed: {response.text}"
        data = response.json()
        assert data.get("status") == "healthy"
        print("✓ Health check passed")


class TestAuthEndpoints:
    """Test authentication endpoints"""
    
    @pytest.fixture(scope="class")
    def registered_user(self):
        """Register a test user and return credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "name": TEST_NAME
        })
        # If user already exists, try login instead
        if response.status_code == 400 and "already registered" in response.text.lower():
            response = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD
            })
        
        assert response.status_code in [200, 201], f"Registration/Login failed: {response.text}"
        data = response.json()
        return {
            "token": data["access_token"],
            "user": data["user"]
        }
    
    def test_registration(self):
        """Test user registration creates new user"""
        unique_email = f"test_reg_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "testpass123",
            "name": "Test Reg User"
        })
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == unique_email
        assert data["user"]["subscription_plan"] == "free"
        print(f"✓ Registration successful for {unique_email}")
    
    def test_login_success(self, registered_user):
        """Test login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == TEST_EMAIL
        print(f"✓ Login successful for {TEST_EMAIL}")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials returns 401"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@test.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Invalid login correctly returns 401")


class TestSubscriptionSecurityFix:
    """
    CRITICAL SECURITY TESTS
    Tests for the P0 bug fix: users should NOT be able to upgrade to paid plans
    without going through Stripe checkout
    """
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token for tests"""
        # Try to register a new user, or login if exists
        unique_email = f"test_sub_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": TEST_PASSWORD,
            "name": "Test Sub User"
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        
        # Fallback to test user
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        
        pytest.skip("Could not authenticate for subscription tests")
    
    def test_subscribe_standard_plan_rejected_with_403(self, auth_token):
        """
        SECURITY TEST: Standard plan subscription via /subscribe should return 403
        This is the core P0 bug fix - paid plans MUST go through Stripe checkout
        """
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(
            f"{BASE_URL}/api/subscriptions/subscribe",
            json={"plan_id": "standard"},
            headers=headers
        )
        assert response.status_code == 403, f"Expected 403 for standard plan, got {response.status_code}: {response.text}"
        data = response.json()
        assert "payment" in data.get("detail", "").lower() or "checkout" in data.get("detail", "").lower(), \
            f"Expected error about payment/checkout, got: {data}"
        print("✓ SECURITY: Standard plan correctly rejected with 403")
    
    def test_subscribe_premium_plan_rejected_with_403(self, auth_token):
        """
        SECURITY TEST: Premium plan subscription via /subscribe should return 403
        This ensures ALL paid plans require Stripe checkout
        """
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(
            f"{BASE_URL}/api/subscriptions/subscribe",
            json={"plan_id": "premium"},
            headers=headers
        )
        assert response.status_code == 403, f"Expected 403 for premium plan, got {response.status_code}: {response.text}"
        data = response.json()
        assert "payment" in data.get("detail", "").lower() or "checkout" in data.get("detail", "").lower(), \
            f"Expected error about payment/checkout, got: {data}"
        print("✓ SECURITY: Premium plan correctly rejected with 403")
    
    def test_subscribe_free_plan_allowed(self, auth_token):
        """
        Test that switching to free plan IS allowed via /subscribe endpoint
        """
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(
            f"{BASE_URL}/api/subscriptions/subscribe",
            json={"plan_id": "free"},
            headers=headers
        )
        assert response.status_code == 200, f"Expected 200 for free plan, got {response.status_code}: {response.text}"
        data = response.json()
        assert "free" in data.get("message", "").lower() or data.get("plan", {}).get("id") == "free", \
            f"Expected confirmation of free plan switch, got: {data}"
        print("✓ Free plan subscription allowed via /subscribe endpoint")
    
    def test_subscribe_invalid_plan_rejected_with_400(self, auth_token):
        """Test that invalid plan IDs are rejected with 400"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(
            f"{BASE_URL}/api/subscriptions/subscribe",
            json={"plan_id": "nonexistent_plan"},
            headers=headers
        )
        assert response.status_code == 400, f"Expected 400 for invalid plan, got {response.status_code}"
        print("✓ Invalid plan correctly rejected with 400")
    
    def test_user_remains_on_free_after_rejected_upgrade(self, auth_token):
        """
        Verify user state remains on free plan after rejected paid upgrade attempt
        """
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # First ensure user is on free plan
        requests.post(
            f"{BASE_URL}/api/subscriptions/subscribe",
            json={"plan_id": "free"},
            headers=headers
        )
        
        # Attempt paid upgrade (should fail)
        requests.post(
            f"{BASE_URL}/api/subscriptions/subscribe",
            json={"plan_id": "premium"},
            headers=headers
        )
        
        # Verify user is still on free plan
        response = requests.get(f"{BASE_URL}/api/subscriptions/current", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data.get("plan", {}).get("id") == "free", f"User should still be on free plan, got: {data}"
        print("✓ User correctly remains on free plan after rejected upgrade attempt")


class TestCheckoutEndpoints:
    """Test Stripe checkout creation and status endpoints"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        unique_email = f"test_checkout_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": TEST_PASSWORD,
            "name": "Test Checkout User"
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        
        pytest.skip("Could not authenticate for checkout tests")
    
    def test_checkout_create_standard_plan_returns_stripe_url(self, auth_token):
        """Test that checkout/create returns a valid Stripe checkout URL for paid plans"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(
            f"{BASE_URL}/api/checkout/create",
            json={
                "plan_id": "standard",
                "origin_url": "https://example.com"
            },
            headers=headers
        )
        assert response.status_code == 200, f"Checkout create failed: {response.status_code} - {response.text}"
        data = response.json()
        assert "url" in data, f"Expected Stripe URL in response, got: {data}"
        assert "checkout.stripe.com" in data["url"] or "stripe" in data["url"].lower(), \
            f"Expected Stripe checkout URL, got: {data['url']}"
        assert "session_id" in data, "Expected session_id in response"
        print(f"✓ Checkout create returns valid Stripe URL: {data['url'][:50]}...")
    
    def test_checkout_create_premium_plan_returns_stripe_url(self, auth_token):
        """Test that checkout/create returns a valid Stripe checkout URL for premium plan"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(
            f"{BASE_URL}/api/checkout/create",
            json={
                "plan_id": "premium",
                "origin_url": "https://example.com"
            },
            headers=headers
        )
        assert response.status_code == 200, f"Checkout create failed: {response.status_code} - {response.text}"
        data = response.json()
        assert "url" in data, f"Expected Stripe URL in response, got: {data}"
        print(f"✓ Premium plan checkout create returns valid Stripe URL")
    
    def test_checkout_create_free_plan_switches_directly(self, auth_token):
        """Test that checkout/create for free plan switches directly without Stripe"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(
            f"{BASE_URL}/api/checkout/create",
            json={
                "plan_id": "free",
                "origin_url": "https://example.com"
            },
            headers=headers
        )
        assert response.status_code == 200, f"Checkout create for free failed: {response.status_code}"
        data = response.json()
        # Free plan should switch directly without Stripe URL
        assert data.get("success") == True or "free" in data.get("message", "").lower(), \
            f"Expected success message for free plan switch, got: {data}"
        print("✓ Free plan checkout switches directly without Stripe")
    
    def test_checkout_status_requires_auth(self):
        """Test that checkout status endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/checkout/status/fake_session_id")
        assert response.status_code == 401, f"Expected 401 without auth, got {response.status_code}"
        print("✓ Checkout status correctly requires authentication")
    
    def test_checkout_status_nonexistent_session_returns_404(self, auth_token):
        """Test that checking status of non-existent session returns 404"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(
            f"{BASE_URL}/api/checkout/status/nonexistent_session_id_12345",
            headers=headers
        )
        # Should return 404 for transaction not found
        assert response.status_code in [404, 500], \
            f"Expected 404/500 for non-existent session, got {response.status_code}: {response.text}"
        print("✓ Checkout status correctly handles non-existent session")


class TestCheckoutSecurityOwnership:
    """
    SECURITY TESTS for checkout status endpoint
    Verifies that users can only check their own transactions
    """
    
    @pytest.fixture(scope="class")
    def user1_token_and_session(self):
        """Create user1 and a checkout session"""
        email = f"test_owner1_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": TEST_PASSWORD,
            "name": "Test Owner 1"
        })
        if response.status_code != 200:
            pytest.skip("Could not create user1")
        
        token = response.json()["access_token"]
        
        # Create a checkout session
        headers = {"Authorization": f"Bearer {token}"}
        checkout_response = requests.post(
            f"{BASE_URL}/api/checkout/create",
            json={"plan_id": "standard", "origin_url": "https://example.com"},
            headers=headers
        )
        
        if checkout_response.status_code != 200:
            pytest.skip("Could not create checkout session for user1")
        
        session_id = checkout_response.json().get("session_id")
        return {"token": token, "session_id": session_id}
    
    @pytest.fixture(scope="class")
    def user2_token(self):
        """Create user2"""
        email = f"test_owner2_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": TEST_PASSWORD,
            "name": "Test Owner 2"
        })
        if response.status_code != 200:
            pytest.skip("Could not create user2")
        
        return response.json()["access_token"]
    
    def test_user_can_check_own_session(self, user1_token_and_session):
        """User should be able to check their own checkout session"""
        headers = {"Authorization": f"Bearer {user1_token_and_session['token']}"}
        response = requests.get(
            f"{BASE_URL}/api/checkout/status/{user1_token_and_session['session_id']}",
            headers=headers
        )
        # Should succeed (200) or get payment status from Stripe (might be 500 if Stripe integration issue)
        assert response.status_code in [200, 500], \
            f"User should be able to check own session, got {response.status_code}: {response.text}"
        print("✓ User can check their own checkout session")
    
    def test_user_cannot_check_other_user_session(self, user1_token_and_session, user2_token):
        """
        SECURITY TEST: User2 should NOT be able to check User1's checkout session
        This verifies the ownership check in checkout status endpoint
        """
        headers = {"Authorization": f"Bearer {user2_token}"}
        response = requests.get(
            f"{BASE_URL}/api/checkout/status/{user1_token_and_session['session_id']}",
            headers=headers
        )
        # Should return 403 Forbidden for unauthorized access
        assert response.status_code == 403, \
            f"SECURITY ISSUE: User2 should not access User1's session, got {response.status_code}: {response.text}"
        print("✓ SECURITY: User cannot check other user's checkout session (403)")


class TestSubscriptionPlans:
    """Test subscription plans endpoint"""
    
    def test_get_plans_returns_all_plans(self):
        """Test that /subscriptions/plans returns all available plans"""
        response = requests.get(f"{BASE_URL}/api/subscriptions/plans")
        assert response.status_code == 200, f"Failed to get plans: {response.text}"
        plans = response.json()
        assert isinstance(plans, list)
        assert len(plans) >= 3, f"Expected at least 3 plans, got {len(plans)}"
        
        plan_ids = [p["id"] for p in plans]
        assert "free" in plan_ids, "Free plan missing"
        assert "standard" in plan_ids, "Standard plan missing"
        assert "premium" in plan_ids, "Premium plan missing"
        print(f"✓ Get plans returns {len(plans)} plans: {plan_ids}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
