import * as cdk from 'aws-cdk-lib';
import {
    aws_iam as iam
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Context } from '../../context';



export class KCMSBootstrapStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: cdk.StackProps, context: Context) {
        super(scope, id, props);

        const onboardingRole = new iam.Role(this, 'KeyCoreOnboardingRole', {
            assumedBy: new iam.CompositePrincipal(
                new iam.AccountPrincipal(context.serviceAccount)
            ),
            roleName: 'KeyCoreOnboardingRole',
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess') // TODO - reduce permissions
            ]
        });
        onboardingRole.grantAssumeRole(new iam.ServicePrincipal('ssm.amazonaws.com'));

        new iam.Role(this, 'KeyCoreOnboardingAutomationRole', {
            assumedBy: new iam.CompositePrincipal(
                new iam.AccountPrincipal(context.serviceAccount)
            ),
            externalIds: [context.serviceAccount],
            roleName: 'KeyCoreOnboardingAutomationRole',
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess') // TODO - reduce permissions
            ]
        });
    }

}
