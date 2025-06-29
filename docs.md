# AfyaBora Healthcare Management System - Documentation

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [User Roles & Features](#user-roles--features)
4. [API Integration](#api-integration)
5. [Core Features](#core-features)
6. [Development Setup](#development-setup)
7. [Deployment Guide](#deployment-guide)
8. [Maintenance Guidelines](#maintenance-guidelines)
9. [Security & Compliance](#security--compliance)
10. [Troubleshooting](#troubleshooting)

## Overview

AfyaBora is a comprehensive healthcare management platform built with React Native and Expo, designed to connect patients, healthcare providers, and administrators in Kenya's healthcare ecosystem. The system integrates with ERPNext for backend operations and supports M-Pesa payments for the Kenyan market.

### Key Technologies
- **Frontend**: React Native with Expo SDK 52
- **Backend**: ERPNext (Healthcare Module)
- **Database**: PostgreSQL/MariaDB (via ERPNext)
- **Payment**: M-Pesa API Integration
- **Authentication**: Custom JWT-based system
- **State Management**: React Context + AsyncStorage
- **UI Framework**: Custom components with Lucide React Native icons

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   ERPNext API   │    │    Database     │
│  (React Native) │◄──►│   (Backend)     │◄──►│ (PostgreSQL/    │
│                 │    │                 │    │  MariaDB)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   M-Pesa API    │    │  External APIs  │
│   (Payments)    │    │ (SMS, Email,    │
│                 │    │  Notifications) │
└─────────────────┘    └─────────────────┘
```

## User Roles & Features

### 1. Patient Role
**Primary Features:**
- **Service Discovery**: Browse and search healthcare services
- **Appointment Booking**: Schedule appointments with providers
- **Remote Consultations**: Video/audio calls with doctors
- **Prescription Management**: View and order prescribed medications
- **Health Records**: Access personal health history
- **Payment Integration**: M-Pesa and other payment methods
- **Provider Ratings**: Rate and review healthcare providers

**Key Screens:**
- Dashboard with health overview
- Services marketplace
- Appointment management
- Prescription tracking
- Cart and checkout
- Provider profiles with ratings

### 2. Healthcare Provider Role
**Primary Features:**
- **Patient Management**: View and manage patient records
- **Consultation Platform**: Conduct remote consultations
- **Prescription System**: Digital prescription creation
- **Schedule Management**: Manage availability and appointments
- **Practice Analytics**: Revenue and patient insights
- **Rating Management**: View and respond to patient reviews

**Key Screens:**
- Provider dashboard with practice metrics
- Patient consultation interface
- Prescription management
- Appointment scheduling
- Practice analytics
- Profile management

### 3. Administrator Role
**Primary Features:**
- **User Management**: Verify and manage all users
- **System Monitoring**: Platform health and usage analytics
- **Content Management**: Manage services and providers
- **Compliance Oversight**: Ensure regulatory compliance
- **Support Management**: Handle user support requests

**Key Screens:**
- Admin dashboard with system metrics
- User verification interface
- System monitoring tools
- Content management panels

## API Integration

### ERPNext Healthcare Module Integration

#### Core Endpoints

**Patient Management:**
```javascript
// Create Patient
POST /api/resource/Patient
{
  "patient_name": "John Doe",
  "mobile": "+254722123456",
  "email": "john@example.com",
  "sex": "Male",
  "date_of_birth": "1990-01-01"
}

// Get Patients
GET /api/resource/Patient?filters=[["mobile","=","+254722123456"]]

// Update Patient
PUT /api/resource/Patient/{patient_id}
```

**Appointment Management:**
```javascript
// Create Appointment
POST /api/resource/Patient Appointment
{
  "patient": "PAT-001",
  "practitioner": "PROV-001",
  "appointment_date": "2024-06-25",
  "appointment_time": "10:30:00",
  "appointment_type": "General Consultation"
}

// Get Appointments
GET /api/resource/Patient Appointment?filters=[["appointment_date","=","2024-06-25"]]
```

**Prescription Management:**
```javascript
// Create Prescription
POST /api/resource/Patient Encounter
{
  "patient": "PAT-001",
  "practitioner": "PROV-001",
  "encounter_date": "2024-06-25",
  "drug_prescription": [
    {
      "drug_code": "PARA-500",
      "drug_name": "Paracetamol 500mg",
      "dosage": "500mg",
      "period": "7 days"
    }
  ]
}
```

**Billing & Invoicing:**
```javascript
// Create Sales Invoice
POST /api/resource/Sales Invoice
{
  "customer": "PAT-001",
  "posting_date": "2024-06-25",
  "items": [
    {
      "item_code": "CONSULTATION",
      "qty": 1,
      "rate": 2500
    }
  ]
}
```

### M-Pesa Integration

#### Payment Request Flow
```javascript
// Initiate M-Pesa Payment
POST /api/resource/Payment Request
{
  "payment_gateway": "M-Pesa",
  "party": "+254722123456",
  "amount": 2500,
  "reference_doctype": "Sales Invoice",
  "reference_name": "INV-001"
}

// Payment Callback Handling
POST /api/method/mpesa_callback
{
  "TransactionType": "Pay Bill",
  "TransID": "OEI2AK4Q16",
  "TransAmount": "2500.00",
  "BusinessShortCode": "174379",
  "BillRefNumber": "INV-001",
  "MSISDN": "254722123456"
}
```

### Rating System API

#### Custom DocType: Healthcare Provider Rating
```javascript
// Submit Rating
POST /api/resource/Healthcare Provider Rating
{
  "provider_id": "PROV-001",
  "patient_id": "PAT-001",
  "rating": 5,
  "review": "Excellent service",
  "communication_rating": 5,
  "professionalism_rating": 5,
  "wait_time_rating": 4,
  "facilities_rating": 5,
  "would_recommend": 1
}

// Get Provider Ratings
GET /api/resource/Healthcare Provider Rating?filters=[["provider_id","=","PROV-001"]]
```

## Core Features

### 1. Authentication System

**Implementation:**
- Role-based authentication (Patient, Provider, Admin)
- JWT token management
- Persistent login with AsyncStorage
- Secure logout with data cleanup

**Files:**
- `contexts/AuthContext.tsx` - Authentication state management
- `app/index.tsx` - Landing page with role selection
- `hooks/useAuth.ts` - Authentication hooks

### 2. Service Marketplace

**Features:**
- Service browsing and filtering
- Provider profiles with ratings
- Real-time availability checking
- Cart functionality for multiple services

**Files:**
- `app/(tabs)/services.tsx` - Service marketplace
- `app/(tabs)/cart.tsx` - Shopping cart
- `hooks/useCart.ts` - Cart state management

### 3. Remote Consultations

**Features:**
- Video/audio calling interface
- Real-time prescription creation
- Patient vital signs recording
- Consultation notes management

**Files:**
- `app/(tabs)/consultations.tsx` - Consultation interface
- `components/ui/PrescriptionCard.tsx` - Prescription components

### 4. Prescription Management

**Features:**
- Digital prescription viewing
- Pharmacy selection and comparison
- Prescription-to-cart integration
- Medication tracking

**Files:**
- `app/(tabs)/prescriptions.tsx` - Prescription management
- `app/(tabs)/medications.tsx` - Medication tracking

### 5. Rating & Review System

**Features:**
- Multi-category rating system
- Verified patient reviews
- Provider rating analytics
- Review helpfulness voting

**Files:**
- `components/ui/RatingSystem.tsx` - Rating interface
- `services/ratingService.ts` - Rating API service
- `hooks/useRatings.ts` - Rating state management

### 6. Payment Integration

**Features:**
- M-Pesa mobile money integration
- Multiple payment methods
- Invoice generation
- Payment status tracking

**Files:**
- `services/erpnext.ts` - Payment API integration
- `app/(tabs)/billing.tsx` - Billing management

## Development Setup

### Prerequisites
```bash
# Node.js 18+ and npm
node --version
npm --version

# Expo CLI
npm install -g @expo/cli

# Git
git --version
```

### Installation
```bash
# Clone repository
git clone <repository-url>
cd afyabora-healthcare

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Environment Configuration

**Required Environment Variables:**
```bash
# ERPNext Configuration
EXPO_PUBLIC_ERPNEXT_URL=https://your-erpnext-instance.com
EXPO_PUBLIC_ERPNEXT_API_KEY=your_api_key_here
EXPO_PUBLIC_ERPNEXT_API_SECRET=your_api_secret_here

# M-Pesa Configuration
EXPO_PUBLIC_MPESA_CONSUMER_KEY=your_mpesa_consumer_key
EXPO_PUBLIC_MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
EXPO_PUBLIC_MPESA_SHORTCODE=your_mpesa_shortcode

# App Configuration
EXPO_PUBLIC_APP_NAME=AfyaBora Healthcare
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_ENVIRONMENT=development
```

### Development Commands
```bash
# Start development server
npm run dev

# Build for web
npm run build:web

# Run linting
npm run lint

# Clear cache and restart
npx expo start --clear
```

## Deployment Guide

### Web Deployment
```bash
# Build for production
npm run build:web

# Deploy to hosting service (Netlify, Vercel, etc.)
# Upload dist folder or connect to Git repository
```

### Mobile App Deployment

#### iOS Deployment
```bash
# Build for iOS
npx expo build:ios

# Submit to App Store
npx expo upload:ios
```

#### Android Deployment
```bash
# Build for Android
npx expo build:android

# Submit to Google Play
npx expo upload:android
```

### ERPNext Setup

#### Required DocTypes
1. **Healthcare Provider Rating**
   - Fields: provider_id, patient_id, rating, review, categories
   - Permissions: Patient (create), Provider (read), Admin (all)

2. **Payment Request**
   - Fields: payment_gateway, amount, reference_doctype
   - Integration with M-Pesa API

#### Custom Scripts
```python
# M-Pesa Integration Script
import frappe
import requests

@frappe.whitelist()
def initiate_mpesa_payment(phone_number, amount, reference):
    # M-Pesa STK Push implementation
    pass

@frappe.whitelist()
def mpesa_callback():
    # Handle M-Pesa payment callbacks
    pass
```

## Maintenance Guidelines

### Regular Maintenance Tasks

#### Daily
- Monitor system health and error logs
- Check payment processing status
- Review user support tickets
- Monitor API rate limits

#### Weekly
- Update provider availability schedules
- Review and moderate user ratings
- Analyze usage metrics
- Check data backup integrity

#### Monthly
- Update medication database
- Review and update service pricing
- Analyze user feedback and ratings
- Security audit and updates

### Code Maintenance

#### File Organization
```
src/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── index.tsx          # Landing page
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   └── ui/               # UI components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── services/             # API services
└── types/                # TypeScript types
```

#### Component Guidelines
- Use TypeScript for all components
- Follow React Native best practices
- Implement proper error boundaries
- Use consistent styling patterns
- Document complex components

#### State Management
- Use React Context for global state
- AsyncStorage for persistent data
- Custom hooks for complex logic
- Avoid prop drilling

### Database Maintenance

#### ERPNext Maintenance
```sql
-- Regular cleanup queries
DELETE FROM `tabHealthcare Provider Rating` 
WHERE creation < DATE_SUB(NOW(), INTERVAL 2 YEAR);

-- Index optimization
OPTIMIZE TABLE `tabPatient Appointment`;
OPTIMIZE TABLE `tabSales Invoice`;
```

#### Backup Strategy
- Daily automated backups
- Weekly full system backups
- Monthly backup verification
- Disaster recovery testing

### Performance Monitoring

#### Key Metrics
- App load time and responsiveness
- API response times
- Payment success rates
- User engagement metrics
- Error rates and crash reports

#### Monitoring Tools
- Expo Analytics for app metrics
- ERPNext system monitor
- Custom logging for business metrics
- User feedback tracking

## Security & Compliance

### Data Protection
- HIPAA compliance for health data
- GDPR compliance for EU users
- Local data protection laws (Kenya)
- Encryption for sensitive data

### Security Measures
- API authentication and authorization
- Input validation and sanitization
- Secure payment processing
- Regular security audits

### Compliance Requirements
- Healthcare provider licensing verification
- Medical data handling protocols
- Payment processing compliance (PCI DSS)
- User consent management

## Troubleshooting

### Common Issues

#### App Won't Start
```bash
# Clear Expo cache
npx expo start --clear

# Reset Metro bundler
npx expo start --reset-cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### API Connection Issues
```javascript
// Check ERPNext connectivity
const testConnection = async () => {
  try {
    const response = await fetch(`${ERPNEXT_URL}/api/method/ping`);
    console.log('ERPNext connection:', response.ok);
  } catch (error) {
    console.error('Connection failed:', error);
  }
};
```

#### Payment Integration Issues
```javascript
// M-Pesa troubleshooting
const debugMpesa = async () => {
  // Check credentials
  console.log('Consumer Key:', MPESA_CONSUMER_KEY);
  
  // Test authentication
  const authResponse = await fetch(MPESA_AUTH_URL, {
    headers: {
      'Authorization': `Basic ${btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`)}`
    }
  });
  
  console.log('M-Pesa auth:', authResponse.ok);
};
```

### Error Handling

#### Frontend Error Boundaries
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

#### API Error Handling
```typescript
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    console.error('API Error:', error.response.status, error.response.data);
  } else if (error.request) {
    // Request made but no response
    console.error('Network Error:', error.request);
  } else {
    // Something else happened
    console.error('Error:', error.message);
  }
};
```

### Support Contacts

#### Development Team
- **Lead Developer**: [Contact Information]
- **Backend Developer**: [Contact Information]
- **UI/UX Designer**: [Contact Information]

#### Infrastructure
- **DevOps Engineer**: [Contact Information]
- **Database Administrator**: [Contact Information]
- **Security Officer**: [Contact Information]

#### Business
- **Product Manager**: [Contact Information]
- **Healthcare Compliance**: [Contact Information]
- **Customer Support**: [Contact Information]

---

## Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Submit pull request with description
4. Code review and approval
5. Merge to `main` and deploy

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier for formatting
- Write unit tests for critical functions
- Document complex business logic
- Follow React Native performance guidelines

### Testing Strategy
- Unit tests for utility functions
- Integration tests for API services
- E2E tests for critical user flows
- Manual testing on multiple devices
- Performance testing for large datasets

---

*Last Updated: June 2024*
*Version: 1.0.0*