<template>
  <div class="vfonts-demo p-6 space-y-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">
      VFonts Typography Demo
    </h2>

    <!-- Current Configuration -->
    <n-card title="Current Font Configuration" class="mb-8">
      <div class="space-y-4">
        <div>
          <h4 class="text-lg font-semibold mb-2">Primary Font (Lato)</h4>
          <p class="text-base">
            This is using the Lato font family for regular text. It provides
            excellent readability and modern appearance.
          </p>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-2">Monospace Font (FiraCode)</h4>
          <code class="bg-gray-100 p-2 rounded font-mono">
            const example = "This is FiraCode monospace font - perfect for
            code!";
          </code>
        </div>
      </div>
    </n-card>

    <!-- Available VFonts -->
    <n-card title="Available VFonts Families">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Sans Serif Fonts -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-blue-600">
            Sans Serif Fonts
          </h4>
          <div class="space-y-4">
            <div class="font-sample" style="font-family: 'Lato', sans-serif">
              <strong>Lato</strong> - The quick brown fox jumps over the lazy
              dog. (Currently Active)
            </div>
            <div class="font-sample" style="font-family: 'Inter', sans-serif">
              <strong>Inter</strong> - The quick brown fox jumps over the lazy
              dog.
            </div>
            <div
              class="font-sample"
              style="font-family: 'Open Sans', sans-serif"
            >
              <strong>Open Sans</strong> - The quick brown fox jumps over the
              lazy dog.
            </div>
            <div class="font-sample" style="font-family: 'Roboto', sans-serif">
              <strong>Roboto</strong> - The quick brown fox jumps over the lazy
              dog.
            </div>
          </div>
        </div>

        <!-- Monospace Fonts -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-green-600">
            Monospace Fonts
          </h4>
          <div class="space-y-4">
            <div
              class="font-sample font-mono"
              style="font-family: 'FiraCode', monospace"
            >
              <strong>FiraCode</strong> - const variable = "Hello World";
              (Currently Active)
            </div>
            <div
              class="font-sample font-mono"
              style="font-family: 'JetBrains Mono', monospace"
            >
              <strong>JetBrains Mono</strong> - const variable = "Hello World";
            </div>
            <div
              class="font-sample font-mono"
              style="font-family: 'Source Code Pro', monospace"
            >
              <strong>Source Code Pro</strong> - const variable = "Hello World";
            </div>
          </div>
        </div>
      </div>
    </n-card>

    <!-- Naive UI Components with Fonts -->
    <n-card title="Naive UI Components Typography">
      <div class="space-y-6">
        <!-- Buttons -->
        <div>
          <h4 class="text-lg font-semibold mb-3">Buttons</h4>
          <n-space>
            <n-button type="default">Default Button</n-button>
            <n-button type="primary">Primary Button</n-button>
            <n-button type="success">Success Button</n-button>
            <n-button type="warning">Warning Button</n-button>
          </n-space>
        </div>

        <!-- Typography Elements -->
        <div>
          <h4 class="text-lg font-semibold mb-3">Typography Scale</h4>
          <div class="space-y-3">
            <h1 class="text-4xl font-bold">Heading 1 - Large Title</h1>
            <h2 class="text-3xl font-semibold">Heading 2 - Section Title</h2>
            <h3 class="text-2xl font-medium">Heading 3 - Subsection</h3>
            <h4 class="text-xl font-medium">Heading 4 - Component Title</h4>
            <p class="text-base">
              Body text - Regular paragraph content with good readability.
            </p>
            <p class="text-sm text-gray-600">
              Small text - Secondary information and captions.
            </p>
          </div>
        </div>

        <!-- Code Examples -->
        <div>
          <h4 class="text-lg font-semibold mb-3">Code Typography</h4>
          <n-code language="javascript" :code="codeExample" class="mb-4" />
          <p>Inline code: <n-text code>npm install vfonts</n-text></p>
        </div>

        <!-- Form Elements -->
        <div>
          <h4 class="text-lg font-semibold mb-3">Form Elements</h4>
          <div class="space-y-4 max-w-md">
            <n-input placeholder="Input field with Lato font" />
            <n-select
              :options="[
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' },
              ]"
              placeholder="Select with consistent typography"
            />
            <n-button type="primary" block>Submit Form</n-button>
          </div>
        </div>
      </div>
    </n-card>

    <!-- Font Usage Instructions -->
    <n-card title="How to Use Different VFonts">
      <div class="space-y-4">
        <p class="text-base">
          To use different fonts from vfonts, import them in your main.js:
        </p>

        <n-code language="javascript" :code="importExample" class="mb-4" />

        <p class="text-base">Available fonts to import:</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 class="font-semibold mb-2">Sans Serif:</h5>
            <ul class="space-y-1 text-sm">
              <li><code>'vfonts/Lato.css'</code></li>
              <li><code>'vfonts/Inter.css'</code></li>
              <li><code>'vfonts/OpenSans.css'</code></li>
              <li><code>'vfonts/Roboto.css'</code></li>
            </ul>
          </div>
          <div>
            <h5 class="font-semibold mb-2">Monospace:</h5>
            <ul class="space-y-1 text-sm">
              <li><code>'vfonts/FiraCode.css'</code></li>
              <li><code>'vfonts/JetBrainsMono.css'</code></li>
              <li><code>'vfonts/SourceCodePro.css'</code></li>
            </ul>
          </div>
        </div>

        <p class="text-base mt-4">
          Then configure them in your App.vue theme overrides:
        </p>

        <n-code language="javascript" :code="configExample" class="mb-4" />
      </div>
    </n-card>
  </div>
</template>

<script setup>
const codeExample = `// Example JavaScript code with FiraCode
function calculateTotal(items) {
  return items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
}

const result = calculateTotal([
  { price: 10.99, quantity: 2 },
  { price: 5.50, quantity: 1 }
]);`;

const importExample = `// In src/main.js
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'
// Or try other fonts:
// import 'vfonts/Inter.css'
// import 'vfonts/JetBrainsMono.css'`;

const configExample = `// In App.vue
const themeOverrides = {
  common: {
    fontFamily: 'Lato, sans-serif',
    fontFamilyMono: 'FiraCode, Monaco, consolas, Courier New, monospace'
  }
}`;
</script>

<style scoped>
.vfonts-demo {
  max-width: 1000px;
  margin: 0 auto;
}

.font-sample {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #f9fafb;
  font-size: 16px;
  line-height: 1.5;
}

code {
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "FiraCode", Monaco, consolas, "Courier New", monospace;
}
</style>
