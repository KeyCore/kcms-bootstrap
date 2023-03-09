import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export type Context = {
    serviceAccount: string;
    portfolioId: string;
    toolchainName: string;
    toolchainVersion: string;
}

export function getContext(scope: Construct): Context {
    try {
        return {
            serviceAccount: scope.node.tryGetContext('serviceAccount'),
            portfolioId: scope.node.tryGetContext('portfolioId'),
            toolchainName: scope.node.tryGetContext('toolchainName'),
            toolchainVersion: scope.node.tryGetContext('toolchainVersion')
        }
    } catch (error) {
        console.error(error);
        throw (error);
    }
}

export function stackProps(account: string, region: string): cdk.StackProps {
    return {
        env: {
            account: account,
            region: region
        }
    }
}