// src/index.ts

import React from "react";
import ReactDOM from "react-dom";
import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import { DEFAULT_SETTINGS, RTOSettings, RTOSettingTab } from 'src/settings'
import ViewRaindrops from "./ui/ViewRaindrops";

const VIEW_TYPE = "react-view-raindrop";

class MyReactView extends ItemView {
  private reactComponent: React.ReactElement;

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return "View Raindrops";
  }

  getIcon(): string {
    return "crossed-star";
  }

  async onOpen(): Promise<void> {
    this.reactComponent = React.createElement(ViewRaindrops);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ReactDOM.render(this.reactComponent, (this as any).contentEl);
  }
}

export default class RTOPlugin extends Plugin {
  private view: MyReactView;
  settings: RTOSettings;
  bearerToken: string;

  async onload(): Promise<void> {
		await this.loadSettings();
		// clean up null string default settings
		if (this.settings.noteLocation === null) {
			this.settings.noteLocation = ''
			console.info('Cleaning up note location setting.')
			await this.saveSettings()
		}
		if (this.settings.assetLocation === null) {
			this.settings.assetLocation = ''
			console.info('Cleaning up asset location setting.')
			await this.saveSettings()
		}

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new RTOSettingTab(this.app, this));
		
		// This adds a view to the workspace
		this.registerView(
			VIEW_TYPE,
			(leaf: WorkspaceLeaf) => (this.view = new MyReactView(leaf))
		);
		this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
  }

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings(): Promise<void> {
	await this.saveData(this.settings)
	}
  
  onLayoutReady(): void {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
      return;
    }
    this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE,
    });
  }
}

