/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from 'vs/base/common/codicons';
import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';
import { Disposable } from 'vs/base/common/lifecycle';
import 'vs/css!./media/explorerviewlet';
import { localize } from 'vs/nls';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IContextKey, IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { SyncDescriptor } from 'vs/platform/instantiation/common/descriptors';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IProgressService } from 'vs/platform/progress/common/progress';
import { Registry } from 'vs/platform/registry/common/platform';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { registerIcon } from 'vs/platform/theme/common/iconRegistry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { AddRootFolderAction } from 'vs/workbench/browser/actions/workspaceActions';
import { ViewPane } from 'vs/workbench/browser/parts/views/viewPane';
import { ViewPaneContainer } from 'vs/workbench/browser/parts/views/viewPaneContainer';
import { IViewletViewOptions } from 'vs/workbench/browser/parts/views/viewsViewlet';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { Extensions, IViewContainersRegistry, IViewDescriptor, IViewDescriptorService, IViewsRegistry, ViewContainer, ViewContainerLocation, ViewContentGroups } from 'vs/workbench/common/views';
import { ExplorerView } from 'vs/workbench/contrib/files/browser/views/explorerView';
import { OpenEditorsView } from 'vs/workbench/contrib/files/browser/views/openEditorsView';
import { EmptyView } from 'vs/workbench/contrib/tools/browser/views/emptyView';
import { ToolView } from 'vs/workbench/contrib/tools/browser/views/toolView';
import { ExplorerViewletVisibleContext, IFilesConfiguration, VIEWLET_ID, VIEW_ID } from 'vs/workbench/contrib/tools/common/files';
import { IExtensionService } from 'vs/workbench/services/extensions/common/extensions';
import { IWorkbenchLayoutService } from 'vs/workbench/services/layout/browser/layoutService';

const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);
const explorerViewIcon = registerIcon('explorer-view-icon', Codicon.files, localize('explorerViewIcon', 'View icon of the explorer view.'));

export class ToolViewletViewsContribution extends Disposable implements IWorkbenchContribution {

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@IProgressService progressService: IProgressService
	) {
		super();

		this.registerViews();
	}

	private registerViews(): void {

		let viewDescriptorsToRegister: IViewDescriptor[] = [];
		const emptyViewDescriptor = this.createEmptyViewDescriptor();
		const toolViewDescriptor = this.createToolViewDescriptor();

		viewDescriptorsToRegister.push(toolViewDescriptor);
		viewDescriptorsToRegister.push(emptyViewDescriptor);

		viewsRegistry.registerViews(viewDescriptorsToRegister, VIEW_CONTAINER);

	}

	private createToolViewDescriptor(): IViewDescriptor {
		return {
			id: ToolView.ID,
			name: ToolView.NAME,
			containerIcon: explorerViewIcon,
			ctorDescriptor: new SyncDescriptor(ToolView),
			order: 1,
			canToggleVisibility: true,
			// focusCommand: {
			// 	id: 'workbench.explorer.fileView.focus'
			// }
		};
	}

	private createEmptyViewDescriptor(): IViewDescriptor {
		return {
			id: EmptyView.ID,
			name: EmptyView.NAME,
			containerIcon: explorerViewIcon,
			ctorDescriptor: new SyncDescriptor(EmptyView),
			order: 1,
			canToggleVisibility: true,
			focusCommand: {
				id: 'workbench.explorer.fileView.focus'
			}
		};
	}
}

export class ExplorerViewPaneContainer extends ViewPaneContainer {

	private viewletVisibleContextKey: IContextKey<boolean>;

	constructor(
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IThemeService themeService: IThemeService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IExtensionService extensionService: IExtensionService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService
	) {

		super(VIEWLET_ID, { mergeViewWithContainerWhenSingleView: true }, instantiationService, configurationService, layoutService, contextMenuService, telemetryService, extensionService, themeService, storageService, contextService, viewDescriptorService);

		this.viewletVisibleContextKey = ExplorerViewletVisibleContext.bindTo(contextKeyService);

		this._register(this.contextService.onDidChangeWorkspaceName(e => this.updateTitleArea()));
	}

	override create(parent: HTMLElement): void {
		super.create(parent);
		parent.classList.add('explorer-viewlet');
	}

	protected override createView(viewDescriptor: IViewDescriptor, options: IViewletViewOptions): ViewPane {
		if (viewDescriptor.id === VIEW_ID) {
			return this.instantiationService.createInstance(ExplorerView, options, {
				willOpenElement: e => {
					if (!(e instanceof MouseEvent)) {
						return; // only delay when user clicks
					}

					const openEditorsView = this.getOpenEditorsView();
					if (openEditorsView) {
						let delay = 0;

						const config = this.configurationService.getValue<IFilesConfiguration>();
						if (!!config.workbench?.editor?.enablePreview) {
							// delay open editors view when preview is enabled
							// to accomodate for the user doing a double click
							// to pin the editor.
							// without this delay a double click would be not
							// possible because the next element would move
							// under the mouse after the first click.
							delay = 250;
						}

						openEditorsView.setStructuralRefreshDelay(delay);
					}
				},
				didOpenElement: e => {
					if (!(e instanceof MouseEvent)) {
						return; // only delay when user clicks
					}

					const openEditorsView = this.getOpenEditorsView();
					if (openEditorsView) {
						openEditorsView.setStructuralRefreshDelay(0);
					}
				}
			});
		}
		return super.createView(viewDescriptor, options);
	}

	getExplorerView(): ExplorerView {
		return <ExplorerView>this.getView(VIEW_ID);
	}

	getOpenEditorsView(): OpenEditorsView {
		return <OpenEditorsView>this.getView(OpenEditorsView.ID);
	}

	override setVisible(visible: boolean): void {
		this.viewletVisibleContextKey.set(visible);
		super.setVisible(visible);
	}

	override focus(): void {
		const explorerView = this.getView(VIEW_ID);
		if (explorerView && this.panes.every(p => !p.isExpanded())) {
			explorerView.setExpanded(true);
		}
		if (explorerView?.isExpanded()) {
			explorerView.focus();
		} else {
			super.focus();
		}
	}
}

const viewContainerRegistry = Registry.as<IViewContainersRegistry>(Extensions.ViewContainersRegistry);

/**
 * Explorer viewlet container.
 */
export const VIEW_CONTAINER: ViewContainer = viewContainerRegistry.registerViewContainer({
	id: VIEWLET_ID,
	title: localize('explore', "Explorer"),
	ctorDescriptor: new SyncDescriptor(ExplorerViewPaneContainer),
	storageId: 'workbench.explorer.views.state',
	icon: explorerViewIcon,
	alwaysUseContainerInfo: true,
	order: 0,
	openCommandActionDescriptor: {
		id: VIEWLET_ID,
		title: localize('explore', "Explorer"),
		mnemonicTitle: localize({ key: 'miViewExplorer', comment: ['&& denotes a mnemonic'] }, "&&Explorer"),
		keybindings: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KEY_E },
		order: 0
	},
}, ViewContainerLocation.Sidebar, { isDefault: true });

// viewsRegistry.registerViewWelcomeContent(EmptyView.ID, {
// 	content: 'aa',
// 	group: ViewContentGroups.Open,
// 	order: 1
// });

viewsRegistry.registerViewWelcomeContent(EmptyView.ID, {
	content: localize({ key: 'noWorkspaceHelp', comment: ['Please do not translate the word "commmand", it is part of our internal syntax which must not change'] },
		"You have not yet added a folder to the workspace.\n[Open Folder](command:{0})", AddRootFolderAction.ID),
	group: ViewContentGroups.Open,
	order: 1
});
