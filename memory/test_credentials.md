# Test Credentials

## Admin Account
- Email: hello@thejudgy.com
- Password: admin123456
- Access: Full admin dashboard at /admin

## Test User Account
- Email: test@thejudgy.com
- Password: test123456
- Tokens: 50 (default on signup)

## API Base URL
- Preview: https://sassy-ai-3.preview.emergentagent.com
- Production: https://thejudgy.com

## Auth Notes
- Google OAuth redirects via https://auth.emergentagent.com
- JWT tokens stored in localStorage as 'auth_token'
- Admin access gated by ADMIN_EMAIL env variable (hello@thejudgy.com)
