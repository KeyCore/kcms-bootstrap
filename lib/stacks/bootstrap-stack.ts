import * as cdk from 'aws-cdk-lib';
import {
    aws_iam as iam,
} from 'aws-cdk-lib';

import { Construct } from 'constructs';

interface BootstrapStackProps extends cdk.StackProps {
}

export class BootstrapStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: BootstrapStackProps) {
        super(scope, id, props);

        const role = new iam.Role(this, 'KeyCoreOnboardingRole', {
            assumedBy: new iam.ServicePrincipal('servicecatalog.amazonaws.com'),
            roleName: 'KeyCoreOnboardingRole',
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
            ]
        });
    }

}