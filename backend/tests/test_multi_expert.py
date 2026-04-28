"""
JudgyGPT Multi-Expert Feature Tests - Testing expert personas, expert selection, and personality-based chat
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestExpertsEndpoint:
    """Test /api/experts endpoint returns all 6 expert personas"""
    
    def test_get_experts_returns_6_experts(self):
        """Test /api/experts returns exactly 6 expert personas"""
        response = requests.get(f"{BASE_URL}/api/experts")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        experts = response.json()
        assert len(experts) == 6, f"Expected 6 experts, got {len(experts)}"
        
        # Verify each expert has required fields
        for expert in experts:
            assert 'name' in expert, f"Expert missing 'name' field"
            assert 'tagline' in expert, f"Expert missing 'tagline' field"
            assert 'description' in expert, f"Expert missing 'description' field"
            assert 'icon' in expert, f"Expert missing 'icon' field"
            assert 'color' in expert, f"Expert missing 'color' field"
        
        print(f"PASS: /api/experts returns {len(experts)} experts")
    
    def test_experts_have_correct_names(self):
        """Test experts have the expected names"""
        response = requests.get(f"{BASE_URL}/api/experts")
        assert response.status_code == 200
        
        experts = response.json()
        expert_names = [e['name'] for e in experts]
        
        expected_names = ["The Judgy", "LinguaBot", "PropWhiz", "CodeForge", "ViralMind", "IronCoach"]
        
        for name in expected_names:
            assert name in expert_names, f"Missing expert: {name}"
        
        print(f"PASS: All 6 expected experts found: {expert_names}")
    
    def test_experts_have_unique_colors(self):
        """Test each expert has a unique color"""
        response = requests.get(f"{BASE_URL}/api/experts")
        assert response.status_code == 200
        
        experts = response.json()
        colors = [e['color'] for e in experts]
        
        assert len(colors) == len(set(colors)), "Expert colors should be unique"
        print(f"PASS: All experts have unique colors: {colors}")


class TestAnonymousChatWithPersonality:
    """Test anonymous chat with different expert personalities"""
    
    def test_anonymous_chat_with_coder_personality(self):
        """Test /api/chat/anonymous works with coder personality"""
        session_id = f"test_coder_{uuid.uuid4()}"
        
        response = requests.post(f"{BASE_URL}/api/chat/anonymous", json={
            "session_id": session_id,
            "message": "How do I center a div?",
            "personality": "coder"
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert 'response' in data
        assert 'remaining_messages' in data
        assert len(data['response']) > 0, "Response should not be empty"
        
        print(f"PASS: Coder personality responded: {data['response'][:100]}...")
    
    def test_anonymous_chat_with_translator_personality(self):
        """Test /api/chat/anonymous works with translator personality"""
        session_id = f"test_translator_{uuid.uuid4()}"
        
        response = requests.post(f"{BASE_URL}/api/chat/anonymous", json={
            "session_id": session_id,
            "message": "How do I say hello in Japanese?",
            "personality": "translator"
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert 'response' in data
        assert len(data['response']) > 0, "Response should not be empty"
        
        print(f"PASS: Translator personality responded: {data['response'][:100]}...")
    
    def test_anonymous_chat_with_fitness_personality(self):
        """Test /api/chat/anonymous works with fitness personality"""
        session_id = f"test_fitness_{uuid.uuid4()}"
        
        response = requests.post(f"{BASE_URL}/api/chat/anonymous", json={
            "session_id": session_id,
            "message": "I want to lose 20 lbs",
            "personality": "fitness"
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert 'response' in data
        assert len(data['response']) > 0, "Response should not be empty"
        
        print(f"PASS: Fitness personality responded: {data['response'][:100]}...")
    
    def test_anonymous_chat_with_judgy_personality(self):
        """Test /api/chat/anonymous works with judgy (default) personality"""
        session_id = f"test_judgy_{uuid.uuid4()}"
        
        response = requests.post(f"{BASE_URL}/api/chat/anonymous", json={
            "session_id": session_id,
            "message": "Should I text my ex?",
            "personality": "judgy"
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert 'response' in data
        assert len(data['response']) > 0, "Response should not be empty"
        
        print(f"PASS: Judgy personality responded: {data['response'][:100]}...")
    
    def test_anonymous_chat_with_realtor_personality(self):
        """Test /api/chat/anonymous works with realtor personality"""
        session_id = f"test_realtor_{uuid.uuid4()}"
        
        response = requests.post(f"{BASE_URL}/api/chat/anonymous", json={
            "session_id": session_id,
            "message": "Is now a good time to buy a house?",
            "personality": "realtor"
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert 'response' in data
        assert len(data['response']) > 0, "Response should not be empty"
        
        print(f"PASS: Realtor personality responded: {data['response'][:100]}...")
    
    def test_anonymous_chat_with_social_personality(self):
        """Test /api/chat/anonymous works with social personality"""
        session_id = f"test_social_{uuid.uuid4()}"
        
        response = requests.post(f"{BASE_URL}/api/chat/anonymous", json={
            "session_id": session_id,
            "message": "How do I grow on TikTok?",
            "personality": "social"
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert 'response' in data
        assert len(data['response']) > 0, "Response should not be empty"
        
        print(f"PASS: Social personality responded: {data['response'][:100]}...")


class TestTokenPackages:
    """Token packages API tests"""
    
    def test_get_token_packages_returns_3(self):
        """Test /api/tokens/packages returns 3 packages"""
        response = requests.get(f"{BASE_URL}/api/tokens/packages")
        assert response.status_code == 200
        
        packages = response.json()
        assert len(packages) == 3, f"Expected 3 packages, got {len(packages)}"
        
        package_ids = [p['id'] for p in packages]
        assert 'starter' in package_ids
        assert 'growth' in package_ids
        assert 'power' in package_ids
        
        print(f"PASS: Token packages API returns {len(packages)} packages")


class TestAuthenticatedChatWithPersonality:
    """Test authenticated chat with different expert personalities"""
    
    @pytest.fixture
    def auth_user(self):
        """Create authenticated user for chat tests"""
        unique_id = uuid.uuid4().hex[:8]
        email = f"expert_test_{unique_id}@thejudgy.com"
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": "test123456",
            "name": f"Expert Test {unique_id}"
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
    
    def test_authenticated_chat_with_coder_personality(self, auth_user):
        """Test authenticated chat with coder personality deducts token"""
        initial_tokens = auth_user['user']['tokens']
        session_id = f"auth_coder_{uuid.uuid4()}"
        
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={
                "session_id": session_id,
                "message": "Explain async/await",
                "personality": "coder"
            },
            headers=auth_user['headers']
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert 'response' in data
        assert 'tokens' in data
        assert data['tokens'] == initial_tokens - 1, f"Expected {initial_tokens - 1} tokens, got {data['tokens']}"
        
        print(f"PASS: Authenticated coder chat deducted 1 token ({initial_tokens} -> {data['tokens']})")


class TestStripeCheckout:
    """Stripe checkout tests for authenticated users"""
    
    @pytest.fixture
    def auth_headers(self):
        """Get auth headers for a test user"""
        unique_id = uuid.uuid4().hex[:8]
        email = f"stripe_test_{unique_id}@thejudgy.com"
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": "test123456",
            "name": f"Stripe Test {unique_id}"
        })
        
        if response.status_code == 200:
            token = response.json()['access_token']
        else:
            pytest.skip("Could not create test user for checkout test")
        
        return {"Authorization": f"Bearer {token}"}
    
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
        
        print(f"PASS: Token checkout creates Stripe URL")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
