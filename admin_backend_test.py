#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class AdminPanelAPITester:
    def __init__(self, base_url="https://web-templates-pro.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None, auth_required=True):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.passed_tests.append(name)
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200] if response.text else "No response"
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")

            return success, response.json() if success and response.text else {}

        except requests.exceptions.Timeout:
            self.failed_tests.append({
                "test": name,
                "expected": expected_status,
                "actual": "TIMEOUT",
                "response": "Request timed out after 10 seconds"
            })
            print(f"❌ Failed - Request timed out")
            return False, {}
        except Exception as e:
            self.failed_tests.append({
                "test": name,
                "expected": expected_status,
                "actual": "ERROR",
                "response": str(e)
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_init_admin(self):
        """Test admin initialization (may fail if admin already exists)"""
        success, response = self.run_test("Initialize Admin", "POST", "api/auth/init-admin", 200, auth_required=False)
        if not success:
            # Admin might already exist, which is fine
            print("   Note: Admin initialization failed - admin might already exist")
        return True

    def test_admin_login(self):
        """Test admin login and get token"""
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        success, response = self.run_test("Admin Login", "POST", "api/auth/login", 200, data=login_data, auth_required=False)
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   ✅ Token obtained: {self.token[:20]}...")
            return True
        else:
            print("   ❌ Failed to get authentication token")
            return False

    def test_admin_stats(self):
        """Test admin dashboard stats"""
        return self.run_test("Admin Stats", "GET", "api/admin/stats", 200)

    def test_admin_contacts(self):
        """Test admin contacts management"""
        return self.run_test("Admin Contacts", "GET", "api/admin/contacts", 200)

    def test_admin_orders(self):
        """Test admin orders management"""
        return self.run_test("Admin Orders", "GET", "api/admin/orders", 200)

    def test_admin_users(self):
        """Test admin users management (admin only)"""
        return self.run_test("Admin Users", "GET", "api/admin/users", 200)

    def test_templates_crud(self):
        """Test templates CRUD operations"""
        # First get existing templates
        success, templates = self.run_test("Get Templates (Admin)", "GET", "api/templates", 200, auth_required=False)
        
        # Create new template
        template_data = {
            "slug": "test-template-admin",
            "name": "Test Template Admin",
            "category": "business",
            "price": 500000,
            "description_id": "Template test untuk admin panel",
            "description_en": "Test template for admin panel",
            "features": ["Responsive", "SEO Optimized"],
            "technologies": ["HTML", "CSS", "JavaScript"],
            "demo_url": "https://demo.test.com",
            "image": "https://via.placeholder.com/400x300",
            "is_featured": True
        }
        
        create_success, create_response = self.run_test("Create Template", "POST", "api/admin/templates", 200, data=template_data)
        
        if create_success and 'id' in create_response:
            template_id = create_response['id']
            
            # Update template
            template_data['name'] = "Updated Test Template"
            update_success = self.run_test("Update Template", "PUT", f"api/admin/templates/{template_id}", 200, data=template_data)
            
            # Delete template
            delete_success = self.run_test("Delete Template", "DELETE", f"api/admin/templates/{template_id}", 200)
            
            return create_success and update_success[0] and delete_success[0]
        
        return create_success

    def test_portfolio_crud(self):
        """Test portfolio CRUD operations"""
        portfolio_data = {
            "title": "Test Portfolio Admin",
            "client": "Test Client",
            "category": "company-profile",
            "description_id": "Portfolio test untuk admin panel",
            "description_en": "Test portfolio for admin panel",
            "image": "https://via.placeholder.com/400x300",
            "url": "https://test-portfolio.com",
            "technologies": ["React", "Node.js"],
            "year": 2024,
            "is_featured": True
        }
        
        create_success, create_response = self.run_test("Create Portfolio", "POST", "api/admin/portfolio", 200, data=portfolio_data)
        
        if create_success and 'id' in create_response:
            portfolio_id = create_response['id']
            
            # Update portfolio
            portfolio_data['title'] = "Updated Test Portfolio"
            update_success = self.run_test("Update Portfolio", "PUT", f"api/admin/portfolio/{portfolio_id}", 200, data=portfolio_data)
            
            # Delete portfolio
            delete_success = self.run_test("Delete Portfolio", "DELETE", f"api/admin/portfolio/{portfolio_id}", 200)
            
            return create_success and update_success[0] and delete_success[0]
        
        return create_success

    def test_blog_crud(self):
        """Test blog CRUD operations"""
        blog_data = {
            "slug": "test-blog-admin",
            "title_id": "Blog Test Admin",
            "title_en": "Test Blog Admin",
            "excerpt_id": "Excerpt test untuk admin panel",
            "excerpt_en": "Test excerpt for admin panel",
            "content_id": "Konten blog test untuk admin panel",
            "content_en": "Test blog content for admin panel",
            "image": "https://via.placeholder.com/400x300",
            "author": "Admin Test",
            "category": "tips",
            "tags": ["test", "admin"],
            "read_time": 5
        }
        
        create_success, create_response = self.run_test("Create Blog", "POST", "api/admin/blog", 200, data=blog_data)
        
        if create_success and 'id' in create_response:
            blog_id = create_response['id']
            
            # Update blog
            blog_data['title_id'] = "Updated Blog Test Admin"
            update_success = self.run_test("Update Blog", "PUT", f"api/admin/blog/{blog_id}", 200, data=blog_data)
            
            # Delete blog
            delete_success = self.run_test("Delete Blog", "DELETE", f"api/admin/blog/{blog_id}", 200)
            
            return create_success and update_success[0] and delete_success[0]
        
        return create_success

    def test_testimonials_crud(self):
        """Test testimonials CRUD operations"""
        testimonial_data = {
            "name": "Test User Admin",
            "role": "CEO",
            "company": "Test Company",
            "content_id": "Testimonial test untuk admin panel",
            "content_en": "Test testimonial for admin panel",
            "avatar": "https://via.placeholder.com/100x100",
            "rating": 5
        }
        
        create_success, create_response = self.run_test("Create Testimonial", "POST", "api/admin/testimonials", 200, data=testimonial_data)
        
        if create_success and 'id' in create_response:
            testimonial_id = create_response['id']
            
            # Update testimonial
            testimonial_data['name'] = "Updated Test User Admin"
            update_success = self.run_test("Update Testimonial", "PUT", f"api/admin/testimonials/{testimonial_id}", 200, data=testimonial_data)
            
            # Delete testimonial
            delete_success = self.run_test("Delete Testimonial", "DELETE", f"api/admin/testimonials/{testimonial_id}", 200)
            
            return create_success and update_success[0] and delete_success[0]
        
        return create_success

    def test_pricing_crud(self):
        """Test pricing CRUD operations (admin only)"""
        pricing_data = {
            "name_id": "Test Package",
            "name_en": "Test Package",
            "description_id": "Paket test untuk admin panel",
            "description_en": "Test package for admin panel",
            "price": 1000000,
            "price_note_id": "Pembayaran sekali",
            "price_note_en": "One-time payment",
            "features": [
                {"text_id": "Feature 1", "text_en": "Feature 1", "included": True},
                {"text_id": "Feature 2", "text_en": "Feature 2", "included": False}
            ],
            "is_popular": False,
            "order": 99
        }
        
        create_success, create_response = self.run_test("Create Pricing", "POST", "api/admin/pricing", 200, data=pricing_data)
        
        if create_success and 'id' in create_response:
            pricing_id = create_response['id']
            
            # Update pricing
            pricing_data['name_id'] = "Updated Test Package"
            update_success = self.run_test("Update Pricing", "PUT", f"api/admin/pricing/{pricing_id}", 200, data=pricing_data)
            
            # Delete pricing
            delete_success = self.run_test("Delete Pricing", "DELETE", f"api/admin/pricing/{pricing_id}", 200)
            
            return create_success and update_success[0] and delete_success[0]
        
        return create_success

    def test_auth_me(self):
        """Test get current user info"""
        return self.run_test("Get Current User", "GET", "api/auth/me", 200)

def main():
    print("🚀 Starting Admin Panel API Testing...")
    print("=" * 60)
    
    tester = AdminPanelAPITester()
    
    # Initialize admin first (may fail if already exists)
    tester.test_init_admin()
    
    # Login is critical - if this fails, we can't continue
    if not tester.test_admin_login():
        print("❌ CRITICAL: Admin login failed. Cannot continue with authenticated tests.")
        return 1
    
    # Run authenticated tests
    test_methods = [
        tester.test_auth_me,
        tester.test_admin_stats,
        tester.test_admin_contacts,
        tester.test_admin_orders,
        tester.test_admin_users,
        tester.test_templates_crud,
        tester.test_portfolio_crud,
        tester.test_blog_crud,
        tester.test_testimonials_crud,
        tester.test_pricing_crud,
    ]
    
    for test_method in test_methods:
        try:
            test_method()
        except Exception as e:
            print(f"❌ Test method {test_method.__name__} failed with error: {e}")
            tester.failed_tests.append({
                "test": test_method.__name__,
                "expected": "SUCCESS",
                "actual": "EXCEPTION",
                "response": str(e)
            })
    
    # Print summary
    print("\n" + "=" * 60)
    print(f"📊 Admin Panel API Test Results:")
    print(f"   Total Tests: {tester.tests_run}")
    print(f"   Passed: {tester.tests_passed}")
    print(f"   Failed: {len(tester.failed_tests)}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "0%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   - {failure['test']}: Expected {failure['expected']}, got {failure['actual']}")
    
    if tester.passed_tests:
        print(f"\n✅ Passed Tests:")
        for test in tester.passed_tests:
            print(f"   - {test}")
    
    return 0 if len(tester.failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())