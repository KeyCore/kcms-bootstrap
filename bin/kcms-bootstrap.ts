#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import "source-map-support/register";
import { KCMSBootstrapStack } from '../lib/stacks/bootstrap-stack';
import { getContext} from '../context';

const app = new cdk.App();
const context = getContext(app);
new KCMSBootstrapStack(app, 'KCMSBootstrapStack', {} , context);