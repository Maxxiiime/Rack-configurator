# Rack 3D Configurator

## 🏗️ Project Architecture 

The application uses a **Strategy / Plugin-Based Architecture**. The main objective is to completely decouple the specific business logic of each rack type (Cantilever, Pallet, etc.) from the main interface (the Shell).

### 1. The "Shell" (Generic Core)
The core application handles navigation, layout, and the basic 3D environment, but **is completely agnostic to rack-specific logic**.

- **`src/features/ThreeCanvas/`**: Manages the global 3D scene (`<Canvas>`, `<Stage>`, `<OrbitControls>`, lighting) and dynamically injects the 3D renderer of the active product (`activeProduct.Renderer`).
- **`src/features/Sidepanel/`**: Manages the side configuration panel. It dynamically generates its tabs and content based on the steps provided by the product (`activeProduct.steps`).
- **`src/router/`**: Uses the URL (`/configurator/:productId`) to determine which rack type to load.

### 2. The Product Registry (`src/products/`)
The "Products" module bridges the Shell and specific implementations:

- **`types.ts`**: Defines the strict `ProductDefinition` contract that every rack plugin must adhere to (stores, 3D components, UI steps, pricing/BOM hooks). It also defines mandatory minimal interfaces like `BaseEditorState`.
- **`registry.ts`**: Registers available plugins and allows dynamic resolution.
- **`ProductContext.tsx`**: A React Context Provider (`ProductProvider`) that wraps the app and exposes the active product via the `useActiveProduct()` hook.

### 3. Plugins (e.g., `src/products/cantilever/`)
Each rack type is a completely isolated "Plugin". If you delete the `cantilever` folder, the project will still compile but will no longer offer that rack type. A plugin contains:

- **`index.ts`**: Exports a `ProductDefinition` object.
- **`components/`**: All specific 3D components (e.g., `CantileverRenderer`, `ArmAssembly`, `CameraAutoZoom`).
- **`panels/`**: UI components for the Sidepanel (`Step1`, `Step2`, etc.).
- **`stores/`**: Zustand state specific to this product (`configStore`, `editorStore`, `sectionsStore`).
- **`hooks/`**: Specific business logic (pricing calculation, Bill of Materials/BOM, anchor position calculations).

### 4. Shared Components (`src/components/`)
To prevent code duplication across future plugins, transversal elements are centralized:

- **`src/components/3d/`**: Reusable components within the R3F environment (e.g., `BasePart` for dynamically loading a GLTF, `Button3D`, `DimensionLines`).
- **`src/components/ui/`**: Generic UI components (e.g., `Stepper`, layout buttons).
- **`src/hooks/` & `src/utils/`**: Mathematical utilities or global hooks independent of business logic.

---

## 🚀 Adding a New Rack Type

Adding a new rack type (e.g., `pallet`) is straightforward and requires zero modifications to the core application:

1. Create a new `src/products/pallet/` folder.
2. Implement your Zustand stores (ensuring the UI Store adheres to `BaseEditorState`).
3. Create your 3D components and configuration panels (`Step1.tsx`, etc.).
4. Create the `src/products/pallet/index.ts` file that exports your `ProductDefinition`.
5. Import and register this new plugin in `src/products/index.ts`.
6. The rack will instantly be accessible via the `/configurator/pallet` URL!

