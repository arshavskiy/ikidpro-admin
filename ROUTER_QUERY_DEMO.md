# Router Query Parameter Demo

## Feature Implementation

The CsvExporter component now supports initialization via query parameters in the URL.

## Usage Examples

1. **Navigate to Events Export:**

   ```javascript
   router.push("/admin/data/export?type=events");
   ```

   This will automatically select "Events" in the data type dropdown and pre-select default event fields.

2. **Navigate to Users Export:**

   ```javascript
   router.push("/admin/data/export?type=users");
   ```

   This will automatically select "Users" in the data type dropdown.

3. **Navigate to Children Export:**
   ```javascript
   router.push("/admin/data/export?type=children");
   ```
   This will automatically select "Children" in the data type dropdown.

## Implementation Details

### Changes Made:

1. **Added imports:**

   - `onMounted` from Vue composition API
   - `useRoute` from Vue Router

2. **Added initialization logic:**

   ```javascript
   onMounted(() => {
     const typeFromQuery = route.query.type;
     if (
       typeFromQuery &&
       ["users", "children", "events"].includes(typeFromQuery)
     ) {
       selectedDataType.value = typeFromQuery;
     }
   });
   ```

3. **Validation:**
   - Only accepts valid data types: 'users', 'children', 'events'
   - Ignores invalid or missing query parameters

### Behavior:

- When the component mounts, it checks for a `type` query parameter
- If a valid type is found, it sets the `selectedDataType`
- The existing `watch` handler then automatically selects default fields
- If no query parameter or invalid type, the component behaves as before

## Testing

You can test this functionality by:

1. Navigating directly to: `/admin/data/export?type=events`
2. The Events option should be pre-selected
3. Default event fields should be automatically checked
4. The component should be ready for immediate use

## Backward Compatibility

This change is fully backward compatible - existing usage without query parameters continues to work exactly as before.
