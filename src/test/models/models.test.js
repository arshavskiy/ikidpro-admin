import { describe, it, expect } from "vitest";
import {
  timeRangeOptions,
  eventTypeOptions,
  shouldHideEventType,
  distributionMap,
  distKeyToEventTypes,
  getDefaultAnalytics,
  defaultEventForm,
} from "@/models/models.js";

describe("Models/Constants", () => {
  describe("timeRangeOptions", () => {
    it("should have correct structure", () => {
      expect(Array.isArray(timeRangeOptions)).toBe(true);
      expect(timeRangeOptions.length).toBeGreaterThan(0);

      timeRangeOptions.forEach((option) => {
        expect(option).toHaveProperty("label");
        expect(option).toHaveProperty("value");
        expect(typeof option.label).toBe("string");
        expect(typeof option.value).toBe("string");
      });
    });

    it("should include standard time ranges", () => {
      const values = timeRangeOptions.map((opt) => opt.value);
      expect(values).toContain("7");
      expect(values).toContain("30");
      expect(values).toContain("365");
    });
  });

  describe("eventTypeOptions", () => {
    it("should include all sensor types", () => {
      const values = eventTypeOptions.map((opt) => opt.value);

      // Check for key sensor types
      expect(values).toContain("HeartRate");
      expect(values).toContain("Temperature");
      expect(values).toContain("HRV");
      expect(values).toContain("Sp02");
      expect(values).toContain("humidity");
      expect(values).toContain("respiratoryRate");
    });

    it("should have proper structure", () => {
      eventTypeOptions.forEach((option) => {
        expect(option).toHaveProperty("value");
        expect(option).toHaveProperty("label");
        expect(typeof option.value).toBe("string");
        expect(typeof option.label).toBe("string");
      });
    });
  });

  describe("shouldHideEventType", () => {
    it("should hide GPS-related types", () => {
      expect(shouldHideEventType("gps")).toBe(true);
      expect(shouldHideEventType("latitude")).toBe(true);
      expect(shouldHideEventType("longitude")).toBe(true);
      expect(shouldHideEventType("altitude")).toBe(true);
    });

    it("should hide motion sensor types", () => {
      expect(shouldHideEventType("AccelX")).toBe(true);
      expect(shouldHideEventType("GyroY")).toBe(true);
      expect(shouldHideEventType("magneticZ")).toBe(true);
    });

    it("should not hide main sensor types", () => {
      expect(shouldHideEventType("HeartRate")).toBe(false);
      expect(shouldHideEventType("Temperature")).toBe(false);
      expect(shouldHideEventType("HRV")).toBe(false);
      expect(shouldHideEventType("humidity")).toBe(false);
    });

    it("should handle null/undefined values", () => {
      expect(shouldHideEventType(null)).toBe(false);
      expect(shouldHideEventType(undefined)).toBe(false);
      expect(shouldHideEventType("")).toBe(false);
    });
  });

  describe("distributionMap", () => {
    it("should have proper structure for each entry", () => {
      Object.keys(distributionMap).forEach((key) => {
        const entry = distributionMap[key];
        expect(entry).toHaveProperty("distKey");
        expect(entry).toHaveProperty("label");
        expect(entry).toHaveProperty("icon");
        expect(entry).toHaveProperty("iconClass");
        expect(entry).toHaveProperty("bgClass");
        expect(entry).toHaveProperty("barClass");
      });
    });

    it("should include key sensor types", () => {
      expect(distributionMap).toHaveProperty("HeartRate");
      expect(distributionMap).toHaveProperty("Temperature");
      expect(distributionMap).toHaveProperty("humidity");
      expect(distributionMap).toHaveProperty("respiratoryRate");
    });
  });

  describe("distKeyToEventTypes", () => {
    it("should map distribution keys to event type arrays", () => {
      Object.keys(distKeyToEventTypes).forEach((key) => {
        const eventTypes = distKeyToEventTypes[key];
        expect(Array.isArray(eventTypes)).toBe(true);
        expect(eventTypes.length).toBeGreaterThan(0);
      });
    });

    it("should include key mappings", () => {
      expect(distKeyToEventTypes.heartRate).toContain("HeartRate");
      expect(distKeyToEventTypes.humidity).toContain("humidity");
      expect(distKeyToEventTypes.respiratoryRate).toContain("respiratoryRate");
    });
  });

  describe("getDefaultAnalytics", () => {
    it("should return a complete analytics object", () => {
      const analytics = getDefaultAnalytics();

      expect(analytics).toHaveProperty("totalEvents");
      expect(analytics).toHaveProperty("activeChildren");
      expect(analytics).toHaveProperty("sensorDistribution");
      expect(analytics).toHaveProperty("heartRate");
      expect(analytics).toHaveProperty("temperature");

      expect(typeof analytics.totalEvents).toBe("number");
      expect(typeof analytics.activeChildren).toBe("number");
      expect(typeof analytics.sensorDistribution).toBe("object");
    });

    it("should include all sensor distribution keys", () => {
      const analytics = getDefaultAnalytics();
      const sensorDist = analytics.sensorDistribution;

      expect(sensorDist).toHaveProperty("heartRate");
      expect(sensorDist).toHaveProperty("humidity");
      expect(sensorDist).toHaveProperty("respiratoryRate");
      expect(sensorDist).toHaveProperty("spo2");
      expect(sensorDist).toHaveProperty("scl");
      expect(sensorDist).toHaveProperty("scr");
    });
  });

  describe("defaultEventForm", () => {
    it("should have all required fields", () => {
      expect(defaultEventForm).toHaveProperty("aid");
      expect(defaultEventForm).toHaveProperty("Timestamp");
      expect(defaultEventForm).toHaveProperty("HeartRate");
      expect(defaultEventForm).toHaveProperty("Temperature");
    });

    it("should include new sensor fields", () => {
      expect(defaultEventForm).toHaveProperty("Sp02");
      expect(defaultEventForm).toHaveProperty("humidity");
      expect(defaultEventForm).toHaveProperty("respiratoryRate");
      expect(defaultEventForm).toHaveProperty("scl");
      expect(defaultEventForm).toHaveProperty("scr");
    });

    it("should initialize numeric fields as null", () => {
      expect(defaultEventForm.HeartRate).toBeNull();
      expect(defaultEventForm.Temperature).toBeNull();
      expect(defaultEventForm.Sp02).toBeNull();
      expect(defaultEventForm.humidity).toBeNull();
    });

    it("should initialize string fields appropriately", () => {
      expect(typeof defaultEventForm.aid).toBe("string");
      expect(typeof defaultEventForm.Timestamp).toBe("string");
    });
  });
});
