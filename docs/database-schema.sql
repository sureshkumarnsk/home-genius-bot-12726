-- My Home Database Schema (PostgreSQL 14+)
-- Production-ready schema with partitioning, indexes, and sample data

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE app_role AS ENUM ('admin', 'user', 'vendor');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE reorder_status AS ENUM ('disabled', 'enabled', 'snoozed');
CREATE TYPE vendor_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE bill_source AS ENUM ('email', 'sms', 'manual_upload', 'api');

-- =============================================================================
-- USERS & AUTH
-- =============================================================================

-- Users table links to Supabase auth.users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  household_size INTEGER DEFAULT 1,
  preferred_language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata'
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);

-- User roles (stored separately for security)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- Family members (share one household account)
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_primary_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relationship VARCHAR(50), -- spouse, child, parent, other
  can_add_items BOOLEAN DEFAULT TRUE,
  can_place_orders BOOLEAN DEFAULT FALSE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(household_primary_user_id, user_id)
);

CREATE INDEX idx_family_members_household ON family_members(household_primary_user_id);
CREATE INDEX idx_family_members_user ON family_members(user_id);

-- Addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(100), -- home, office, parents
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(50) NOT NULL DEFAULT 'India',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- =============================================================================
-- PRODUCTS & CATALOG
-- =============================================================================

-- Canonical product catalog (normalized product names)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  normalized_name VARCHAR(255) NOT NULL, -- lowercase, no spaces
  category VARCHAR(100), -- vegetables, dairy, pantry, etc.
  subcategory VARCHAR(100),
  unit VARCHAR(50), -- kg, liters, pieces
  brand VARCHAR(100),
  description TEXT,
  typical_shelf_life_days INTEGER, -- for expiry prediction
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_normalized_name ON products(normalized_name);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops); -- fuzzy search

-- Vendor-specific product mappings (SKUs)
CREATE TABLE product_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  vendor_sku VARCHAR(255) NOT NULL,
  vendor_product_name VARCHAR(255),
  pack_size VARCHAR(50), -- 1kg, 5kg, 500g
  pack_multiplier DECIMAL(10, 2) DEFAULT 1.0, -- bulk pack factor
  product_url TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(vendor_id, vendor_sku)
);

CREATE INDEX idx_product_catalog_product_id ON product_catalog(product_id);
CREATE INDEX idx_product_catalog_vendor_id ON product_catalog(vendor_id);

-- =============================================================================
-- VENDORS
-- =============================================================================

CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,
  website_url TEXT,
  api_base_url TEXT,
  api_key_encrypted TEXT, -- encrypted in application layer
  status vendor_status NOT NULL DEFAULT 'active',
  reliability_score DECIMAL(3, 2) DEFAULT 1.00, -- 0.00 to 1.00
  avg_delivery_time_hours INTEGER,
  cancellation_rate DECIMAL(5, 4) DEFAULT 0.0000, -- 0.0000 to 1.0000
  min_order_value DECIMAL(10, 2),
  delivery_fee DECIMAL(10, 2),
  free_delivery_threshold DECIMAL(10, 2),
  service_regions JSONB, -- ['delhi', 'mumbai', 'bangalore']
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendors_slug ON vendors(slug);
CREATE INDEX idx_vendors_status ON vendors(status);

-- Vendor prices (time-series data, partitioned by month)
CREATE TABLE vendor_prices (
  id UUID DEFAULT gen_random_uuid(),
  product_catalog_id UUID NOT NULL REFERENCES product_catalog(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  mrp DECIMAL(10, 2), -- maximum retail price
  discount_percentage DECIMAL(5, 2),
  in_stock BOOLEAN DEFAULT TRUE,
  delivery_time_hours INTEGER,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, fetched_at)
) PARTITION BY RANGE (fetched_at);

-- Create partitions for current and next 6 months (run monthly)
CREATE TABLE vendor_prices_2025_10 PARTITION OF vendor_prices
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

CREATE TABLE vendor_prices_2025_11 PARTITION OF vendor_prices
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

CREATE INDEX idx_vendor_prices_product_catalog_id ON vendor_prices(product_catalog_id, fetched_at DESC);
CREATE INDEX idx_vendor_prices_vendor_id ON vendor_prices(vendor_id, fetched_at DESC);

-- =============================================================================
-- BASKETS & ORDERS
-- =============================================================================

-- Shopping baskets (temporary before checkout)
CREATE TABLE baskets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) DEFAULT 'Grocery List',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_baskets_user_id ON baskets(user_id);
CREATE INDEX idx_baskets_user_active ON baskets(user_id, is_active);

-- Basket items
CREATE TABLE basket_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  basket_id UUID NOT NULL REFERENCES baskets(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50),
  added_by_user_id UUID REFERENCES users(id),
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_suggestion BOOLEAN DEFAULT FALSE, -- AI suggested item
  UNIQUE(basket_id, product_id)
);

CREATE INDEX idx_basket_items_basket_id ON basket_items(basket_id);

-- Orders (after checkout)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  basket_id UUID REFERENCES baskets(id) ON DELETE SET NULL,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  delivery_address_id UUID REFERENCES addresses(id),
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  is_auto_order BOOLEAN DEFAULT FALSE,
  auto_order_cancelled_by_user BOOLEAN DEFAULT FALSE,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT
);

CREATE INDEX idx_orders_user_id ON orders(user_id, placed_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_auto_order ON orders(is_auto_order, placed_at DESC);

-- Order items (links to vendor-specific catalog)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_catalog_id UUID REFERENCES product_catalog(id) ON DELETE SET NULL,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50),
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  vendor_order_id VARCHAR(255), -- external vendor order ID
  vendor_tracking_url TEXT,
  delivered_at TIMESTAMPTZ
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_vendor_id ON order_items(vendor_id);

-- =============================================================================
-- INVENTORY
-- =============================================================================

-- User's pantry inventory
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50),
  expiry_date DATE,
  purchase_date DATE,
  location VARCHAR(100), -- pantry, fridge, freezer
  barcode VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id, expiry_date) -- allow multiple entries for same product with different expiries
);

CREATE INDEX idx_inventory_items_user_id ON inventory_items(user_id);
CREATE INDEX idx_inventory_items_expiry_date ON inventory_items(expiry_date);
CREATE INDEX idx_inventory_items_user_expiry ON inventory_items(user_id, expiry_date);

-- =============================================================================
-- BILLS & EXPENSES
-- =============================================================================

CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  vendor_name VARCHAR(255), -- for non-catalog vendors
  bill_number VARCHAR(100),
  bill_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  category VARCHAR(100), -- grocery, utility, rent
  source bill_source NOT NULL,
  raw_file_url TEXT, -- PDF/image storage URL
  parsed_data JSONB, -- full OCR output
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (bill_date);

-- Create partitions for bills (annual)
CREATE TABLE bills_2025 PARTITION OF bills
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE INDEX idx_bills_user_id ON bills(user_id, bill_date DESC);
CREATE INDEX idx_bills_vendor_id ON bills(vendor_id);
CREATE INDEX idx_bills_category ON bills(category);

-- Bill line items
CREATE TABLE bill_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2),
  unit VARCHAR(50),
  unit_price DECIMAL(10, 2),
  total_price DECIMAL(10, 2) NOT NULL,
  match_confidence DECIMAL(3, 2), -- fuzzy match score 0.00-1.00
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bill_items_bill_id ON bill_items(bill_id);
CREATE INDEX idx_bill_items_product_id ON bill_items(product_id);

-- =============================================================================
-- REORDER PREDICTIONS
-- =============================================================================

CREATE TABLE reorder_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  current_quantity DECIMAL(10, 2),
  predicted_runout_date DATE NOT NULL,
  predicted_reorder_quantity DECIMAL(10, 2) NOT NULL,
  confidence_score DECIMAL(3, 2), -- 0.00-1.00
  consumption_rate_per_day DECIMAL(10, 4),
  reorder_status reorder_status NOT NULL DEFAULT 'disabled',
  auto_order_scheduled_for TIMESTAMPTZ,
  auto_order_executed_at TIMESTAMPTZ,
  user_feedback VARCHAR(50), -- accurate, too_early, too_late
  model_version VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id, predicted_runout_date)
);

CREATE INDEX idx_reorder_predictions_user_id ON reorder_predictions(user_id);
CREATE INDEX idx_reorder_predictions_runout_date ON reorder_predictions(predicted_runout_date);
CREATE INDEX idx_reorder_predictions_status ON reorder_predictions(reorder_status, auto_order_scheduled_for);

-- =============================================================================
-- FEEDBACK & ANALYTICS
-- =============================================================================

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  reorder_prediction_id UUID REFERENCES reorder_predictions(id) ON DELETE SET NULL,
  feedback_type VARCHAR(50), -- prediction_accuracy, vendor_rating, feature_request
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_order_id ON feedback(order_id);
CREATE INDEX idx_feedback_type ON feedback(feedback_type);

-- =============================================================================
-- SESSIONS & AUDIT
-- =============================================================================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash TEXT NOT NULL,
  device_info JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Audit log (data access, role changes, deletions)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- login, data_export, role_change, delete_account
  resource_type VARCHAR(100),
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- =============================================================================

-- Enable RLS on all user-facing tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE baskets ENABLE ROW LEVEL SECURITY;
ALTER TABLE basket_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reorder_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Example RLS policies (users can only access their own data)
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- Admins can view all data
CREATE POLICY "Admins can view all users"
  ON users FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- =============================================================================
-- SAMPLE DATA
-- =============================================================================

-- Sample users
INSERT INTO users (id, auth_user_id, email, full_name, phone, household_size) VALUES
('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'priya@example.com', 'Priya Sharma', '+919876543210', 4),
('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'rahul@example.com', 'Rahul Verma', '+919876543211', 4),
('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'amit@vendor.com', 'Amit Patel', '+919876543212', 1);

-- Sample roles
INSERT INTO user_roles (user_id, role) VALUES
('11111111-1111-1111-1111-111111111111', 'user'),
('22222222-2222-2222-2222-222222222222', 'user'),
('33333333-3333-3333-3333-333333333333', 'vendor');

-- Sample vendors
INSERT INTO vendors (id, name, slug, reliability_score, avg_delivery_time_hours, cancellation_rate, delivery_fee, status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Amazon Fresh', 'amazon-fresh', 0.92, 24, 0.0350, 40.00, 'active'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Flipkart Supermart', 'flipkart-supermart', 0.89, 48, 0.0480, 30.00, 'active'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'JioMart', 'jiomart', 0.85, 36, 0.0620, 0.00, 'active');

-- Sample products
INSERT INTO products (id, name, normalized_name, category, subcategory, unit, typical_shelf_life_days) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Toned Milk', 'toned_milk', 'Dairy', 'Milk', 'liters', 3),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Whole Wheat Bread', 'whole_wheat_bread', 'Bakery', 'Bread', 'pieces', 5),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Basmati Rice (5kg)', 'basmati_rice_5kg', 'Pantry', 'Grains', 'kg', 365);

-- Sample product catalog (vendor SKUs)
INSERT INTO product_catalog (product_id, vendor_id, vendor_sku, vendor_product_name, pack_size) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'AMZ-MILK-001', 'Amul Toned Milk 1L', '1L'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'FLP-MILK-002', 'Mother Dairy Toned Milk 1L', '1L'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'AMZ-BREAD-101', 'Britannia Whole Wheat Bread', '400g'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'JIO-RICE-501', 'India Gate Basmati Rice 5kg', '5kg');

-- Sample vendor prices (current)
INSERT INTO vendor_prices (product_catalog_id, vendor_id, price, mrp, discount_percentage, in_stock, delivery_time_hours) VALUES
((SELECT id FROM product_catalog WHERE vendor_sku='AMZ-MILK-001'), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 58.00, 62.00, 6.45, TRUE, 24),
((SELECT id FROM product_catalog WHERE vendor_sku='FLP-MILK-002'), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 52.00, 60.00, 13.33, TRUE, 48),
((SELECT id FROM product_catalog WHERE vendor_sku='AMZ-BREAD-101'), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 42.00, 45.00, 6.67, TRUE, 24);

-- =============================================================================
-- INDEX JUSTIFICATIONS
-- =============================================================================

-- 1. users(email): Frequent login queries
-- 2. users(auth_user_id): Links to Supabase auth
-- 3. orders(user_id, placed_at DESC): Order history queries
-- 4. vendor_prices(product_catalog_id, fetched_at DESC): Latest price lookup
-- 5. inventory_items(user_id, expiry_date): Expiring items alerts
-- 6. reorder_predictions(reorder_status, auto_order_scheduled_for): Scheduled auto-order queries
-- 7. products(name) with gin_trgm_ops: Fuzzy product search (requires pg_trgm extension)

-- Partitioning strategy:
-- - vendor_prices: Monthly partitions (high write volume, 6-month retention)
-- - bills: Annual partitions (compliance requires 7-year retention)

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sync user profile on auth user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO users (auth_user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO user_roles (user_id, role)
  VALUES ((SELECT id FROM users WHERE auth_user_id = NEW.id), 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- EXTENSIONS
-- =============================================================================

-- Enable fuzzy string matching for product search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- NOTES
-- =============================================================================

-- Backup strategy:
-- - Daily full backup + WAL archiving
-- - Point-in-time recovery enabled
-- - Cross-region replication for disaster recovery

-- Monitoring:
-- - Track query performance with pg_stat_statements
-- - Alert on partition lag (auto-create monthly partitions)
-- - Monitor table bloat and run VACUUM ANALYZE weekly

-- Security:
-- - Encrypt sensitive columns (api_key_encrypted, payment_reference) at application layer
-- - Rotate JWT refresh tokens every 7 days
-- - Audit all admin actions in audit_logs table
