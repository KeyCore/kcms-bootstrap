import * as cdk from 'aws-cdk-lib';
import {
    aws_iam as iam,
} from 'aws-cdk-lib';

import { Construct } from 'constructs';

interface BootstrapStackProps extends cdk.StackProps {
    serviceAccount: string
}

export class BootstrapStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: BootstrapStackProps) {
        super(scope, id, props);

        const serviceCatalogRole = new iam.Role(this, 'KeyCoreServiceCatalogRole', {
            assumedBy: new iam.ServicePrincipal('servicecatalog.amazonaws.com'),
            roleName: 'KeyCoreServiceCatalogRole',
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
            ]
        });
        const onboardingRole = new iam.Role(this, 'KeyCoreOnboardingRole', {
            assumedBy: new iam.AccountPrincipal(props.serviceAccount),
            roleName: 'KeyCoreOnboardingRole',
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
            ]
        });        
    }

}