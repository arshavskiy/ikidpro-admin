# Naive UI Integration Guide

## Overview

Naive UI has been successfully added to the IkidPro Admin project. This guide explains how to use Naive UI components throughout the application.

## Installation

Naive UI is already installed and configured in:

- `package.json` - Added as a dependency
- `src/main.js` - Configured globally

## Usage

### Basic Import (Global)

Since Naive UI is registered globally, you can use components directly in any Vue component:

```vue
<template>
  <n-button type="primary">Click me</n-button>
  <n-input v-model:value="inputValue" placeholder="Enter text" />
</template>
```

### Composables

Use Naive UI composables for notifications and dialogs:

```vue
<script setup>
import { useMessage, useDialog, useNotification } from "naive-ui";

const message = useMessage();
const dialog = useDialog();
const notification = useNotification();

const showSuccess = () => {
  message.success("Operation successful!");
};

const showConfirm = () => {
  dialog.warning({
    title: "Confirm",
    content: "Are you sure?",
    positiveText: "Yes",
    negativeText: "No",
    onPositiveClick: () => {
      message.success("Confirmed!");
    },
  });
};
</script>
```

## Available Components

### Form Components

- `n-input` - Text input
- `n-input-number` - Number input
- `n-select` - Select dropdown
- `n-date-picker` - Date picker
- `n-checkbox` - Checkbox
- `n-radio` - Radio button
- `n-switch` - Toggle switch
- `n-slider` - Range slider

### Display Components

- `n-button` - Button
- `n-card` - Card container
- `n-table` / `n-data-table` - Tables
- `n-list` - Lists
- `n-descriptions` - Description lists
- `n-statistic` - Statistics display

### Navigation

- `n-menu` - Navigation menu
- `n-tabs` - Tab navigation
- `n-breadcrumb` - Breadcrumbs
- `n-pagination` - Pagination

### Feedback

- `n-alert` - Alert messages
- `n-progress` - Progress bars
- `n-spin` - Loading spinner
- `n-skeleton` - Loading skeleton

### Layout

- `n-layout` - Layout system
- `n-grid` / `n-grid-item` - Grid system
- `n-space` - Spacing utilities
- `n-divider` - Dividers

## Demo Route

A comprehensive demo of Naive UI components is available at:

- Route: `/admin/demo/naive-ui`
- Component: `src/components/NaiveUIDemo.vue`

## Best Practices

1. **Consistent Theming**: Use Naive UI's theme system for consistent styling
2. **Form Validation**: Leverage `n-form` with built-in validation
3. **Accessibility**: Naive UI components are accessible by default
4. **Performance**: Use dynamic imports for large components when needed

## Integration with Existing Code

### Replace HTML Elements

```vue
<!-- Before (HTML) -->
<button class="btn btn-primary">Submit</button>
<input type="text" class="form-control" />

<!-- After (Naive UI) -->
<n-button type="primary">Submit</n-button>
<n-input placeholder="Enter text" />
```

### Enhance Existing Forms

```vue
<!-- Enhanced form with Naive UI -->
<n-form ref="formRef" :model="formData" :rules="rules">
  <n-form-item label="Name" path="name">
    <n-input v-model:value="formData.name" />
  </n-form-item>
  <n-form-item label="Email" path="email">
    <n-input v-model:value="formData.email" />
  </n-form-item>
  <n-form-item>
    <n-button type="primary" @click="handleSubmit">
      Submit
    </n-button>
  </n-form-item>
</n-form>
```

## Theme Configuration

To customize the theme, modify `src/main.js`:

```javascript
import { NConfigProvider } from 'naive-ui'

// Custom theme
const themeOverrides = {
  common: {
    primaryColor: '#18a058'
  }
}

// In template
<NConfigProvider :theme-overrides="themeOverrides">
  <App />
</NConfigProvider>
```

## Resources

- [Naive UI Documentation](https://www.naiveui.com/)
- [Component Examples](https://www.naiveui.com/en-US/os-theme/components)
- [Theme Customization](https://www.naiveui.com/en-US/os-theme/docs/customize-theme)

## VFonts Typography

### Overview

VFonts provides high-quality web fonts optimized for Naive UI components. The project includes:

- **Lato** - Primary sans-serif font (currently active)
- **FiraCode** - Monospace font for code (currently active)

### Configuration

VFonts is configured in:

- `src/main.js` - Font CSS imports
- `src/App.vue` - Theme overrides with font families

### Available Fonts

#### Sans Serif Options:

```javascript
import "vfonts/Lato.css"; // Clean, professional
import "vfonts/Inter.css"; // Modern, versatile
import "vfonts/OpenSans.css"; // Readable, friendly
import "vfonts/Roboto.css"; // Google's material design
```

#### Monospace Options:

```javascript
import "vfonts/FiraCode.css"; // Programming ligatures
import "vfonts/JetBrainsMono.css"; // Developer-focused
import "vfonts/SourceCodePro.css"; // Adobe's code font
```

### Changing Fonts

1. Import desired fonts in `src/main.js`
2. Update theme overrides in `src/App.vue`:

```javascript
const themeOverrides = {
  common: {
    fontFamily: "Inter, sans-serif", // Primary font
    fontFamilyMono: "JetBrains Mono, monospace", // Code font
  },
};
```

### Demo Routes

- **Naive UI Components**: `/admin/demo/naive-ui`
- **VFonts Typography**: `/admin/demo/vfonts`
