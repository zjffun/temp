/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from 'vs/base/browser/dom';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { ILabelService } from 'vs/platform/label/common/label';
import { WorkbenchCompressibleAsyncDataTree } from 'vs/platform/list/browser/listService';
import { IOpenerService } from 'vs/platform/opener/common/opener';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IWorkspaceContextService, WorkbenchState } from 'vs/platform/workspace/common/workspace';
import { ViewPane } from 'vs/workbench/browser/parts/views/viewPane';
import { IViewletViewOptions } from 'vs/workbench/browser/parts/views/viewsViewlet';
import { SIDE_BAR_BACKGROUND } from 'vs/workbench/common/theme';
import { IViewDescriptorService } from 'vs/workbench/common/views';
import { ExplorerCompressionDelegate, ExplorerDelegate, FileDragAndDrop, FilesFilter, FileSorter } from 'vs/workbench/contrib/files/browser/views/explorerViewer';

export class ToolView extends ViewPane {

	static readonly ID: string = 'workbench.explorer.emptyView2';
	static readonly NAME = 'No Folder Opened1';

	static readonly TREE_VIEW_STATE_STORAGE_KEY: string = 'workbench.explorer.treeViewState';

	private filter!: FilesFilter;

	private renderer = {
		renderCompressedElements(e: any) {
			console.log(e);
			return '';
		}
	};

	private treeContainer!: HTMLElement;


	constructor(
		options: IViewletViewOptions,
		@IThemeService themeService: IThemeService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IConfigurationService configurationService: IConfigurationService,
		@ILabelService private labelService: ILabelService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IOpenerService openerService: IOpenerService,
		@ITelemetryService telemetryService: ITelemetryService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, telemetryService);

		this._register(this.contextService.onDidChangeWorkbenchState(() => this.refreshTitle()));
		this._register(this.labelService.onDidChangeFormatters(() => this.refreshTitle()));
	}

	override shouldShowWelcome(): boolean {
		return true;
	}

	// protected override renderBody(container: HTMLElement): void {
	// 	super.renderBody(container);

	// 	if (!isWeb) {
	// 		// Only observe in desktop environments because accessing
	// 		// locally dragged files and folders is only possible there
	// 		this._register(new DragAndDropObserver(container, {
	// 			onDrop: e => {
	// 				container.style.backgroundColor = '';
	// 				const dropHandler = this.instantiationService.createInstance(ResourcesDropHandler, { allowWorkspaceOpen: true });
	// 				dropHandler.handleDrop(e, () => undefined, () => undefined);
	// 			},
	// 			onDragEnter: () => {
	// 				const color = this.themeService.getColorTheme().getColor(listDropBackground);
	// 				container.style.backgroundColor = color ? color.toString() : '';
	// 			},
	// 			onDragEnd: () => {
	// 				container.style.backgroundColor = '';
	// 			},
	// 			onDragLeave: () => {
	// 				container.style.backgroundColor = '';
	// 			},
	// 			onDragOver: e => {
	// 				if (e.dataTransfer) {
	// 					e.dataTransfer.dropEffect = 'copy';
	// 				}
	// 			}
	// 		}));
	// 	}

	// 	this.refreshTitle();
	// }

	override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this.treeContainer = DOM.append(container, DOM.$('.explorer-folders-view'));

		this.createTree(this.treeContainer);
	}

	private createTree(container: HTMLElement): void {
		debugger
		const a = this.instantiationService.createInstance(WorkbenchCompressibleAsyncDataTree, 'FileExplorer11', container, new ExplorerDelegate(), new ExplorerCompressionDelegate(), ([this.renderer] as any),
			({
				hasChildren(element: any) {
					debugger;
					if (element === 1) {
						return false;
					}
					return true;
				},
				getChildren(element: any) {
					debugger;
					console.log(element)
					return [1];
				}
			} as any),
			{
				accessibilityProvider: {
					getAriaLabel() {
						return '';
					},
					getWidgetAriaLabel() {
						return '';
					}
				},
				multipleSelectionSupport: true,
				filter: this.filter,
				sorter: this.instantiationService.createInstance(FileSorter),
				dnd: this.instantiationService.createInstance(FileDragAndDrop),
				autoExpandSingleChildren: true,
				additionalScrollHeight: ExplorerDelegate.ITEM_HEIGHT,
				overrideStyles: {
					listBackground: SIDE_BAR_BACKGROUND
				}
			});
		a.updateChildren();
	}
	private refreshTitle(): void {
		if (this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE) {
			this.updateTitle(ToolView.NAME);
		} else {
			this.updateTitle(this.title);
		}
	}
}
