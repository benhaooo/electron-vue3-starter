// Common type definitions for the renderer process

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  fontSize: number
  notifications: {
    desktop: boolean
    sound: boolean
    autoHide: boolean
  }
  performance: {
    hardwareAcceleration: boolean
    backgroundProcessing: boolean
    memoryLimit: number
  }
  privacy: {
    analytics: boolean
    crashReports: boolean
  }
}

export interface SystemInfo {
  platform: string
  version: string
  electronVersion: string
  nodeVersion: string
  chromeVersion: string
}

export interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

export interface FormData {
  name: string
  email: string
  message: string
}

export interface FormErrors {
  name: string
  email: string
  message: string
}

export interface Theme {
  value: string
  label: string
  color: string
}

export interface NavigationRoute {
  path: string
  name: string
}
