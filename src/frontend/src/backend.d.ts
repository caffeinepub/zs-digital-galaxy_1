import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Service {
    icon: string;
    name: string;
    description: string;
}
export interface PricingPlan {
    features: Array<string>;
    name: string;
    recommended: boolean;
    price: number;
}
export interface Contact {
    service: string;
    name: string;
    email: string;
    message: string;
}
export interface PortfolioItem {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
}
export interface backendInterface {
    addPortfolioItem(title: string, category: string, description: string, imageUrl: string): Promise<void>;
    addPricingPlan(name: string, price: number, features: Array<string>, recommended: boolean): Promise<void>;
    addService(name: string, description: string, icon: string): Promise<void>;
    deletePortfolioItem(title: string): Promise<void>;
    deletePricingPlan(name: string): Promise<void>;
    deleteService(name: string): Promise<void>;
    getAllContacts(): Promise<Array<Contact>>;
    getAllPortfolioItems(): Promise<Array<PortfolioItem>>;
    getAllPricingPlans(): Promise<Array<PricingPlan>>;
    getAllServices(): Promise<Array<Service>>;
    seedData(): Promise<void>;
    submitContact(name: string, email: string, service: string, message: string): Promise<void>;
    updatePortfolioItem(title: string, category: string, description: string, imageUrl: string): Promise<void>;
    updatePricingPlan(name: string, price: number, features: Array<string>, recommended: boolean): Promise<void>;
    updateService(name: string, description: string, icon: string): Promise<void>;
}
