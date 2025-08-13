// Rules Engine Controller - Business logic for rule management and evaluation

import { bodyMetricOptions } from "@/models/models";

/**
 * Validates a rule object structure
 * @param {Object} rule - The rule to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export function validateRule(rule) {
  const errors = [];

  if (
    !rule.name ||
    typeof rule.name !== "string" ||
    rule.name.trim().length === 0
  ) {
    errors.push("Rule name is required");
  }

  if (!rule.metric || typeof rule.metric !== "string") {
    errors.push("Metric is required");
  } else {
    const validMetrics = bodyMetricOptions.map((option) => option.value);
    if (!validMetrics.includes(rule.metric)) {
      errors.push(`Invalid metric: ${rule.metric}`);
    }
  }

  if (!rule.operator || typeof rule.operator !== "string") {
    errors.push("Operator is required");
  } else {
    const validOperators = [">", ">=", "<", "<=", "==", "!="];
    if (!validOperators.includes(rule.operator)) {
      errors.push(`Invalid operator: ${rule.operator}`);
    }
  }

  if (
    rule.threshold === null ||
    rule.threshold === undefined ||
    typeof rule.threshold !== "number"
  ) {
    errors.push("Threshold must be a number");
  }

  if (
    !rule.label ||
    typeof rule.label !== "string" ||
    rule.label.trim().length === 0
  ) {
    errors.push("Label is required");
  }

  if (rule.enabled !== undefined && typeof rule.enabled !== "boolean") {
    errors.push("Enabled must be a boolean");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Evaluates a single rule against an event
 * @param {Object} rule - The rule to evaluate
 * @param {Object} event - The event data to check against
 * @returns {Object} - { triggered: boolean, value: any, rule: Object }
 */
export function evaluateRule(rule, event) {
  if (!rule.enabled) {
    return { triggered: false, value: null, rule };
  }

  const value = getEventValue(event, rule.metric);

  if (value === null || value === undefined) {
    return { triggered: false, value: null, rule };
  }

  const triggered = compareValues(value, rule.operator, rule.threshold);

  return {
    triggered,
    value,
    rule,
    timestamp: event.Timestamp || new Date().toISOString(),
    eventId: event._id || event.id,
    childId: event.aid,
    parentId: event.parentId,
  };
}

/**
 * Evaluates multiple rules against an event
 * @param {Array} rules - Array of rules to evaluate
 * @param {Object} event - The event data to check against
 * @returns {Array} - Array of evaluation results for triggered rules only
 */
export function evaluateRules(rules, event) {
  if (!Array.isArray(rules) || !event) {
    return [];
  }

  return rules
    .map((rule) => evaluateRule(rule, event))
    .filter((result) => result.triggered);
}

/**
 * Evaluates rules against multiple events
 * @param {Array} rules - Array of rules to evaluate
 * @param {Array} events - Array of events to check
 * @returns {Array} - Array of all triggered rule evaluations
 */
export function evaluateRulesForEvents(rules, events) {
  if (!Array.isArray(rules) || !Array.isArray(events)) {
    return [];
  }

  const results = [];

  for (const event of events) {
    const eventResults = evaluateRules(rules, event);
    results.push(...eventResults);
  }

  return results;
}

/**
 * Gets the value of a metric from an event object
 * @param {Object} event - The event object
 * @param {string} metric - The metric name to extract
 * @returns {any} - The metric value or null if not found
 */
export function getEventValue(event, metric) {
  if (!event || !metric) {
    return null;
  }

  // Handle special cases and field mappings
  switch (metric) {
    case "Temperature":
      return event.Temperature ?? event.TemperatureC ?? null;
    case "Sp02":
      return event.Sp02 ?? event.spo2 ?? null;
    case "speed_mps":
      return event.speed_mps ?? event.speed ?? null;
    case "motion":
      // Calculate motion magnitude from accelerometer values
      const x = event.AccelX ?? 0;
      const y = event.AccelY ?? 0;
      const z = event.AccelZ ?? 0;
      return Math.sqrt(x * x + y * y + z * z);
    default:
      return event[metric] ?? null;
  }
}

/**
 * Compares two values using the specified operator
 * @param {any} value - The actual value
 * @param {string} operator - The comparison operator
 * @param {any} threshold - The threshold value to compare against
 * @returns {boolean} - True if the comparison is satisfied
 */
export function compareValues(value, operator, threshold) {
  if (
    value === null ||
    value === undefined ||
    threshold === null ||
    threshold === undefined
  ) {
    return false;
  }

  // Convert to numbers if possible
  const numValue = Number(value);
  const numThreshold = Number(threshold);

  // Use numeric comparison if both are valid numbers
  if (!isNaN(numValue) && !isNaN(numThreshold)) {
    switch (operator) {
      case ">":
        return numValue > numThreshold;
      case ">=":
        return numValue >= numThreshold;
      case "<":
        return numValue < numThreshold;
      case "<=":
        return numValue <= numThreshold;
      case "==":
        return numValue === numThreshold;
      case "!=":
        return numValue !== numThreshold;
      default:
        return false;
    }
  }

  // Fall back to string comparison
  switch (operator) {
    case "==":
      return value === threshold;
    case "!=":
      return value !== threshold;
    default:
      return false;
  }
}

/**
 * Groups rule evaluation results by rule
 * @param {Array} results - Array of rule evaluation results
 * @returns {Object} - Object with rule IDs as keys and arrays of results as values
 */
export function groupResultsByRule(results) {
  if (!Array.isArray(results)) {
    return {};
  }

  return results.reduce((groups, result) => {
    const ruleId = result.rule._id || result.rule.id || "unknown";
    if (!groups[ruleId]) {
      groups[ruleId] = [];
    }
    groups[ruleId].push(result);
    return groups;
  }, {});
}

/**
 * Groups rule evaluation results by child
 * @param {Array} results - Array of rule evaluation results
 * @returns {Object} - Object with child IDs as keys and arrays of results as values
 */
export function groupResultsByChild(results) {
  if (!Array.isArray(results)) {
    return {};
  }

  return results.reduce((groups, result) => {
    const childId = result.childId || "unknown";
    if (!groups[childId]) {
      groups[childId] = [];
    }
    groups[childId].push(result);
    return groups;
  }, {});
}

/**
 * Generates a summary of rule evaluations
 * @param {Array} results - Array of rule evaluation results
 * @returns {Object} - Summary statistics
 */
export function generateRuleSummary(results) {
  if (!Array.isArray(results)) {
    return {
      totalTriggered: 0,
      uniqueRules: 0,
      uniqueChildren: 0,
      ruleBreakdown: {},
      childBreakdown: {},
    };
  }

  const uniqueRules = new Set();
  const uniqueChildren = new Set();
  const ruleBreakdown = {};
  const childBreakdown = {};

  for (const result of results) {
    const ruleId = result.rule._id || result.rule.id || "unknown";
    const childId = result.childId || "unknown";

    uniqueRules.add(ruleId);
    uniqueChildren.add(childId);

    ruleBreakdown[ruleId] = (ruleBreakdown[ruleId] || 0) + 1;
    childBreakdown[childId] = (childBreakdown[childId] || 0) + 1;
  }

  return {
    totalTriggered: results.length,
    uniqueRules: uniqueRules.size,
    uniqueChildren: uniqueChildren.size,
    ruleBreakdown,
    childBreakdown,
  };
}

/**
 * Formats a rule for display
 * @param {Object} rule - The rule object
 * @returns {string} - Human-readable rule description
 */
export function formatRuleDescription(rule) {
  if (!rule) {
    return "Invalid rule";
  }

  const metricOption = bodyMetricOptions.find(
    (option) => option.value === rule.metric
  );
  const metricLabel = metricOption ? metricOption.label : rule.metric;

  return `${metricLabel} ${rule.operator} ${rule.threshold}`;
}

/**
 * Gets suggested threshold values for a metric based on typical ranges
 * @param {string} metric - The metric name
 * @returns {Object} - Object with min, max, and suggested values
 */
export function getSuggestedThresholds(metric) {
  const thresholds = {
    HeartRate: { min: 40, max: 200, suggestions: [60, 100, 120, 160] },
    HRV: { min: 0, max: 100, suggestions: [20, 40, 60, 80] },
    Sp02: { min: 70, max: 100, suggestions: [90, 95, 98] },
    Temperature: { min: 30, max: 45, suggestions: [36, 37.5, 38, 39] },
    EDA: { min: 0, max: 10, suggestions: [1, 3, 5, 7] },
    scl: { min: 0, max: 10, suggestions: [1, 3, 5] },
    scr: { min: 0, max: 5, suggestions: [0.5, 1, 2] },
    respiratoryRate: { min: 5, max: 40, suggestions: [12, 16, 20, 25] },
    SoundLevel: { min: 0, max: 120, suggestions: [30, 50, 70, 85] },
    humidity: { min: 0, max: 100, suggestions: [30, 50, 70, 90] },
    pressure: { min: 900, max: 1100, suggestions: [1000, 1013, 1020] },
    light: { min: 0, max: 100000, suggestions: [100, 500, 1000, 10000] },
    steps: { min: 0, max: 50000, suggestions: [1000, 5000, 10000, 15000] },
    calories: { min: 0, max: 5000, suggestions: [200, 500, 1000, 2000] },
  };

  return (
    thresholds[metric] || { min: 0, max: 100, suggestions: [10, 25, 50, 75] }
  );
}

/**
 * Creates a default rule template
 * @param {string} metric - The metric name
 * @returns {Object} - Default rule object
 */
export function createDefaultRule(metric = "Temperature") {
  const suggestions = getSuggestedThresholds(metric);
  const metricOption = bodyMetricOptions.find(
    (option) => option.value === metric
  );
  const metricLabel = metricOption ? metricOption.label : metric;

  return {
    name: `${metricLabel} Alert`,
    metric,
    operator: ">",
    threshold: suggestions.suggestions[suggestions.suggestions.length - 1],
    label: `High ${metricLabel}`,
    description: `Alert when ${metricLabel.toLowerCase()} exceeds normal range`,
    enabled: true,
    aid: null,
    parentId: null,
  };
}

export default {
  validateRule,
  evaluateRule,
  evaluateRules,
  evaluateRulesForEvents,
  getEventValue,
  compareValues,
  groupResultsByRule,
  groupResultsByChild,
  generateRuleSummary,
  formatRuleDescription,
  getSuggestedThresholds,
  createDefaultRule,
};
