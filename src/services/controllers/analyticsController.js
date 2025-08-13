// Centralized analytics helpers moved out of components

export function eventHasType(event, type) {
  switch (type) {
    case "HeartRate":
      return event.HeartRate !== null && event.HeartRate !== undefined;
    case "HRV":
      return event.HRV !== null && event.HRV !== undefined;
    case "Sp02":
      return (
        (event.Sp02 !== null && event.Sp02 !== undefined) ||
        (event.spo2 !== null && event.spo2 !== undefined)
      );
    case "AccelX":
      return event.AccelX !== null && event.AccelX !== undefined;
    case "AccelY":
      return event.AccelY !== null && event.AccelY !== undefined;
    case "AccelZ":
      return event.AccelZ !== null && event.AccelZ !== undefined;
    case "GyroX":
      return event.GyroX !== null && event.GyroX !== undefined;
    case "GyroY":
      return event.GyroY !== null && event.GyroY !== undefined;
    case "GyroZ":
      return event.GyroZ !== null && event.GyroZ !== undefined;
    case "EDA":
      return event.EDA !== null && event.EDA !== undefined;
    case "Temperature":
    case "TemperatureC":
      return (
        (event.Temperature !== null && event.Temperature !== undefined) ||
        (event.TemperatureC !== null && event.TemperatureC !== undefined)
      );
    case "SoundLevel":
      return event.SoundLevel !== null && event.SoundLevel !== undefined;
    case "scl":
      return event.scl !== null && event.scl !== undefined;
    case "scr":
      return event.scr !== null && event.scr !== undefined;
    case "respiratoryRate":
      return (
        event.respiratoryRate !== null && event.respiratoryRate !== undefined
      );
    case "humidity":
      return event.humidity !== null && event.humidity !== undefined;
    case "latitude":
      return event.latitude !== null && event.latitude !== undefined;
    case "longitude":
      return event.longitude !== null && event.longitude !== undefined;
    case "altitude":
      return event.altitude !== null && event.altitude !== undefined;
    case "speed_mps":
      return event.speed_mps !== null && event.speed_mps !== undefined;
    case "bearing_deg":
      return event.bearing_deg !== null && event.bearing_deg !== undefined;
    case "accuracy_m":
      return event.accuracy_m !== null && event.accuracy_m !== undefined;
    case "satellites":
      return event.satellites !== null && event.satellites !== undefined;
    case "steps":
      return event.steps !== null && event.steps !== undefined;
    case "calories":
      return event.calories !== null && event.calories !== undefined;
    case "magneticX":
      return event.magneticX !== null && event.magneticX !== undefined;
    case "magneticY":
      return event.magneticY !== null && event.magneticY !== undefined;
    case "magneticZ":
      return event.magneticZ !== null && event.magneticZ !== undefined;
    case "pressure":
      return event.pressure !== null && event.pressure !== undefined;
    case "light":
      return event.light !== null && event.light !== undefined;
    case "gps":
      return event.latitude && event.longitude;
    case "motion":
      return event.AccelX || event.AccelY || event.AccelZ;
    case "mood":
      return (
        event.mood !== null && event.mood !== undefined && event.mood !== ""
      );
    default:
      return true;
  }
}

export function calculateDailyTrend(events, days) {
  const trend = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.Timestamp);
      return eventDate.toDateString() === date.toDateString();
    });
    trend.push(dayEvents.length);
  }
  return trend;
}

export function calculateEventTimeline(events, days) {
  const timeline = [];
  const dataPoints = Math.min(days <= 7 ? days * 4 : days, 100);
  const intervalHours = days <= 7 ? 6 : 24;

  for (let i = dataPoints - 1; i >= 0; i--) {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() - i * intervalHours);
    const startTime = new Date(endTime);
    startTime.setHours(startTime.getHours() - intervalHours);

    const periodEvents = events.filter((event) => {
      const eventTime = new Date(event.Timestamp);
      return eventTime >= startTime && eventTime < endTime;
    });

    const heartRateEvents = periodEvents.filter((e) => e.HeartRate);
    const temperatureEvents = periodEvents.filter((e) => e.Temperature);
    const soundEvents = periodEvents.filter((e) => e.SoundLevel);
    const spo2Events = periodEvents.filter((e) => e.Sp02 || e.spo2);
    const sclEvents = periodEvents.filter((e) => e.scl);
    const scrEvents = periodEvents.filter((e) => e.scr);
    const respiratoryEvents = periodEvents.filter((e) => e.respiratoryRate);
    const humidityEvents = periodEvents.filter(
      (e) => e.humidity !== null && e.humidity !== undefined
    );
    const gpsEvents = periodEvents.filter((e) => e.latitude && e.longitude);
    const motionEvents = periodEvents.filter(
      (e) => e.AccelX || e.AccelY || e.AccelZ
    );

    const moodEvents = periodEvents.filter((e) => e.mood && e.mood !== "");
    const moodCount = {};
    for (const e of moodEvents) {
      if (e.mood) {
        moodCount[e.mood] = (moodCount[e.mood] || 0) + 1;
      }
    }

    timeline.push({
      timestamp: endTime.toISOString(),
      eventCount: periodEvents.length,
      heartRate:
        heartRateEvents.length > 0
          ? Math.round(
              heartRateEvents.reduce((sum, e) => sum + e.HeartRate, 0) /
                heartRateEvents.length
            )
          : 0,
      temperature:
        temperatureEvents.length > 0
          ? Math.round(
              (temperatureEvents.reduce((sum, e) => sum + e.Temperature, 0) /
                temperatureEvents.length) *
                10
            ) / 10
          : 0,
      soundLevel:
        soundEvents.length > 0
          ? Math.round(
              soundEvents.reduce((sum, e) => sum + e.SoundLevel, 0) /
                soundEvents.length
            )
          : 0,
      spo2:
        spo2Events.length > 0
          ? Math.round(
              (spo2Events.reduce((sum, e) => sum + (e.Sp02 ?? e.spo2), 0) /
                spo2Events.length) *
                10
            ) / 10
          : 0,
      scl:
        sclEvents.length > 0
          ? Math.round(
              (sclEvents.reduce((sum, e) => sum + e.scl, 0) /
                sclEvents.length) *
                10
            ) / 10
          : 0,
      scr:
        scrEvents.length > 0
          ? Math.round(
              (scrEvents.reduce((sum, e) => sum + e.scr, 0) /
                scrEvents.length) *
                10
            ) / 10
          : 0,
      respiratoryRate:
        respiratoryEvents.length > 0
          ? Math.round(
              (respiratoryEvents.reduce(
                (sum, e) => sum + e.respiratoryRate,
                0
              ) /
                respiratoryEvents.length) *
                10
            ) / 10
          : 0,
      humidity:
        humidityEvents.length > 0
          ? Math.round(
              (humidityEvents.reduce((sum, e) => sum + e.humidity, 0) /
                humidityEvents.length) *
                10
            ) / 10
          : 0,
      gpsCount: gpsEvents.length,
      motionCount: motionEvents.length,
      moodCount,
    });
  }

  return timeline;
}

export function calculateSensorValues(events, days) {
  const values = [];
  const sortedEvents = events
    .filter((event) => event.Timestamp)
    .sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));

  sortedEvents.forEach((event) => {
    const timestamp = new Date(event.Timestamp);
    values.push({
      timestamp: timestamp.toISOString(),
      heartRate: event.HeartRate || null,
      hrv: event.HRV || null,
      spo2: event.Sp02 ?? event.spo2 ?? null,
      scl: event.scl || null,
      scr: event.scr || null,
      respiratoryRate: event.respiratoryRate || null,
      humidity: event.humidity || null,
      accelX: event.AccelX || null,
      accelY: event.AccelY || null,
      accelZ: event.AccelZ || null,
      gyroX: event.GyroX || null,
      gyroY: event.GyroY || null,
      gyroZ: event.GyroZ || null,
      eda: event.EDA || null,
      temperatureC: event.TemperatureC || null,
      soundLevel: event.SoundLevel || null,
      latitude: event.latitude || null,
      longitude: event.longitude || null,
      altitude: event.altitude || null,
      speed_mps: event.speed_mps || null,
      bearing_deg: event.bearing_deg || null,
      accuracy_m: event.accuracy_m || null,
      satellites: event.satellites || null,
      steps: event.steps || null,
      calories: event.calories || null,
      speed: event.speed || null,
      magneticX: event.magneticX || null,
      magneticY: event.magneticY || null,
      magneticZ: event.magneticZ || null,
      pressure: event.pressure || null,
      light: event.light || null,
      gpsLat: event.latitude || null,
      gpsLng: event.longitude || null,
      temperature: event.TemperatureC || event.Temperature || null,
      eventId: event._id || event.id,
      childId: event.aid,
      batteryLevel: event.BatteryLevel || null,
      signalStrength: event.SignalStrength || null,
    });
  });

  const maxChartPoints = 1000;
  if (values.length > maxChartPoints) {
    const interval = Math.floor(values.length / maxChartPoints);
    const sampledForChart = [];
    for (let i = 0; i < values.length; i += interval) {
      sampledForChart.push(values[i]);
    }
    values.chartData = sampledForChart;
    values.fullData = values.slice();
  } else {
    values.chartData = values;
    values.fullData = values.slice();
  }

  return values;
}

export function generateHealthInsights(events, heartRates, temperatures) {
  const insights = [];
  if (heartRates.length > 0) {
    const avgHR = heartRates.reduce((a, b) => a + b, 0) / heartRates.length;
    if (avgHR > 100) {
      insights.push({
        id: 1,
        type: "warning",
        title: "High average heart rate",
        description: `${Math.round(avgHR)} BPM is above normal range.`,
      });
    } else if (avgHR < 60) {
      insights.push({
        id: 2,
        type: "info",
        title: "Low average heart rate",
        description: `${Math.round(avgHR)} BPM may indicate rest periods.`,
      });
    }
  }

  if (temperatures.length > 0) {
    const avgTemp =
      temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    if (avgTemp > 38) {
      insights.push({
        id: 3,
        type: "warning",
        title: "High average temperature",
        description: `${Math.round(avgTemp * 10) / 10}°C may indicate fever.`,
      });
    }
  }

  const recentEvents = events.filter((e) => {
    const eventDate = new Date(e.Timestamp);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return eventDate >= yesterday;
  });
  if (recentEvents.length === 0) {
    insights.push({
      id: 4,
      type: "warning",
      title: "No Recent Activity",
      description: "No sensor data received in the last 24 hours.",
    });
  }
  return insights;
}

export function calculateAnalytics(events, days) {
  const totalEvents = events.length;
  const uniqueChildren = [...new Set(events.map((e) => e.aid))].filter(Boolean);
  const heartRateEvents = events.filter((e) => e.HeartRate);
  const heartRates = heartRateEvents.map((e) => e.HeartRate);
  const temperatureEvents = events.filter((e) => e.Temperature);
  const temperatures = temperatureEvents.map((e) => e.Temperature);
  const dailyTrend = calculateDailyTrend(events, days);

  const hourlyData = events.reduce((acc, event) => {
    const hour = new Date(event.Timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});
  const peakHour = Object.keys(hourlyData).reduce(
    (a, b) => (hourlyData[a] > hourlyData[b] ? a : b),
    0
  );
  const hourlyDistribution = Array.from(
    { length: 24 },
    (_, hour) => hourlyData[hour] || 0
  );

  const gpsEvents = events.filter((e) => e.latitude && e.longitude).length;
  const soundEvents = events.filter((e) => e.SoundLevel).length;
  const spo2Events = events.filter((e) => e.Sp02 || e.spo2).length;
  const sclEvents = events.filter((e) => e.scl).length;
  const scrEvents = events.filter((e) => e.scr).length;
  const respiratoryRateEvents = events.filter((e) => e.respiratoryRate).length;
  const humidityEvents = events.filter(
    (e) => e.humidity !== null && e.humidity !== undefined
  ).length;
  const motionEvents = events.filter(
    (e) => e.AccelX || e.AccelY || e.AccelZ
  ).length;
  const edaEvents = events.filter((e) => e.EDA).length;
  const hRVEvents = events.filter((e) => e.HRV).length;
  const gyroEvents = events.filter((e) => e.GyroX || e.GyroY || e.GyroZ).length;
  const magneticEvents = events.filter(
    (e) => e.magneticX || e.magneticY || e.magneticZ
  ).length;
  const pressureEvents = events.filter((e) => e.pressure).length;
  const lightEvents = events.filter((e) => e.light).length;
  const stepsEvents = events.filter((e) => e.steps).length;
  const caloriesEvents = events.filter((e) => e.calories).length;
  const altitudeEvents = events.filter((e) => e.altitude).length;
  const speedEvents = events.filter((e) => e.speed_mps || e.speed).length;
  const moodEvents = events.filter((e) => e.mood).length;
  const bearingEvents = events.filter((e) => e.bearing_deg).length;
  const accuracyEvents = events.filter((e) => e.accuracy_m).length;
  const satellitesEvents = events.filter((e) => e.satellites).length;

  const childrenActivity = uniqueChildren
    .map((childId) => {
      const childEvents = events.filter((e) => e.aid === childId);
      const childHeartRates = childEvents
        .filter((e) => e.HeartRate)
        .map((e) => e.HeartRate);
      const avgHeartRate =
        childHeartRates.length > 0
          ? Math.round(
              childHeartRates.reduce((a, b) => a + b, 0) /
                childHeartRates.length
            )
          : 0;
      return {
        childId,
        eventCount: childEvents.length,
        avgHeartRate,
        activityScore: Math.min(
          100,
          Math.round((childEvents.length / (totalEvents || 1)) * 100 * 10)
        ),
      };
    })
    .sort((a, b) => b.eventCount - a.eventCount)
    .slice(0, 10);

  const eventTimeline = calculateEventTimeline(events, days);
  const sensorValues = calculateSensorValues(events, days);
  const healthInsights = generateHealthInsights(
    events,
    heartRates,
    temperatures
  );

  let moodCountEnum = {};
  for (const event of events) {
    if (event.mood && event.mood !== "") {
      moodCountEnum[event.mood] = (moodCountEnum[event.mood] || 0) + 1;
    }
  }

  return {
    totalEvents,
    activeChildren: uniqueChildren.length,
    avgDailyEvents: Math.round(totalEvents / (days || 1)),
    peakHour: parseInt(peakHour),
    heartRate: {
      average:
        heartRates.length > 0
          ? Math.round(
              heartRates.reduce((a, b) => a + b, 0) / heartRates.length
            )
          : 0,
      max: heartRates.length > 0 ? Math.max(...heartRates) : 0,
      min: heartRates.length > 0 ? Math.min(...heartRates) : 0,
      count: heartRates.length,
    },
    temperature: {
      average:
        temperatures.length > 0
          ? Math.round(
              (temperatures.reduce((a, b) => a + b, 0) / temperatures.length) *
                10
            ) / 10
          : 0,
      max: temperatures.length > 0 ? Math.max(...temperatures) : 0,
      min: temperatures.length > 0 ? Math.min(...temperatures) : 0,
      count: temperatures.length,
    },
    activity: {
      gpsCount: gpsEvents,
      soundCount: soundEvents,
      motionCount: motionEvents,
      avgSoundLevel:
        soundEvents > 0
          ? Math.round(
              events
                .filter((e) => e.SoundLevel)
                .reduce((acc, e) => acc + e.SoundLevel, 0) / soundEvents
            )
          : 0,
    },
    dailyTrend,
    hourlyDistribution,
    eventTimeline,
    sensorValues,
    sensorDistribution: {
      heartRate:
        totalEvents > 0
          ? Math.round((heartRateEvents.length / totalEvents) * 100)
          : 0,
      temperature:
        totalEvents > 0
          ? Math.round((temperatureEvents.length / totalEvents) * 100)
          : 0,
      spo2: totalEvents > 0 ? Math.round((spo2Events / totalEvents) * 100) : 0,
      scl: totalEvents > 0 ? Math.round((sclEvents / totalEvents) * 100) : 0,
      scr: totalEvents > 0 ? Math.round((scrEvents / totalEvents) * 100) : 0,
      respiratoryRate:
        totalEvents > 0
          ? Math.round((respiratoryRateEvents / totalEvents) * 100)
          : 0,
      humidity:
        totalEvents > 0 ? Math.round((humidityEvents / totalEvents) * 100) : 0,
      gps: totalEvents > 0 ? Math.round((gpsEvents / totalEvents) * 100) : 0,
      sound:
        totalEvents > 0 ? Math.round((soundEvents / totalEvents) * 100) : 0,
      motion:
        totalEvents > 0 ? Math.round((motionEvents / totalEvents) * 100) : 0,
      eda: totalEvents > 0 ? Math.round((edaEvents / totalEvents) * 100) : 0,
      hrv: totalEvents > 0 ? Math.round((hRVEvents / totalEvents) * 100) : 0,
      gyro: totalEvents > 0 ? Math.round((gyroEvents / totalEvents) * 100) : 0,
      magnetic:
        totalEvents > 0 ? Math.round((magneticEvents / totalEvents) * 100) : 0,
      pressure:
        totalEvents > 0 ? Math.round((pressureEvents / totalEvents) * 100) : 0,
      light:
        totalEvents > 0 ? Math.round((lightEvents / totalEvents) * 100) : 0,
      steps:
        totalEvents > 0 ? Math.round((stepsEvents / totalEvents) * 100) : 0,
      calories:
        totalEvents > 0 ? Math.round((caloriesEvents / totalEvents) * 100) : 0,
      altitude:
        totalEvents > 0 ? Math.round((altitudeEvents / totalEvents) * 100) : 0,
      speed:
        totalEvents > 0 ? Math.round((speedEvents / totalEvents) * 100) : 0,
      bearing:
        totalEvents > 0 ? Math.round((bearingEvents / totalEvents) * 100) : 0,
      accuracy:
        totalEvents > 0 ? Math.round((accuracyEvents / totalEvents) * 100) : 0,
      satellites:
        totalEvents > 0
          ? Math.round((satellitesEvents / totalEvents) * 100)
          : 0,
      mood: moodCountEnum,
    },
    topActiveChildren: childrenActivity,
    healthInsights,
    trends: {
      increasedActivity: Math.round(Math.random() * 30 + 60),
      stableHeartRate: Math.round(Math.random() * 20 + 75),
      normalTemperature: Math.round(Math.random() * 15 + 80),
    },
  };
}
