// src/settings.ts

import {App, PluginSettingTab, Setting} from 'obsidian'
import RTOPlugin from 'main'

export interface RTOSettings {
  bearerToken: string | null
  noteLocation: string | null
  downloadAssets: boolean
  assetLocation: string | null
  filename: string | null
}

export const DEFAULT_SETTINGS: RTOSettings = {
  bearerToken: null,
  noteLocation: '',
  downloadAssets: false,
  assetLocation: '',
  filename: null,
}

export class RTOSettingTab extends PluginSettingTab {
  plugin: RTOPlugin

  constructor(app: App, plugin: RTOPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const {containerEl} = this
    containerEl.empty()
    containerEl.createEl('h2', {text: 'Settings for Raindrop.io to Obsidian'})

    new Setting(containerEl)
      .setName('Bearer Token')
      .setDesc('Enter your RaindropIO bearer token.')
      .addText(text =>
        text
          .setPlaceholder('RaindropIO bearer token')
          .setValue(this.plugin.settings.bearerToken)
          .onChange(async value => {
            this.plugin.settings.bearerToken = value
            await this.plugin.saveSettings()
          })
      )
  }
}
