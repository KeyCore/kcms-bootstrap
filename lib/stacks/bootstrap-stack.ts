import * as cdk from 'aws-cdk-lib';
import {
    aws_iam as iam
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Context } from '../../context';
import { BootstrapCoreAutomation } from './enable-core';

export class KCMSBootstrapStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: cdk.StackProps, context: Context) {
        super(scope, id, props);

        new iam.Role(this, 'KeyCoreOnboardingRole', {
            assumedBy: new iam.CompositePrincipal(
                new iam.AccountPrincipal(context.serviceAccount),
                new iam.ServicePrincipal('ssm.amazonaws.com')
            ),
            roleName: 'KeyCoreOnboardingRole',
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess') // TODO - reduce permissions
            ]
        });
        new BootstrapCoreAutomation(this, 'BootstrapCoreAutomation');
    }
}