export async function getThemeStore() {
	const {themeStore} = await import('./styles/styles.js');
	return themeStore;
}

export async function getSettingsDialog() {
	const {settingsDialog} = await import('./settings/settings-dialog.js');
	return settingsDialog;
}

export async function openSettingsDialog() {
	const dialog = await getSettingsDialog();
	dialog.show();
}

export async function getDataVisualiserDialog() {
	const {dataVisualiser} = await import('./data-visualiser/data-visualiser.js');
	return dataVisualiser;
}
export async function openDataVisualiserDialog() {
	const dialog = await getDataVisualiserDialog();
	dialog.show();
}
