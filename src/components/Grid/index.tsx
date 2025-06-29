import { Component, createEffect, createSignal, onMount } from "solid-js";
import {
	createGrid,
	ModuleRegistry,
	AllCommunityModule,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

export const Grid: Component = () => {
	const [isLoading, setIsLoading] = createSignal(false);

	let gridContainerRef: HTMLDivElement;
	let gridApi: ReturnType<typeof createGrid<any>>;

	onMount(() => {
		gridApi = createGrid(gridContainerRef, {
			// Row Data: The data to be displayed.
			rowData: [
				{ make: "Tesla", model: "Model Y", price: 64950, electric: true },
				{ make: "Ford", model: "F-Series", price: 33850, electric: false },
				{ make: "Toyota", model: "Corolla", price: 29600, electric: false },
			],

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
		});
	});

	return (
		<div class="h-full">
			<button onclick={() => setIsLoading((prev) => !prev)}>
				Change loading state
			</button>
			<div ref={gridContainerRef} class="h-full" />
		</div>
	);
};
