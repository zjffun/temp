/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from 'vs/base/browser/dom';
import { Schemas } from 'vs/base/common/network';
import { URI } from 'vs/base/common/uri';
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
import { EditorInput } from 'vs/workbench/common/editor/editorInput';
import { SIDE_BAR_BACKGROUND } from 'vs/workbench/common/theme';
import { IViewDescriptorService } from 'vs/workbench/common/views';
import { ExplorerCompressionDelegate, ExplorerDelegate, FileDragAndDrop, FilesFilter, FileSorter } from 'vs/workbench/contrib/files/browser/views/explorerViewer';
import { GettingStartedInput } from 'vs/workbench/contrib/welcome/gettingStarted/browser/gettingStartedInput';
import { IEditorService } from 'vs/workbench/services/editor/common/editorService';
import { SyncDescriptor } from 'vs/platform/instantiation/common/descriptors';
import { Registry } from 'vs/platform/registry/common/platform';
import { EditorPaneDescriptor, IEditorPaneRegistry } from 'vs/workbench/browser/editor';
import { EditorPane } from 'vs/workbench/browser/parts/editor/editorPane';
import { EditorExtensions } from 'vs/workbench/common/editor';

import { IStorageService } from 'vs/platform/storage/common/storage';
import { IFileDialogService } from 'vs/platform/dialogs/common/dialogs';
import statistic from "./statistic";

export class GettingStartedInput1 extends EditorInput {

	static readonly ID = "test";
	static readonly RESOURCE = URI.from({ scheme: Schemas.walkThrough, authority: 'vscode_getting_started_page' });

	override get typeId(): string {
		return GettingStartedInput.ID;
	}

	get resource(): URI | undefined {
		return GettingStartedInput.RESOURCE;
	}

	override matches(other: EditorInput): boolean {
		if (super.matches(other)) {
			return true;
		}

		if (other instanceof GettingStartedInput) {
			return other.selectedCategory === this.selectedCategory;
		}
		return false;
	}

	constructor(
		options: { selectedCategory?: string, selectedStep?: string, showTelemetryNotice?: boolean, }
	) {
		super();
		this.selectedCategory = options.selectedCategory;
		this.selectedStep = options.selectedStep;
		this.showTelemetryNotice = !!options.showTelemetryNotice;
	}

	override getName() {
		return "Get Started1";
	}

	selectedCategory: string | undefined;
	selectedStep: string | undefined;
	showTelemetryNotice: boolean;
}

export class ToolEditorPane extends EditorPane {
	static ID = "test";
	fileDialogService: IFileDialogService;
	inputauthor: string;
	inputdir: string;
	constructor(
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IInstantiationService protected readonly _instantiationService: IInstantiationService,
		@ILabelService private readonly _labelService: ILabelService,
		@IStorageService storageService: IStorageService,
		@IFileDialogService fileDialogService: IFileDialogService,
	) {
		super(ToolEditorPane.ID, telemetryService, themeService, storageService);
		this.fileDialogService = fileDialogService
	}
	createEditor(parent: HTMLElement) {
		this.parent = parent;
		const btn = document.createElement('button');
		btn.textContent = 'folder';
		btn.addEventListener('click', () => {
			this.openFolder();
		})
		parent.append(btn)

		const input = document.createElement('input');
		input.addEventListener('change', (e: any) => {
			this.inputauthor = e.target.value;
		})
		parent.append(input)

		const runbtn = document.createElement('button');
		runbtn.textContent = 'run';
		runbtn.addEventListener('click', () => {
			this.run();
		})
		parent.append(runbtn)

	}
	public layout(): void {
		console.log('layout')
		// console.log(this.webview)

	}

	run() {
		console.log(this.inputauthor, this.inputdir)

		statistic(this.inputauthor, this.inputdir, (str) => {
			const div = document.createElement('div');
			div.textContent = str
			this.parent?.append(div)
		})
	}

	async openFolder() {
		const uri = await this.fileDialogService.showOpenDialog({ canSelectFolders: true })

		this.inputdir = uri![0].fsPath;
	}
}

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		ToolEditorPane,
		ToolEditorPane.ID,
		"Get Started1"
	),
	[
		new SyncDescriptor(GettingStartedInput1)
	]
);

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

	// private treeContainer!: HTMLElement;

	editorService: IEditorService;


	constructor(
		options: IViewletViewOptions,
		@IEditorService editorService: IEditorService,
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

		this.editorService = editorService;
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

		const treeContainer = DOM.append(container, DOM.$('.explorer-folders-view'));


		const tool1 = DOM.append(treeContainer, DOM.$('.explorer-folders-view'));

		tool1.textContent = "tool";
		tool1.addEventListener('click', () => {

			const editor = this.editorService.openEditor(new GettingStartedInput1({}), {});
			console.log(editor)
		});


		// this.createTree(this.treeContainer);

	}

	// private createTree(container: HTMLElement): void {
	// 	const a = this.instantiationService.createInstance(WorkbenchCompressibleAsyncDataTree, 'FileExplorer11', container, new ExplorerDelegate(), new ExplorerCompressionDelegate(), ([this.renderer] as any),
	// 		({
	// 			hasChildren(element: any) {
	// 				debugger;
	// 				if (element === 1) {
	// 					return false;
	// 				}
	// 				return true;
	// 			},
	// 			getChildren(element: any) {
	// 				debugger;
	// 				console.log(element)
	// 				return [1];
	// 			}
	// 		} as any),
	// 		{
	// 			accessibilityProvider: {
	// 				getAriaLabel() {
	// 					return '';
	// 				},
	// 				getWidgetAriaLabel() {
	// 					return '';
	// 				}
	// 			},
	// 			multipleSelectionSupport: true,
	// 			filter: this.filter,
	// 			sorter: this.instantiationService.createInstance(FileSorter),
	// 			dnd: this.instantiationService.createInstance(FileDragAndDrop),
	// 			autoExpandSingleChildren: true,
	// 			additionalScrollHeight: ExplorerDelegate.ITEM_HEIGHT,
	// 			overrideStyles: {
	// 				listBackground: SIDE_BAR_BACKGROUND
	// 			}
	// 		});
	// 	a.updateChildren();
	// }

	private refreshTitle(): void {
		if (this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE) {
			this.updateTitle(ToolView.NAME);
		} else {
			this.updateTitle(this.title);
		}
	}
}
