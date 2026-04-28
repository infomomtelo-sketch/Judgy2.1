"""
Admin Dashboard API Tests
Tests for /api/admin/* endpoints - stats, expert-usage, recent-signups, recent-transactions, daily-signups
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "hello@thejudgy.com"
ADMIN_PASSWORD = "admin123456"
REGULAR_EMAIL = "test@thejudgy.com"
REGULAR_PASSWORD = "test123456"


class TestAdminAuthentication:
    """Test admin authentication and authorization"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin user token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Admin login failed")
    
    @pytest.fixture(scope="class")
    def regular_token(self):
        """Get regular user token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": REGULAR_EMAIL,
            "password": REGULAR_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Regular user login failed")
    
    def test_admin_stats_requires_auth(self):
        """Admin stats endpoint returns 401 without authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 401
        assert "Authentication required" in response.json().get("detail", "")
    
    def test_admin_stats_requires_admin_role(self, regular_token):
        """Admin stats endpoint returns 403 for non-admin users"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {regular_token}"}
        )
        assert response.status_code == 403
        assert "Admin access required" in response.json().get("detail", "")
    
    def test_admin_expert_usage_requires_auth(self):
        """Expert usage endpoint returns 401 without authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/expert-usage")
        assert response.status_code == 401
    
    def test_admin_expert_usage_requires_admin_role(self, regular_token):
        """Expert usage endpoint returns 403 for non-admin users"""
        response = requests.get(
            f"{BASE_URL}/api/admin/expert-usage",
            headers={"Authorization": f"Bearer {regular_token}"}
        )
        assert response.status_code == 403
    
    def test_admin_recent_signups_requires_auth(self):
        """Recent signups endpoint returns 401 without authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/recent-signups")
        assert response.status_code == 401
    
    def test_admin_recent_signups_requires_admin_role(self, regular_token):
        """Recent signups endpoint returns 403 for non-admin users"""
        response = requests.get(
            f"{BASE_URL}/api/admin/recent-signups",
            headers={"Authorization": f"Bearer {regular_token}"}
        )
        assert response.status_code == 403
    
    def test_admin_recent_transactions_requires_auth(self):
        """Recent transactions endpoint returns 401 without authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/recent-transactions")
        assert response.status_code == 401
    
    def test_admin_recent_transactions_requires_admin_role(self, regular_token):
        """Recent transactions endpoint returns 403 for non-admin users"""
        response = requests.get(
            f"{BASE_URL}/api/admin/recent-transactions",
            headers={"Authorization": f"Bearer {regular_token}"}
        )
        assert response.status_code == 403
    
    def test_admin_daily_signups_requires_auth(self):
        """Daily signups endpoint returns 401 without authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/daily-signups")
        assert response.status_code == 401
    
    def test_admin_daily_signups_requires_admin_role(self, regular_token):
        """Daily signups endpoint returns 403 for non-admin users"""
        response = requests.get(
            f"{BASE_URL}/api/admin/daily-signups",
            headers={"Authorization": f"Bearer {regular_token}"}
        )
        assert response.status_code == 403


class TestAdminStats:
    """Test /api/admin/stats endpoint"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin user token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Admin login failed")
    
    def test_admin_stats_returns_user_counts(self, admin_token):
        """Admin stats returns user count data"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify users section exists with required fields
        assert "users" in data
        assert "total" in data["users"]
        assert "today" in data["users"]
        assert "this_week" in data["users"]
        assert "this_month" in data["users"]
        
        # Verify values are integers
        assert isinstance(data["users"]["total"], int)
        assert isinstance(data["users"]["today"], int)
        assert data["users"]["total"] >= 0
    
    def test_admin_stats_returns_revenue_data(self, admin_token):
        """Admin stats returns revenue data"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify revenue section exists
        assert "revenue" in data
        assert "total" in data["revenue"]
        assert "this_month" in data["revenue"]
        assert "transactions" in data["revenue"]
        
        # Verify values are numeric
        assert isinstance(data["revenue"]["total"], (int, float))
        assert isinstance(data["revenue"]["transactions"], int)
    
    def test_admin_stats_returns_token_data(self, admin_token):
        """Admin stats returns token data"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify tokens section exists
        assert "tokens" in data
        assert "total_held" in data["tokens"]
        assert isinstance(data["tokens"]["total_held"], int)
    
    def test_admin_stats_returns_engagement_data(self, admin_token):
        """Admin stats returns engagement data"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify engagement section exists
        assert "engagement" in data
        assert "total_messages" in data["engagement"]
        assert "anonymous_sessions" in data["engagement"]
        assert isinstance(data["engagement"]["total_messages"], int)


class TestAdminExpertUsage:
    """Test /api/admin/expert-usage endpoint"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin user token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Admin login failed")
    
    def test_expert_usage_returns_breakdown(self, admin_token):
        """Expert usage returns usage breakdown by expert"""
        response = requests.get(
            f"{BASE_URL}/api/admin/expert-usage",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify expert_usage key exists
        assert "expert_usage" in data
        assert isinstance(data["expert_usage"], dict)
        
        # If there's usage data, verify values are integers
        for expert, count in data["expert_usage"].items():
            assert isinstance(count, int)
            assert count >= 0


class TestAdminRecentSignups:
    """Test /api/admin/recent-signups endpoint"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin user token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Admin login failed")
    
    def test_recent_signups_returns_list(self, admin_token):
        """Recent signups returns list of users"""
        response = requests.get(
            f"{BASE_URL}/api/admin/recent-signups?limit=10",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response is a list
        assert isinstance(data, list)
    
    def test_recent_signups_excludes_password_hash(self, admin_token):
        """Recent signups does NOT include password_hash field"""
        response = requests.get(
            f"{BASE_URL}/api/admin/recent-signups?limit=10",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify no user has password_hash
        for user in data:
            assert "password_hash" not in user
            assert "password" not in user
    
    def test_recent_signups_has_required_fields(self, admin_token):
        """Recent signups includes required user fields"""
        response = requests.get(
            f"{BASE_URL}/api/admin/recent-signups?limit=5",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            user = data[0]
            # Verify required fields
            assert "id" in user
            assert "email" in user
            assert "name" in user
            assert "tokens" in user
            assert "created_at" in user
    
    def test_recent_signups_respects_limit(self, admin_token):
        """Recent signups respects limit parameter"""
        response = requests.get(
            f"{BASE_URL}/api/admin/recent-signups?limit=3",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify limit is respected
        assert len(data) <= 3


class TestAdminRecentTransactions:
    """Test /api/admin/recent-transactions endpoint"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin user token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Admin login failed")
    
    def test_recent_transactions_returns_list(self, admin_token):
        """Recent transactions returns list of transactions"""
        response = requests.get(
            f"{BASE_URL}/api/admin/recent-transactions?limit=10",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response is a list
        assert isinstance(data, list)
    
    def test_recent_transactions_has_required_fields(self, admin_token):
        """Recent transactions includes required fields"""
        response = requests.get(
            f"{BASE_URL}/api/admin/recent-transactions?limit=5",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            txn = data[0]
            # Verify required fields
            assert "id" in txn
            assert "user_email" in txn
            assert "amount" in txn
            assert "currency" in txn
            assert "status" in txn
            assert "payment_status" in txn
            assert "created_at" in txn
    
    def test_recent_transactions_respects_limit(self, admin_token):
        """Recent transactions respects limit parameter"""
        response = requests.get(
            f"{BASE_URL}/api/admin/recent-transactions?limit=3",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify limit is respected
        assert len(data) <= 3


class TestAdminDailySignups:
    """Test /api/admin/daily-signups endpoint"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin user token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Admin login failed")
    
    def test_daily_signups_returns_list(self, admin_token):
        """Daily signups returns list of daily data"""
        response = requests.get(
            f"{BASE_URL}/api/admin/daily-signups?days=14",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response is a list
        assert isinstance(data, list)
    
    def test_daily_signups_has_required_fields(self, admin_token):
        """Daily signups includes date and signups fields"""
        response = requests.get(
            f"{BASE_URL}/api/admin/daily-signups?days=14",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            day = data[0]
            # Verify required fields
            assert "date" in day
            assert "signups" in day
            assert isinstance(day["signups"], int)
    
    def test_daily_signups_returns_correct_days(self, admin_token):
        """Daily signups returns correct number of days"""
        response = requests.get(
            f"{BASE_URL}/api/admin/daily-signups?days=14",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify 14 days of data
        assert len(data) == 14
    
    def test_daily_signups_default_days(self, admin_token):
        """Daily signups uses default days parameter"""
        response = requests.get(
            f"{BASE_URL}/api/admin/daily-signups",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Default is 30 days
        assert len(data) == 30


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
