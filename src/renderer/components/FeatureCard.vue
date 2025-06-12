<template>
  <div class="card hover:shadow-md transition-shadow duration-200">
    <div class="flex items-start space-x-4">
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon"></path>
          </svg>
        </div>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
        <p class="text-gray-600">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon: string
}

defineProps<Props>()
</script>
