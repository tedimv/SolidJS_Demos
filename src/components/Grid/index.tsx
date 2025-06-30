import { Component, createEffect, createSignal, onMount } from "solid-js";
import {
	createGrid,
	ModuleRegistry,
	AllCommunityModule,
} from "ag-grid-community";
import { createMutable } from "solid-js/store";

ModuleRegistry.registerModules([AllCommunityModule]);

const globalStore = createMutable({
	somepanelIdData: [
		{ make: "Tesla", model: "Model Y", price: 64950, electric: true },
		{ make: "Ford", model: "F-Series", price: 33850, electric: false },
		{ make: "Toyota", model: "Corolla", price: 29600, electric: false },
		{ make: "Mercedes", model: "SZ101230102", price: 2960000, electric: false },
	],
});

const [rowsData] = createSignal([
	{ make: "Tesla", model: "Model Y", price: 64950, electric: true },
	{ make: "Ford", model: "F-Series", price: 33850, electric: false },
	{ make: "Toyota", model: "Corolla", price: 29600, electric: false },
]);

console.log([rowsData(), globalStore.somepanelIdData]);

export const Grid: Component = () => {
	const [isLoading, setIsLoading] = createSignal(false);
	const [rowsDataSource, setRowsDataSource] = createSignal<
		"observable" | "signal"
	>("observable");

	let gridContainerRef: HTMLDivElement;
	let gridApi: ReturnType<typeof createGrid<any>>;

	onMount(() => {
		gridApi = createGrid(gridContainerRef, {
			// Row Data: The data to be displayed.

			rowData: [],

			rowClass: "w-full",
			// Column Definitions: Defines the columns to be displayed.
			columnDefs: [
				{ field: "make" },
				{ field: "model" },
				{ field: "price" },
				{ field: "electric" },
			],

			onColumnMoved: (e) => {
				console.log(e);
			},
		});
	});

	createEffect(() => {
		// Runs kindof like React's useEffect except the component never rerenders
		// - state updates recalculate dependant derived values without unmounting/remounting

		// It still runs on mount + when any of the signals/observables inside change
		// and it autotracks dependencies (no dependency array needed)
		gridApi.updateGridOptions({
			loading: isLoading(),
			// works equally well with observable objects and with plain JS objects which are returned from signals
			rowData:
				rowsDataSource() === "observable"
					? globalStore.somepanelIdData
					: rowsData(),
		});
	});

	return (
		<div class="h-full">
			<button onclick={() => setIsLoading((prev) => !prev)}>
				Change loading state
			</button>
			<button
				style={{ "margin-left": "10px" }}
				onclick={() =>
					setRowsDataSource((prev) =>
						prev === "observable" ? "signal" : "observable",
					)
				}
			>
				Change rows data source. Current: {rowsDataSource()}
			</button>
			<div ref={gridContainerRef} class="h-full" />
		</div>
	);
};
