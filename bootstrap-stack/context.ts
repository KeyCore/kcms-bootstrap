import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';


export type KcmsToolchainContext = {
    portfolioId: string;
    productName: string;
    productId: string;
    version: string;
    provisionedName: string;
}
export type Context = {
    serviceAccount: string;
    serviceAccountStateMachineArn: string;
    kcmsToolchainProperties: KcmsToolchainContext;
}

export function getContext(scope: Construct): Context {
    try {
        return {
            serviceAccount: scope.node.tryGetContext('serviceAccount'),
            serviceAccountStateMachineArn: scope.node.tryGetContext('serviceAccountStateMachineArn'),
            kcmsToolchainProperties : scope.node.tryGetContext('kcmsToolchainProperties'),

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