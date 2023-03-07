#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import "source-map-support/register";
import { BootstrapStack } from '../lib/stacks/bootstrap-stack';
const app = new cdk.App();


new BootstrapStack(app, 'BootstrapStack', {
    serviceAccount: "685074242867"
});
