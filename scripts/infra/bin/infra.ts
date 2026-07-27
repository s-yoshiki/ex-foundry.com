#!/usr/bin/env -S node --import tsx
import { fileURLToPath } from "node:url";
import { buildApp } from "../src/app";

// scripts/infra/bin -> repository root
const repositoryRoot = fileURLToPath(new URL("../../..", import.meta.url));

buildApp({ repositoryRoot }).synth();
