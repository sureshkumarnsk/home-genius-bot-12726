# My Home - Product Specification

## Elevator Pitch
**My Home** auto-sources your household essentials from the cheapest vendors, learns your consumption patterns, and reorders before you run out—saving time and money on every grocery trip.

---

## User Personas

### 1. Primary User (Household Manager)
**Name:** Priya, 34, working parent  
**Goal:** Minimize time spent on grocery shopping while controlling household expenses  
**Tech savviness:** Medium | Uses apps daily for banking, shopping, social media

### 2. Family Member (Secondary User)
**Name:** Rahul, 38, spouse  
**Goal:** Contribute to household management without duplicating orders or missing items  
**Tech savviness:** Medium | Prefers simple interfaces

### 3. Grocery Vendor (Business User)
**Name:** Amit, 42, regional manager at online grocery platform  
**Goal:** Increase order volume through competitive pricing and reliable fulfillment  
**Tech savviness:** High | Manages pricing feeds and inventory systems

---

## Prioritized User Stories

### P0 - Core Value (Must Have)

#### Story 1: Smart Grocery List Creation
**As a** household manager  
**I want** to create a grocery list by voice, text, or photo  
**So that** I can quickly capture needs without manual typing

**Acceptance Criteria:**
- User can add items via text input with autocomplete
- User can upload photo of handwritten list with 90%+ OCR accuracy
- Voice input recognizes 95%+ of common Indian grocery items
- Items are normalized to canonical product names
- List auto-categorizes items (vegetables, dairy, pantry, etc.)

---

#### Story 2: Multi-Vendor Price Comparison
**As a** household manager  
**I want** to see real-time prices from Amazon, Flipkart, JioMart, Blinkit side-by-side  
**So that** I can buy from the cheapest vendor for each item

**Acceptance Criteria:**
- Comparison shows price per unit, delivery time, vendor reliability score
- Supports bulk pack detection (e.g., 5kg vs 1kg rice)
- Highlights "best deal" with savings percentage
- Refreshes prices every 15 minutes
- Shows out-of-stock items clearly
- Total basket cost calculated per vendor

---

#### Story 3: One-Click Optimal Purchase
**As a** household manager  
**I want** the system to split my order across vendors for lowest total cost  
**So that** I maximize savings without manual work

**Acceptance Criteria:**
- Algorithm considers item price + delivery fee + packaging
- Respects user-set preferences (e.g., "prefer JioMart within 5% price difference")
- Avoids vendors with >5% cancellation rate
- Shows savings vs single-vendor purchase
- Creates orders across multiple vendors with one confirmation
- Sends order confirmation with tracking links

---

#### Story 4: Predictive Auto-Reorder
**As a** household manager  
**I want** the system to predict when I'll run out of staples and auto-reorder  
**So that** I never run out of essentials without manual tracking

**Acceptance Criteria:**
- Learns consumption rate from first 3 purchases of each item
- Predicts reorder date with ±3 day accuracy
- Sends notification 48 hours before auto-order
- User can cancel/snooze auto-order with one tap
- Adjusts predictions based on household size changes
- Never orders more than 1 month supply per item

---

### P1 - Enhanced Experience (Should Have)

#### Story 5: Bill Capture & Expense Tracking
**As a** household manager  
**I want** to forward utility/grocery bills via email or SMS  
**So that** all household expenses are tracked in one place

**Acceptance Criteria:**
- Accepts PDF/image bills via forwarded email
- Extracts vendor, date, items, amounts with 85%+ accuracy
- Matches bill items to product catalog using fuzzy search
- Displays monthly spending by category
- Exports data to CSV/Excel
- Alerts on unusual spending patterns

---

#### Story 6: Inventory Management
**As a** household manager  
**I want** to see what's in my pantry and when items expire  
**So that** I avoid waste and duplicate purchases

**Acceptance Criteria:**
- Manual inventory entry with barcode scanning
- Tracks quantity and expiry dates
- Alerts 7 days before expiry
- Shows "unused items" needing attention
- Suggests recipes using near-expiry items
- Deducts inventory after each purchase

---

#### Story 7: Family Member Coordination
**As a** family member  
**I want** to see the shared grocery list and add items  
**So that** I can contribute without creating duplicate orders

**Acceptance Criteria:**
- Family members share one household account
- Real-time list sync across devices
- Activity log shows who added/removed items
- Family members can vote on auto-reorder preferences
- Only primary user can execute purchases
- Push notifications for list updates

---

### P2 - Optimization (Nice to Have)

#### Story 8: Price Drop Alerts
**As a** household manager  
**I want** alerts when frequently bought items drop below average price  
**So that** I can stock up when deals appear

**Acceptance Criteria:**
- Tracks 90-day price history per item
- Alerts when price drops >15% below average
- Option to set custom alert thresholds
- Shows deal expiry time
- Quick "buy now" action from notification

---

#### Story 9: Seasonal Recommendations
**As a** household manager  
**I want** suggestions for seasonal items (e.g., Diwali sweets)  
**So that** I don't forget festival essentials

**Acceptance Criteria:**
- AI suggests items based on calendar (festivals, seasons)
- Learns from past festival purchases
- Allows dismissing/snoozing suggestions
- Bundles related items (e.g., pooja items)

---

#### Story 10: Vendor Performance Dashboard (Admin)
**As a** grocery vendor  
**I want** to see my reliability score, order volume, and price competitiveness  
**So that** I can optimize my offering

**Acceptance Criteria:**
- Shows weekly order volume trend
- Displays reliability score (on-time %, cancellation rate)
- Price competitiveness vs competitors (anonymized)
- Customer feedback summary
- API access to update pricing feed
- Export data to CSV

---

## Non-Functional Requirements

### Performance
- **Page load:** <2 seconds on 4G connection
- **Search response:** <500ms for product catalog queries
- **Price refresh:** Every 15 minutes via background jobs
- **API response time:** p95 <300ms for read operations

### Availability
- **Uptime SLA:** 99.5% (excluding planned maintenance)
- **Graceful degradation:** Show cached prices if vendor API down
- **Auto-order safety:** Requires 2 consecutive prediction confirmations

### Scalability
- **Target:** 1M active users/month
- **Concurrent users:** 50k peak (festival shopping periods)
- **Database:** Partition vendor_prices by month (6-month retention)
- **Caching:** Redis for product catalog, vendor prices (15-min TTL)

### Security
- **Authentication:** JWT tokens with 7-day expiry, refresh token rotation
- **Payment:** Tokenized card storage via Razorpay/Stripe
- **Data encryption:** At-rest (AES-256), in-transit (TLS 1.3)
- **API rate limiting:** 100 requests/min per user

---

## Privacy & Compliance

### GDPR / India Data Protection Act (DPDPA)

#### Data Collection
- **Personal data:** Name, email, phone, address, family members
- **Purchase data:** Order history, basket contents, preferences
- **Bill data:** Uploaded receipts, vendor, amounts, items
- **Device data:** IP address, device ID, push tokens

#### User Rights
- **Access:** Export all data in JSON format
- **Rectification:** Edit profile, family members, preferences
- **Erasure:** Delete account and all associated data within 30 days
- **Portability:** Download purchase history, bills in CSV/PDF

#### Data Retention
- **Active users:** Indefinite with annual consent renewal
- **Inactive users (>2 years):** Anonymize purchase data, delete PII
- **Bills:** Retain 7 years for tax purposes (anonymized after user deletion)
- **Vendor prices:** Retain 6 months for trend analysis

#### Third-Party Sharing
- **Vendors:** Share only order details (items, delivery address)
- **Payment processors:** Tokenized payment only
- **Analytics:** Anonymized usage data (no PII)
- **No data sale:** Explicit commitment in privacy policy

#### Security Measures
- **Encryption:** End-to-end for bill uploads, at-rest for database
- **Access control:** Role-based (admin, user, vendor)
- **Audit logs:** All data access logged for 90 days
- **Breach notification:** Users notified within 72 hours

#### Consent Management
- **Explicit opt-in:** Auto-reorder, price alerts, marketing emails
- **Granular controls:** Toggle each data use category separately
- **Withdrawal:** One-click unsubscribe from all communications

---

## Success Metrics

### User Engagement
- **DAU/MAU ratio:** >30%
- **Avg. orders per user per month:** >3
- **Auto-reorder adoption:** >40% of users within 3 months

### Business Value
- **Avg. savings per order:** >₹150 vs single vendor
- **Order completion rate:** >85%
- **Vendor NPS:** >50

### Technical Health
- **Error rate:** <0.5%
- **Prediction accuracy:** >80% within ±3 days
- **Bill OCR accuracy:** >85%

---

**Version:** 1.0  
**Last updated:** 2025-10-22  
**Owner:** Product Team
