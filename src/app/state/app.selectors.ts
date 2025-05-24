import { createFeatureSelector } from "@ngrx/store";
import { AppStore } from "./app.store";

export const selectAppState = createFeatureSelector<AppStore>('authState');