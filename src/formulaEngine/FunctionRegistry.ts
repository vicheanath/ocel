// formulaEngine/FunctionRegistry.ts
import type { CellValue, SpreadsheetData } from "../types";
import { registerMathFunctions } from "./functions/mathFunctions";
import { registerStatisticalFunctions } from "./functions/statisticalFunctions";
import { registerLogicalFunctions } from "./functions/logicalFunctions";
import { registerTextFunctions } from "./functions/textFunctions";
import { registerLookupFunctions } from "./functions/lookupFunctions";
import { registerDateTimeFunctions } from "./functions/dateTimeFunctions";
import { registerFinancialFunctions } from "./functions/financialFunctions";
import { registerInformationFunctions } from "./functions/informationFunctions";
import { registerDatabaseFunctions } from "./functions/databaseFunctions";
import { registerEngineeringFunctions } from "./functions/engineeringFunctions";
import { registerWebFunctions } from "./functions/webFunctions";
import { registerLegacyFunctions } from "./functions/legacyFunctions";

type FunctionImplementation = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[],
  context: { cellId: string; spreadsheetData: SpreadsheetData }
) => CellValue | CellValue[];

export interface FunctionMetadata {
  description: string;
  syntax: string;
  category: string;
  examples: string[];
}

export class FunctionRegistry {
  private static instance: FunctionRegistry;
  private functions: Map<string, FunctionImplementation>;
  private metadata: Map<string, FunctionMetadata>;

  private constructor() {
    this.functions = new Map();
    this.metadata = new Map();
    this.registerDefaultFunctions();
    console.log(
      `Initialized FunctionRegistry with ${this.functions.size} functions`
    );
  }

  public static getInstance(): FunctionRegistry {
    if (!FunctionRegistry.instance) {
      FunctionRegistry.instance = new FunctionRegistry();
    }
    return FunctionRegistry.instance;
  }

  private registerDefaultFunctions() {
    // ===== REGISTER ALL FUNCTION CATEGORIES =====
    registerMathFunctions(this);
    registerStatisticalFunctions(this);
    registerLogicalFunctions(this);
    registerTextFunctions(this);
    registerLookupFunctions(this);
    registerDateTimeFunctions(this);
    registerFinancialFunctions(this);
    registerInformationFunctions(this);
    registerDatabaseFunctions(this);
    registerEngineeringFunctions(this);
    registerWebFunctions(this);
    registerLegacyFunctions(this);

    console.log(
      `Registered ${this.functions.size} functions across 12 categories`
    );
  }

  register(
    name: string,
    implementation: FunctionImplementation,
    metadata: FunctionMetadata
  ) {
    const normalizedName = name.toUpperCase();
    this.functions.set(normalizedName, implementation);
    this.metadata.set(normalizedName, metadata);
  }

  execute(
    functionName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[],
    context: { cellId: string; spreadsheetData: SpreadsheetData }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    const normalizedName = functionName.toUpperCase();
    const func = this.functions.get(normalizedName);
    if (!func) throw new Error(`Function ${functionName} not found`);
    return func(args, context);
  }

  getFunctionMetadata(functionName: string): FunctionMetadata | undefined {
    return this.metadata.get(functionName.toUpperCase());
  }

  getAllFunctions(): Map<string, FunctionMetadata> {
    return new Map(this.metadata);
  }

  isFunctionRegistered(functionName: string): boolean {
    return this.functions.has(functionName.toUpperCase());
  }
}
