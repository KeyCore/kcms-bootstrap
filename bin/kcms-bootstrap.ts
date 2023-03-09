#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import "source-map-support/register";
import { BootstrapStack } from '../lib/stacks/bootstrap-stack';
import { getContext, stackProps } from '../context';

const app = new cdk.App();
const context = getContext(app);
new BootstrapStack(app, 'BootstrapStack', {}, context);
