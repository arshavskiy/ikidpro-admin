# B2B Registration System

## Overview

The B2B Registration system allows businesses such as clinics, hospitals, schools, and other child-related organizations to register and invite users to join their platform.

## Features

### Business Management

- **Create Business**: Register new businesses with comprehensive information
- **Business Types**: Support for various business categories:
  - Clinic
  - Hospital
  - School
  - Daycare
  - Pediatric Center
  - Rehabilitation Center
  - Mental Health Clinic
  - Sports Center
  - Other

### User Invitation System

- **Invite Users**: Add multiple users to a business
- **User Management**: Track user status (pending, active, inactive)
- **Resend Invites**: Resend invitations to pending users
- **Remove Users**: Remove users from businesses

### Business Information

- Business name and type
- Contact information (phone, email, website)
- Physical address
- Business description
- Creation date and timestamps

### User Information

- First and last name
- Email address
- Phone number
- Invitation status
- Join date (when applicable)

## Technical Implementation

### Components

- **B2BRegistration.vue**: Main page for managing businesses and users
- **b2bStore.js**: Pinia store for state management
- **b2bApi.js**: API service layer for backend communication

### Store Features

- Centralized state management for businesses and users
- CRUD operations for businesses
- User invitation and management
- Search and filtering capabilities
- Business statistics and analytics

### API Endpoints

- `GET /b2b/businesses` - Get all businesses
- `POST /b2b/businesses` - Create new business
- `PUT /b2b/businesses/:id` - Update business
- `DELETE /b2b/businesses/:id` - Delete business
- `POST /b2b/businesses/:id/invite` - Invite users
- `POST /b2b/businesses/:id/users/:userId/resend-invite` - Resend invitation
- `DELETE /b2b/businesses/:id/users/:userId` - Remove user
- `PATCH /b2b/businesses/:id/users/:userId/status` - Update user status

## Usage

### Accessing the System

1. Navigate to `/admin/b2b` in the admin panel
2. The page is accessible through the Admin Management menu

### Creating a Business

1. Click "Create Business" button
2. Fill in required fields:
   - Business Name (required)
   - Business Type (required)
   - Address (required)
   - Phone (required)
   - Email (required)
3. Optionally add website and description
4. Click "Create Business"

### Inviting Users

1. Click "Invite Users" on any business
2. Add user information:
   - First Name
   - Last Name
   - Email
   - Phone
3. Click "Add to List" to add users to the invitation list
4. Click "Invite Users" to send invitations

### Managing Users

- **View Details**: See business information and user list
- **Resend Invite**: Resend invitation to pending users
- **Remove User**: Remove users from the business

## Data Structure

### Business Object

```javascript
{
  _id: "string",
  name: "string",
  type: "string",
  address: "string",
  phone: "string",
  email: "string",
  website: "string",
  description: "string",
  createdAt: "ISO date string",
  updatedAt: "ISO date string",
  users: [UserObject]
}
```

### User Object

```javascript
{
  _id: "string",
  firstName: "string",
  lastName: "string",
  email: "string",
  phone: "string",
  status: "pending" | "active" | "inactive",
  invitedAt: "ISO date string",
  joinedAt: "ISO date string | null"
}
```

## Future Enhancements

### Planned Features

- **Bulk User Import**: CSV import for multiple users
- **Email Templates**: Customizable invitation emails
- **User Roles**: Different permission levels within businesses
- **Business Verification**: Admin approval process
- **Analytics Dashboard**: Business performance metrics
- **Integration**: Connect with existing user management systems

### API Improvements

- **Webhook Support**: Real-time notifications
- **Rate Limiting**: Prevent abuse
- **Audit Logging**: Track all changes
- **Bulk Operations**: Handle multiple businesses/users

## Security Considerations

- **Authentication**: Admin-only access
- **Authorization**: Role-based permissions
- **Data Validation**: Input sanitization and validation
- **Audit Trail**: Log all administrative actions
- **Rate Limiting**: Prevent invitation spam

## Configuration

### Environment Variables

```bash
# B2B API Configuration
B2B_API_BASE_URL=https://api.example.com/b2b
B2B_INVITATION_EXPIRY_DAYS=30
B2B_MAX_USERS_PER_BUSINESS=100
```

### Business Type Configuration

Business types can be customized in the `businessTypeOptions` array in the B2BRegistration.vue component.

## Troubleshooting

### Common Issues

1. **Users not receiving invitations**: Check email configuration and spam filters
2. **Business creation fails**: Verify all required fields are filled
3. **User removal errors**: Ensure user exists and has proper permissions

### Debug Information

- Check browser console for JavaScript errors
- Verify API endpoint responses
- Review store state in Vue DevTools
- Check network requests in browser DevTools

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.
