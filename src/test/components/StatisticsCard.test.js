import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import StatisticsCard from "@/components/StatisticsCard.vue";

describe("StatisticsCard", () => {
  it("renders properly with required props", () => {
    const wrapper = mount(StatisticsCard, {
      props: {
        label: "Total Users",
        value: 1234,
        icon: "fas fa-users",
      },
    });

    expect(wrapper.text()).toContain("Total Users");
    expect(wrapper.text()).toContain("1234");
    expect(wrapper.find("i").classes()).toContain("fas");
    expect(wrapper.find("i").classes()).toContain("fa-users");
  });

  it("applies the correct variant styling", () => {
    const wrapper = mount(StatisticsCard, {
      props: {
        label: "Test Label",
        value: 100,
        icon: "fas fa-test",
        variant: "green",
      },
    });

    const iconWrapper = wrapper.find(".p-3.rounded-full");
    expect(iconWrapper.classes()).toContain("bg-green-100");

    const icon = wrapper.find("i");
    expect(icon.classes()).toContain("text-green-600");
  });

  it("renders subtitle when provided", () => {
    const wrapper = mount(StatisticsCard, {
      props: {
        label: "Revenue",
        value: "$50,000",
        icon: "fas fa-dollar-sign",
        subtitle: "+12% from last month",
      },
    });

    expect(wrapper.text()).toContain("+12% from last month");
  });

  it("handles different value types", () => {
    // Test with string value
    const stringWrapper = mount(StatisticsCard, {
      props: {
        label: "Status",
        value: "Active",
        icon: "fas fa-check",
      },
    });
    expect(stringWrapper.text()).toContain("Active");

    // Test with number value
    const numberWrapper = mount(StatisticsCard, {
      props: {
        label: "Count",
        value: 42,
        icon: "fas fa-hash",
      },
    });
    expect(numberWrapper.text()).toContain("42");
  });

  it("applies custom subtitle class when provided", () => {
    const customSubtitleClass = "text-lg text-red-500";
    const wrapper = mount(StatisticsCard, {
      props: {
        label: "Errors",
        value: 5,
        icon: "fas fa-exclamation",
        subtitle: "Critical issues",
        subtitleClass: customSubtitleClass,
      },
    });

    const subtitle = wrapper.find("p:last-child");
    expect(subtitle.classes()).toContain("text-lg");
    expect(subtitle.classes()).toContain("text-red-500");
  });

  it("validates variant prop correctly", () => {
    const validVariants = ["blue", "green", "yellow", "red", "purple", "gray"];

    validVariants.forEach((variant) => {
      const wrapper = mount(StatisticsCard, {
        props: {
          label: "Test",
          value: 123,
          icon: "fas fa-test",
          variant,
        },
      });
      expect(wrapper.vm.variant).toBe(variant);
    });
  });
});
