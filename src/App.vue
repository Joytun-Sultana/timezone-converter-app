<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { countryToIanaMap } from "./config/timezones";
import { convert, toUtcFromLocal } from "./utils/timezone";

const sourceTimezone = ref("Asia/Dhaka");
const targetTimezone = ref("Europe/Oslo");
const localDatetime = ref("");
const utcDatetime = ref("");
const inputError = ref("");

const timezoneOptions = computed(() => {
  const mapped = Object.values(countryToIanaMap).flat();
  return Array.from(new Set(["UTC", ...mapped])).sort();
});

function updateUtcState(): void {
  if (!localDatetime.value) {
    utcDatetime.value = "";
    inputError.value = "";
    return;
  }

  const utcResult = toUtcFromLocal(localDatetime.value, sourceTimezone.value);
  if (!utcResult.ok) {
    utcDatetime.value = "";
    inputError.value =
      utcResult.error === "INVALID_TIMEZONE"
        ? "Invalid source timezone."
        : "Invalid local datetime.";
    return;
  }

  utcDatetime.value = utcResult.value;
  inputError.value = "";
}

watch([sourceTimezone, localDatetime], updateUtcState, { immediate: true });

const convertedOutput = computed(() => {
  if (!utcDatetime.value) {
    return "";
  }

  const result = convert(utcDatetime.value, targetTimezone.value);
  return result.ok ? result.value : result.error;
});
</script>

<template>
  <main class="page-shell">
    <section class="card">
      <h1 class="title">Timezone Converter</h1>

      <div class="form-grid">
        <div class="field">
          <label for="source-timezone" class="field-label">Source timezone</label>
          <select
            id="source-timezone"
            v-model="sourceTimezone"
            data-testid="source-timezone"
            class="input"
          >
            <option v-for="timezone in timezoneOptions" :key="`src-${timezone}`" :value="timezone">
              {{ timezone }}
            </option>
          </select>
        </div>

        <div class="field">
          <label for="local-datetime" class="field-label">Local datetime</label>
          <input
            id="local-datetime"
            v-model="localDatetime"
            type="datetime-local"
            data-testid="local-datetime"
            class="input"
          />
        </div>

        <div class="field">
          <label for="target-timezone" class="field-label">Target timezone</label>
          <select
            id="target-timezone"
            v-model="targetTimezone"
            data-testid="target-timezone"
            class="input"
          >
            <option v-for="timezone in timezoneOptions" :key="`dst-${timezone}`" :value="timezone">
              {{ timezone }}
            </option>
          </select>
        </div>
      </div>

      <section class="result-box">
        <p class="line" data-testid="stored-utc"><strong>Stored UTC:</strong> {{ utcDatetime || "-" }}</p>
        <p v-if="inputError" class="error">{{ inputError }}</p>
        <p class="line" data-testid="converted-output">
          <strong>Converted output:</strong> {{ convertedOutput || "-" }}
        </p>
      </section>
    </section>
  </main>
</template>

<style scoped>
.page-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
}

.card {
  width: 100%;
  max-width: 72rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow:
    0 10px 15px -3px rgb(15 23 42 / 0.08),
    0 4px 6px -4px rgb(15 23 42 / 0.08);
  padding: 1.5rem;
}

.title {
  margin: 0 0 1.25rem;
  font-size: 1.75rem;
  line-height: 2.25rem;
  font-weight: 700;
  color: #0f172a;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: #334155;
}

.input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.95rem;
  color: #0f172a;
  background: #ffffff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.2);
}

.result-box {
  margin-top: 1.25rem;
  border: 1px solid #c7d2fe;
  border-radius: 0.875rem;
  background: #eef2ff;
  padding: 1rem;
}

.line {
  margin: 0;
  color: #1e293b;
}

.line + .line {
  margin-top: 0.5rem;
}

.error {
  margin: 0.5rem 0 0;
  color: #b91c1c;
  font-weight: 600;
}

@media (min-width: 960px) {
  .card {
    padding: 2rem;
  }

  .form-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 3rem;
  }
}
</style>
