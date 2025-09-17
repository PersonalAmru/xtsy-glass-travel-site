# Real-Time Room Booking System with Cashfree Payments

## Overview

This system provides atomic inventory control with real-time updates and multi-platform Cashfree payment integration for Web, iOS, Android, React Native, and Flutter.

## Architecture

### Database Schema
- **room_types**: Master room data with pricing and capacity
- **room_inventory**: Nightly availability tracking with real-time updates  
- **pending_orders**: Temporary orders during payment flow
- **bookings**: Confirmed reservations
- **transactions**: Payment records

### Key Features
- ✅ **Race-proof inventory**: Atomic triggers prevent double bookings
- ✅ **Real-time availability**: WebSocket updates show "You just missed it!"
- ✅ **Anonymous booking**: No login required
- ✅ **Multi-platform payments**: Same backend for all platforms

## Environment Variables

Store these in Supabase Secrets and GitHub Actions:

```bash
# Cashfree Configuration
CASHFREE_APP_ID=cf_app_XXXXXXXXX
CASHFREE_SECRET_KEY=cf_secret_YYYYYYYY
CASHFREE_ENV=TEST # or PROD

# Application URLs
PUBLIC_SITE_ORIGIN=https://your-domain.com
WEBHOOK_VERIFY_SIGNING=true
```

## Payment Flow

```mermaid
graph TD
    A[User selects dates] --> B[Check availability]
    B --> C{Available?}
    C -->|No| D[Show "You just missed it!"]
    C -->|Yes| E[Create pending order]
    E --> F[Launch Cashfree payment]
    F --> G{Payment success?}
    G -->|Yes| H[Webhook confirms booking]
    G -->|No| I[Clean up pending order]
    H --> J[Inventory decremented atomically]
    J --> K[Real-time broadcast to all clients]
```

## Platform Integration

### Web (JavaScript)
```javascript
// Load Cashfree SDK
const script = document.createElement('script');
script.src = 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.js';

// Initialize checkout
const cashfree = window.Cashfree({ mode: 'sandbox' });
cashfree.checkout({
  paymentSessionId: orderData.payment_session_id,
  returnUrl: 'https://yoursite.com/success'
});
```

### iOS (Swift)
```swift
// Add to Podfile
pod 'CashfreePG'

// Initialize payment
import CashfreePG

let session = CFSession.CFSessionBuilder()
    .setEnvironment(.SANDBOX) // .PRODUCTION for live
    .setPaymentSessionID(paymentSessionId)
    .setOrderId(orderId)
    .build()

CFPaymentGatewayService.getInstance().doPayment(session, self, "")
```

### Android (Kotlin)
```kotlin
// build.gradle
implementation 'com.cashfree.pg:api:2.1.+'

// Initialize payment
val cfSession = CFSession.CFSessionBuilder()
    .setEnvironment(CFSession.Environment.SANDBOX)
    .setPaymentSessionId(paymentSessionId)
    .setOrderId(orderId)
    .build()

CFPaymentGateway.getInstance().doPayment(this, cfSession)
```

### React Native
```bash
npm install react-native-cashfree-pg-sdk
```

```javascript
import { CFPaymentGateway } from 'react-native-cashfree-pg-sdk';

const session = {
  paymentSessionId: orderData.payment_session_id,
  orderId: orderData.order_id,
  environment: 'SANDBOX'
};

CFPaymentGateway.doPayment(JSON.stringify(session));
```

### Flutter
```yaml
# pubspec.yaml
dependencies:
  cashfree_pg: ^2.0.0
```

```dart
import 'package:cashfree_pg/cashfree_pg.dart';

final session = CFSessionBuilder()
    .setEnvironment(CFEnvironment.SANDBOX)
    .setPaymentSessionId(paymentSessionId)
    .setOrderId(orderId)
    .build();

CashfreePGSDK.doPayment(session);
```

## API Endpoints

### Create Order
```
POST /functions/v1/cashfree-create-order
```

**Request:**
```json
{
  "room_type_id": "xtsy-270",
  "check_in": "2025-09-17",
  "check_out": "2025-09-19", 
  "quantity": 1,
  "amount": 9500,
  "customer_email": "guest@example.com",
  "customer_name": "John Doe",
  "customer_phone": "+919999999999"
}
```

**Response:**
```json
{
  "order_id": "XTSY-1726567890-abc123",
  "payment_session_id": "session_123",
  "payment_link": "https://payments.cashfree.com/...",
  "order_amount": 9500,
  "order_currency": "INR"
}
```

### Webhook Endpoint
```
POST /functions/v1/cashfree-webhook
```

Automatically processes payments and creates bookings with atomic inventory updates.

## Room Types & Pricing

| Room Type | ID | Capacity | Units | Base Price |
|-----------|----|---------:|------:|-----------:|
| XTSY 270 Premium | `xtsy-270` | 2 | 1 | ₹4,500 |
| 4 Bed Female Dorm | `4-bed-female-only-dorm` | 1 | 4 | ₹800 |
| 6 Bed Mixed Dorm | `6-bed-mixed-dorm` | 1 | 24 | ₹650 |
| King Double Room | `king-double-room` | 2 | 2 | ₹2,500 |

## Security Features

- **Webhook signature verification** using HMAC-SHA256
- **RLS policies** prevent unauthorized data access  
- **Rate limiting** via triggers and functions
- **Input sanitization** and validation
- **Atomic transactions** prevent race conditions

## Real-Time Updates

```javascript
// Subscribe to inventory changes
const channel = supabase
  .channel('room-inventory-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public', 
    table: 'room_inventory',
    filter: `room_type_id=eq.${roomTypeId}`
  }, (payload) => {
    // Update UI when inventory changes
    updateAvailabilityDisplay(payload.new);
  })
  .subscribe();
```

## Testing

1. **Test bookings** with Cashfree sandbox mode
2. **Race condition tests**: Multiple concurrent bookings  
3. **Real-time tests**: Open multiple browsers, book in one, watch others update
4. **Webhook tests**: Simulate payment success/failure scenarios
5. **Security tests**: Verify RLS policies and rate limiting

## Deployment

The system automatically deploys via GitHub Actions:
- Database migrations on merge to main
- Edge functions auto-deploy
- Secrets managed via Supabase dashboard

## Support

For issues or questions:
- Check Supabase Edge Function logs
- Verify Cashfree webhook delivery
- Monitor real-time subscriptions
- Review database triggers and policies